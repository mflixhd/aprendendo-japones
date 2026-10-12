
/*
 * progress.js — armazenamento de progresso
 * Aprendendo Idiomas
 *
 * Cada idioma possui seu próprio espaço de salvamento.
 * Este módulo ainda será conectado à interface numa
 * etapa posterior.
 */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    japones: "japonesComChatGPT_save",
    vietnamita: "vietnamitaComChatGPT_save",
    chines: "chinesComChatGPT_save",
    tailandes: "tailandesComChatGPT_save"
  };

  const DEFAULTS = {
    japones: {
      score: 0,
      answered: 0,
      correct: 0,
      lessonDone: false,
      kanaStatus: {},
      speechRate: 0.7
    },

    vietnamita: {
      score: 0,
      answered: 0,
      correct: 0,
      lessonDone: false,
      letterStatus: {}
    },

    chines: {
      score: 0,
      answered: 0,
      correct: 0,
      lessonDone: false,
      characterStatus: {}
    },

    tailandes: {
      score: 0,
      answered: 0,
      correct: 0,
      lessonDone: false,
      characterStatus: {}
    }
  };

  function cloneDefault(language) {
    return JSON.parse(JSON.stringify(DEFAULTS[language]));
  }

  function isValidLanguage(language) {
    return Object.prototype.hasOwnProperty.call(
      STORAGE_KEYS,
      language
    );
  }

  function load(language) {
    if (!isValidLanguage(language)) {
      throw new Error(
        "Idioma não reconhecido: " + language
      );
    }

    const defaults = cloneDefault(language);

    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS[language]
      );

      if (!saved) {
        return defaults;
      }

      const parsed = JSON.parse(saved);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return defaults;
      }

      return {
        ...defaults,
        ...parsed
      };
    } catch (error) {
      console.warn(
        "Não foi possível carregar o progresso de " +
          language,
        error
      );

      return defaults;
    }
  }

  function save(language, progress) {
    if (!isValidLanguage(language)) {
      throw new Error(
        "Idioma não reconhecido: " + language
      );
    }

    if (
      !progress ||
      typeof progress !== "object" ||
      Array.isArray(progress)
    ) {
      throw new Error(
        "Os dados de progresso são inválidos."
      );
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS[language],
        JSON.stringify(progress)
      );

      return true;
    } catch (error) {
      console.warn(
        "Não foi possível salvar o progresso de " +
          language,
        error
      );

      return false;
    }
  }

  function reset(language) {
    if (!isValidLanguage(language)) {
      throw new Error(
        "Idioma não reconhecido: " + language
      );
    }

    try {
      localStorage.removeItem(STORAGE_KEYS[language]);
      return true;
    } catch (error) {
      console.warn(
        "Não foi possível limpar o progresso de " +
          language,
        error
      );

      return false;
    }
  }

  // API pública para os demais módulos do site
  window.ProgressStore = Object.freeze({
    load,
    save,
    reset,
    languages: Object.freeze(
      Object.keys(STORAGE_KEYS)
    )
  });
})();

