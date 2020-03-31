import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import register_en from "../translations/en/register.json";
import header_en from "../translations/en/header.json";
import login_en from "../translations/en/login.json";
import profile_en from "../translations/en/profile.json";
import forgetpassword_en from "../translations/en/forgetpassword.json";
import profileedit_en from "../translations/en/profileedit.json";
import register_zh from "../translations/zh/register.json";
import header_zh from "../translations/zh/header.json";
import login_zh from "../translations/zh/login.json";
import profile_zh from "../translations/zh/profile.json";
import forgetpassword_zh from "../translations/zh/forgetpassword.json";
import profileedit_zh from "../translations/zh/profileedit.json";

// for passing in lng and translations on init

i18n
  // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },  
    ns: ["header","register","login"],  
    //lng: 'en',         // language to use
    resources: {
        en: {   
            header: header_en,  
            register: register_en,
            login: login_en,
            profile: profile_en,
            forgetpassword: forgetpassword_en,
            profileedit: profileedit_en              
        },
        'en-US': {   
            header: header_en,  
            register: register_en,
            login: login_en,
            profile: profile_en,
            forgetpassword: forgetpassword_en,
            profileedit: profileedit_en       
        },
        zh: {
            header: header_zh,
            register: register_zh,
            login: login_zh,
            profile: profile_zh,
            forgetpassword: forgetpassword_zh,
            profileedit: profileedit_zh         
        },
    },
  });


export default i18n;