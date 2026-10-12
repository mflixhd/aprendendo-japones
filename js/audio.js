
/*
 * audio.js — Sistema de áudio do Aprendendo Idiomas
 * Preparação para japonês, vietnamita, chinês e tailandês.
 *
 * Este módulo ainda não substitui as funções de áudio da V11.1.
 * A conexão será feita posteriormente, com cuidado.
 */

(function () {
  "use strict";

  const LANGUAGES = {
    japones: "ja-JP",
    vietnamita: "vi-VN",
    chines: "zh-CN",
    tailandes: "th-TH"
  };

  function speak(text, language, options = {}) {
    if (!("speechSynthesis" in window)) {
      console.warn("Este navegador não oferece síntese de voz.");
      return false;
    }

    const content = String(text ?? "").trim();
    const lang = LANGUAGES[language];

    if (!content || !lang) {
      console.warn("Texto vazio ou idioma não reconhecido.");
      return false;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(content);

    utterance.lang = lang;
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    if (typeof options.onEnd === "function") {
      utterance.onend = options.onEnd;
    }

    if (typeof options.onError === "function") {
      utterance.onerror = options.onError;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }

  function stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function getVoices(language) {
    if (!("speechSynthesis" in window)) {
      return [];
    }

    const lang = LANGUAGES[language];

    if (!lang) {
      return [];
    }

    return window.speechSynthesis
      .getVoices()
      .filter(voice => voice.lang.toLowerCase() === lang.toLowerCase());
  }

  window.LanguageAudio = Object.freeze({
    speak,
    stop,
    getVoices,
    languages: Object.freeze({ ...LANGUAGES })
  });
})();

