// i18n-config.js
// Production-ready i18next setup for static sites with RTL/LTR support

(function () {
  'use strict';

  var SAVED_LANG_KEY = 'i18nextLng';

  // Set html lang and dir attributes based on active language
  function setDocumentDirection(lng) {
    var dir = i18next.dir(lng);
    document.documentElement.setAttribute('lang', lng);
    document.documentElement.setAttribute('dir', dir);
  }

  // Sync all [data-i18n] elements with current translations
  window.updateContent = function updateContent() {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      var optionsAttr = el.getAttribute('data-i18n-options');
      var options = {};

      if (optionsAttr) {
        try {
          options = JSON.parse(optionsAttr);
        } catch (e) {
          console.warn('Invalid data-i18n-options on element', el, e);
        }
      }

      var translation = i18next.t(key, options);
      // Only overwrite if a translation was found (avoids blanking on missing keys)
      if (typeof translation === 'string' && translation !== key) {
        el.innerHTML = translation;
      }
    }
  };

  // Dispatch global event so other scripts/pages can react to language changes
  function notifyLanguageChange(lng) {
    try {
      window.dispatchEvent(new CustomEvent('i18nextLanguageChanged', {
        detail: { lng: lng, dir: i18next.dir(lng) }
      }));
    } catch (e) {
      // CustomEvent not supported in very old browsers
    }
  }

  // Switch language, direction, persist preference, and update DOM
  window.changeLanguage = function changeLanguage(lng) {
    if (!lng) return;

    // Optional: fade effect during language swap
    document.documentElement.classList.add('is-changing-language');

    i18next.changeLanguage(lng, function (err) {
      if (err) {
        console.error('Language change failed:', err);
        document.documentElement.classList.remove('is-changing-language');
        return;
      }
      setDocumentDirection(lng);
      window.updateContent();
      notifyLanguageChange(lng);

      try {
        localStorage.setItem(SAVED_LANG_KEY, lng);
      } catch (e) {
        // localStorage may be disabled in private mode or by policy
      }

      requestAnimationFrame(function () {
        document.documentElement.classList.remove('is-changing-language');
      });
    });
  };

  // Cross-tab sync: if another tab changes language via localStorage, update this page
  function onStorageEvent(e) {
    if (e.key === SAVED_LANG_KEY && e.newValue) {
      var current = i18next.language || document.documentElement.getAttribute('lang') || 'en';
      if (e.newValue !== current && typeof window.changeLanguage === 'function') {
        window.changeLanguage(e.newValue);
      }
    }
  }
  if (window.addEventListener) {
    window.addEventListener('storage', onStorageEvent);
  }

  // Initialize i18next with HTTP backend and browser language detector
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: false,
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: 'locales/{{lng}}/{{ns}}.json'
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: SAVED_LANG_KEY
      },
      interpolation: {
        escapeValue: true // Prevent XSS when inserting interpolated values
      }
    }, function (err) {
      if (err) {
        console.error('i18next initialization failed:', err);
        return;
      }
      var currentLang = i18next.language || 'en';
      setDocumentDirection(currentLang);
      window.updateContent();
    });
})();