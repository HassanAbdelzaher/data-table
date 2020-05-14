import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const arTrans=require("../locales/ar.json")
const enTrans=require("../locales/en.json")
const storageName="locale"
const storedLang=localStorage.getItem(storageName)
export enum SupportedLocale{
    ARABIC="ar",
    ENGLISH="en"
}
export const lang=storedLang||SupportedLocale.ARABIC;
export const ChangeLang=(newLocale:SupportedLocale)=>{
    localStorage.setItem(storageName,newLocale)
    location.reload();
}
export const ToggleLanguage=()=>{
    let newLocale=(lang==SupportedLocale.ARABIC?SupportedLocale.ENGLISH:SupportedLocale.ARABIC)
    localStorage.setItem(storageName,newLocale)
    location.reload();
}
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: enTrans
  },
  ar: {
    translation: arTrans
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: lang,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;