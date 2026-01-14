import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en";
import es from "./locales/es";
import zh from "./locales/zh";
import ja from "./locales/ja";
import th from "./locales/th";
import hi from "./locales/hi";
import bn from "./locales/bn";
import pt from "./locales/pt";
import ru from "./locales/ru";
import pa from "./locales/pa";
import mr from "./locales/mr";
import fr from "./locales/fr";
import it from "./locales/it";
import de from "./locales/de";
import ar from "./locales/ar";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];

const LANGUAGE_STORAGE_KEY = "@thaiboxer_language";

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      // Fallback to device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";
      const supportedLanguage = SUPPORTED_LANGUAGES.find(
        (lang) => lang.code === deviceLanguage
      );
      callback(supportedLanguage ? deviceLanguage : "en");
    } catch (error) {
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: {
      en,
      es,
      zh,
      ja,
      th,
      hi,
      bn,
      pt,
      ru,
      pa,
      mr,
      fr,
      it,
      de,
      ar,
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
