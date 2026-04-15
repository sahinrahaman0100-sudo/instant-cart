import { createContext } from "react";
import type { Language } from "./translations";

export interface LanguageContextValue {
  language: Language;
  t: Record<string, string>;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
