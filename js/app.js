

/*
 * app.js — Ponto de organização da aplicação
 * Projeto: Aprendendo Idiomas
 *
 * Preparado para:
 * - Japonês
 * - Vietnamita
 * - Chinês
 * - Tailandês
 *
 * IMPORTANTE:
 * Este arquivo ainda não substitui nem executa
 * as funções existentes na V11.1.
 * A integração será feita posteriormente.
 */

(function () {
  "use strict";

  const LANGUAGES = Object.freeze({
    japones: {
      name: "Japonês",
      locale: "ja-JP"
    },
    vietnamita: {
      name: "Vietnamita",
      locale: "vi-VN"
    },
    chines: {
      name: "Chinês",
      locale: "zh-CN"
    },
    tailandes: {
      name: "Tailandês",
      locale: "th-TH"
    }
  });

  function getLanguage(languageId) {
    return LANGUAGES[languageId] || null;
  }

  function getAvailableLanguages() {
    return Object.entries(LANGUAGES).map(([id, language]) => ({
      id,
      name: language.name,
      locale: language.locale
    }));
  }

  function isModuleAvailable(moduleName) {
    return moduleName === "audio"
      ? Boolean(window.LanguageAudio)
      : moduleName === "progress"
        ? Boolean(window.ProgressStore)
        : moduleName === "firebase"
          ? Boolean(window.firebaseSync)
          : false;
  }

  window.LanguageApp = Object.freeze({
    getLanguage,
    getAvailableLanguages,
    isModuleAvailable
  });

  console.info("Estrutura do Aprendendo Idiomas preparada.");
})();

