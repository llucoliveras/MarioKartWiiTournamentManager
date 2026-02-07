// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import es from "./es.json";
import ca from "./ca.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ca: { translation: ca }
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
