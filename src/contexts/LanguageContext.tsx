"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ml";

interface Translations {
  [key: string]: {
    en: string;
    ml: string;
  };
}

export const translations: Translations = {
  brandName: {
    en: "AnaVandi",
    ml: "ആനവണ്ടി",
  },
  tagline: {
    en: "Connecting Kerala, one route at a time.",
    ml: "കേരളത്തെ ബന്ധിപ്പിക്കുന്നു, ഒരോ റൂട്ടിലൂടെയും.",
  },
  subTagline: {
    en: "From paper timetables to intelligent journeys.",
    ml: "പേപ്പർ ടൈംടേബിളുകളിൽ നിന്ന് സ്മാർട്ട് യാത്രകളിലേക്ക്.",
  },
  dashboard: {
    en: "Dashboard",
    ml: "ഡാഷ്‌ബോർഡ്",
  },
  searchBuses: {
    en: "Search Buses",
    ml: "ബസ് തിരയുക",
  },
  uploadTimetable: {
    en: "Upload Timetable",
    ml: "ടൈംടേബിൾ അപ്‌ലോഡ് ചെയ്യുക",
  },
  verificationQueue: {
    en: "Verification Queue",
    ml: "പരിശോധന ക്യൂ",
  },
  timetableLibrary: {
    en: "Timetable Library",
    ml: "ടൈംടേബിൾ ശേഖരം",
  },
  routesAndStops: {
    en: "Routes & Stops",
    ml: "റൂട്ടുകളും സ്റ്റോപ്പുകളും",
  },
  interactiveMap: {
    en: "Route Map",
    ml: "റൂട്ട് മാപ്പ്",
  },
  aiSearch: {
    en: "AI Search",
    ml: "എഐ തിരച്ചിൽ",
  },
  compare: {
    en: "Compare Timetables",
    ml: "ടൈംടേബിൾ താരതമ്യം",
  },
  analytics: {
    en: "Analytics",
    ml: "വിശകലനം",
  },
  communityUpload: {
    en: "Community Upload",
    ml: "ജനകീയ സമർപ്പണം",
  },
  settings: {
    en: "Settings",
    ml: "ക്രമീകരണങ്ങൾ",
  },
  whereToGo: {
    en: "Where do you want to go?",
    ml: "എവിടേക്കാണ് പോകേണ്ടത്?",
  },
  boardingOrigin: {
    en: "Boarding Origin",
    ml: "പുറപ്പെടുന്ന സ്ഥലം",
  },
  destination: {
    en: "Destination",
    ml: "എത്തിച്ചേരേണ്ട സ്ഥലം",
  },
  travelDate: {
    en: "Travel Date",
    ml: "യാത്രാ തീയതി",
  },
  findBuses: {
    en: "Find Buses",
    ml: "ബസ് തിരയുക",
  },
  digitizeTimetable: {
    en: "Digitize Timetable",
    ml: "ടൈംടേബിൾ ഡിജിറ്റൈസ് ചെയ്യുക",
  },
  exploreRoutes: {
    en: "Explore Routes",
    ml: "റൂട്ടുകൾ കാണുക",
  },
  verifyAndPublish: {
    en: "Verify & Publish",
    ml: "സ്ഥിരീകരിച്ച് പ്രസിദ്ധീകരിക്കുക",
  },
  startAiExtraction: {
    en: "Start AI Extraction",
    ml: "എഐ എക്‌സ്‌ട്രാക്ഷൻ ആരംഭിക്കുക",
  },
  depotControlDesk: {
    en: "Depot Control Desk",
    ml: "ഡിപ്പോ കൺട്രോൾ ഡെസ്ക്",
  },
  liveGtfsSync: {
    en: "GTFS Sync: Live",
    ml: "ജി.ടി.എഫ്.എസ്: ലൈവ്",
  },
  pendingVerification: {
    en: "Pending Verification",
    ml: "സ്ഥിരീകരണത്തിനായി കാത്തിരിക്കുന്നു",
  },
  verified: {
    en: "Verified",
    ml: "സ്ഥിരീകരിച്ചു",
  },
  exportCsv: {
    en: "Export CSV",
    ml: "CSV ഡൗൺലോഡ്",
  },
  exportJson: {
    en: "Export JSON",
    ml: "JSON ഡൗൺലോഡ്",
  },
  exportGtfs: {
    en: "Export GTFS",
    ml: "GTFS ഡൗൺലോഡ്",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("anavandi_lang") as Language;
    if (saved === "en" || saved === "ml") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("anavandi_lang", lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
