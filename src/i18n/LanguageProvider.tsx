import { useMemo, useState, type PropsWithChildren } from "react";
import { safeStorage } from "../utils/storage";
import { translations, type Language } from "./translations";
import { LanguageContext } from "./LanguageContext";

const KEY = "instant-cart-lang";

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(
    () => (safeStorage.getItem(KEY) as Language | null) ?? "en",
  );

  const value = useMemo(
    () => ({
      language,
      t: translations[language],
      toggleLanguage: () =>
        setLanguage((prev) => {
          const next: Language = prev === "en" ? "bn" : "en";
          safeStorage.setItem(KEY, next);
          return next;
        }),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
