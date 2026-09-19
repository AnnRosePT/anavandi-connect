// src/services/pdfExportService.ts
// Generates a styled PDF timetable using jspdf and jspdf-autotable.
// Runs client-side (browser). Logo is loaded asynchronously via a Promise
// so drawContent() is always called after the image resolves/rejects.

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { TimetableRecord } from "@/types/timetable";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Load an <img> and resolve with the element, or reject on error. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Map a stop status string to an RGB tuple for row shading. */
function statusColor(
  status: string
): [number, number, number] | undefined {
  switch (status) {
    case "verified":
      return [232, 245, 233]; // light green
    case "needs_review":
      return [255, 248, 225]; // light amber
    case "corrected":
      return [227, 242, 253]; // light blue
    case "rejected":
      return [255, 235, 238]; // light red
    default:
      return undefined;
  }
}

// ── main export ──────────────────────────────────────────────────────────────

/**
 * Export a detailed, styled PDF of the timetable.
 * Includes branding header, two-column metadata panel, stop table with
 * per-row status colours, discrepancy summary, and a page-number footer.
 */
export async function exportTimetablePdf(
  timetable: TimetableRecord
): Promise<string> {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;

  // ── 1. Header band ──────────────────────────────────────────────────────
  // Deep KSRTC red background strip
  doc.setFillColor(183, 28, 28);
  doc.rect(0, 0, pageW, 80, "F");

  // Try to load logo; silently skip if it fails
  try {
    const logoImg = await loadImage("/assets/new-logo.png");
    doc.addImage(logoImg, "PNG", margin, 14, 52, 52);
  } catch {
    // no logo – continue
  }

  // Agency name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("Kerala State Road Transport Corporation", margin + 60, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(255, 204, 204);
  doc.text(
    `${timetable.serviceName || timetable.serviceType} Schedule  •  ${timetable.routeCode}`,
    margin + 60,
    54
  );

  // Confidence badge (top-right corner of band)
  const conf = timetable.overallConfidence;
  const badgeColor: [number, number, number] =
    conf >= 90 ? [67, 160, 71] : conf >= 75 ? [251, 140, 0] : [229, 57, 53];
  doc.setFillColor(...badgeColor);
  doc.roundedRect(pageW - margin - 72, 20, 72, 40, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`${conf}%`, pageW - margin - 36, 44, { align: "center" });
  doc.setFontSize(7);
  doc.text("OCR Confidence", pageW - margin - 36, 55, { align: "center" });

  // ── 2. Route title ──────────────────────────────────────────────────────
  let y = 100;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(33, 33, 33);
  doc.text(timetable.title, margin, y);

  if (timetable.titleMl) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(timetable.titleMl, margin, y + 16);
    y += 32;
  } else {
    y += 20;
  }

  // Thin separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 14;

  // ── 3. Two-column metadata panel ────────────────────────────────────────
  doc.setFontSize(9.5);
  const col1X = margin;
  const col2X = margin + contentW / 2 + 10;

  const leftMeta = [
    ["Origin", timetable.origin],
    ["Destination", timetable.destination],
    ["Via", timetable.viaSummary || "–"],
    ["Distance", `${timetable.totalDistanceKm} km`],
    ["Est. Duration", timetable.estimatedDuration],
  ];
  const rightMeta = [
    ["Vehicle No.", timetable.vehicleNo],
    ["Chassis Type", timetable.chassisType],
    ["Depot (Origin)", timetable.depotOrigin],
    ["Fare (Base)", `₹${timetable.fareInr}`],
    ["Verification", timetable.status],
  ];

  const metaRowH = 14;
  leftMeta.forEach(([label, value], i) => {
    const ry = y + i * metaRowH;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`${label}:`, col1X, ry);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(33, 33, 33);
    doc.text(value, col1X + 88, ry);
  });
  rightMeta.forEach(([label, value], i) => {
    const ry = y + i * metaRowH;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`${label}:`, col2X, ry);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(33, 33, 33);
    doc.text(value, col2X + 88, ry);
  });

  y += Math.max(leftMeta.length, rightMeta.length) * metaRowH + 18;

  // ── 4. Stops table ──────────────────────────────────────────────────────
  const tableColumns = [
    { header: "#",         dataKey: "seq"       },
    { header: "Code",      dataKey: "code"      },
    { header: "Stop Name", dataKey: "name"      },
    { header: "Arrival",   dataKey: "arrival"   },
    { header: "Departure", dataKey: "departure" },
    { header: "Platform",  dataKey: "platform"  },
    { header: "Conf %",    dataKey: "confidence"},
    { header: "Status",    dataKey: "status"    },
  ];

  const tableRows = timetable.stops.map((s) => ({
    seq:        String(s.seq),
    code:       s.code,
    name:       s.name,
    arrival:    s.arrival,
    departure:  s.departure,
    platform:   s.platform ?? "–",
    confidence: `${s.confidence}%`,
    status:     s.status.replace(/_/g, " "),
  }));

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [tableColumns.map((c) => c.header)],
    body: tableRows.map((row) =>
      tableColumns.map((c) => row[c.dataKey as keyof typeof row])
    ),
    theme: "grid",
    headStyles: {
      fillColor: [183, 28, 28],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5 },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 46 },
      2: { cellWidth: "auto" },
      3: { cellWidth: 52 },
      4: { cellWidth: 52 },
      5: { cellWidth: 48 },
      6: { cellWidth: 38, halign: "center" },
      7: { cellWidth: 60 },
    },
    // Per-row background colour based on status
    didParseCell(data) {
      if (data.section === "body") {
        const stop = timetable.stops[data.row.index];
        if (stop) {
          const bg = statusColor(stop.status);
          if (bg) data.cell.styles.fillColor = bg;
        }
      }
    },
    // Page-number footer on each page
    didDrawPage(data) {
      const pageCount = (doc.internal as unknown as { getNumberOfPages(): number }).getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageW / 2,
        pageH - 18,
        { align: "center" }
      );
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        margin,
        pageH - 18
      );
      doc.text(
        `Anavandi Connect – KSRTC Timetable Platform`,
        pageW - margin,
        pageH - 18,
        { align: "right" }
      );
    },
  });

  // ── 5. Discrepancy summary (below table) ────────────────────────────────
  const tableEndY: number = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable?.finalY ?? y + 200;

  if (timetable.discrepancies.length > 0) {
    let dy = tableEndY + 20;
    // Check if there's enough space; add new page if not
    if (dy + timetable.discrepancies.length * 13 + 30 > pageH - 40) {
      doc.addPage();
      dy = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(183, 28, 28);
    doc.text(`Discrepancy Log (${timetable.discrepancies.length} item${timetable.discrepancies.length > 1 ? "s" : ""})`, margin, dy);
    dy += 14;

    timetable.discrepancies.forEach((d, idx) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const summary =
        `${idx + 1}. Stop "${d.stopName}" – ${d.field}: printed "${d.printedValue}" vs handwritten "${d.handwrittenValue}" → ${d.selectedResolution.replace(/_/g, " ")}`;
      doc.text(summary, margin, dy, { maxWidth: contentW });
      dy += 13;
    });
  }

  // ── 6. Save ─────────────────────────────────────────────────────────────
  const filename = `${timetable.id}_timetable.pdf`;
  doc.save(filename);
  return filename;
}
