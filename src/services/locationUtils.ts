// City and Station Aliases for Kerala RTC search
export const KERALA_CITY_ALIASES: Record<string, string[]> = {
  trivandrum: [
    "thiruvananthapuram",
    "trivandrum",
    "thampanoor",
    "tvm",
    "തിരുവനന്തപുരം",
    "തമ്പാനൂർ",
  ],
  kollam: ["kollam", "quilon", "qln", "കൊല്ലം"],
  alappuzha: ["alappuzha", "alleppey", "alp", "ambalapuzha", "ആലപ്പുഴ"],
  kottayam: ["kottayam", "ktm", "കോട്ടയം"],
  ernakulam: [
    "kochi",
    "ernakulam",
    "cochin",
    "vyttila",
    "ers",
    "aluva",
    "angamaly",
    "എറണാകുളം",
    "കൊച്ചി",
    "വൈറ്റില",
    "ആലുവ",
  ],
  thrissur: ["thrissur", "trichur", "tcr", "sakthan", "chalakudy", "തൃശ്ശൂർ", "ചാലക്കുടി"],
  palakkad: ["palakkad", "palghat", "pgt", "alathur", "പാലക്കാട്"],
  kozhikode: ["kozhikode", "calicut", "clt", "mavoor", "കോഴിക്കോട്"],
  kannur: ["kannur", "cannanore", "can", "thalassery", "കണ്ണൂർ", "തലശ്ശേരി"],
  kasaragod: ["kasaragod", "kasargod", "ksd", "കാസർഗോഡ്"],
  kanyakumari: ["kanyakumari", "cape", "nagercoil", "കന്യാകുമാരി", "നാഗർകോവിൽ"],
  munnar: ["munnar", "adimali", "kothamangalam", "മൂന്നാർ", "അടിമാലി"],
};

/**
 * Check if a stop name matches a user search query, taking aliases and substrings into account.
 */
export function matchesPlace(stopName: string, searchQuery: string): boolean {
  if (!stopName || !searchQuery) return false;
  const s = stopName.toLowerCase().trim();
  const q = searchQuery.toLowerCase().trim();

  // Exact or direct substring match
  if (s.includes(q) || q.includes(s)) return true;

  // Search in alias dictionary
  for (const [, aliases] of Object.entries(KERALA_CITY_ALIASES)) {
    const qMatchesAlias = aliases.some(
      (a) => q.includes(a) || a.includes(q)
    );
    const stopMatchesAlias = aliases.some(
      (a) => s.includes(a) || a.includes(s)
    );

    if (qMatchesAlias && stopMatchesAlias) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes user input into a known canonical Kerala station if recognized.
 */
export function getCanonicalStationName(query: string): string {
  const q = query.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(KERALA_CITY_ALIASES)) {
    if (aliases.some((a) => q.includes(a) || a.includes(q))) {
      return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }
  return query;
}
