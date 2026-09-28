/**
 * settings.js
 * Handles language switching UI, toast notifications, error handling,
 * and real-time content updates for the Settings page.
 *
 * Assumes i18next is initialized by i18n-config.js (loaded before this script).
 */

(function () {
  'use strict';

  var SAVED_LANG_KEY = 'i18nextLng';
  var TOAST_DURATION_MS = 3000;

  var langSelector = document.getElementById('lang-selector');
  var saveBtn = document.getElementById('save-lang-btn');
  var toastEl = document.getElementById('toast');
  var logoutBtn = document.getElementById('logout-btn');
  var langInputs = langSelector ? langSelector.querySelectorAll('input[name="language"]') : [];

  // Helper: show accessible toast notification
  function showToast(messageKey, fallback) {
    if (!toastEl) return;
    var message = (typeof i18next !== 'undefined' && i18next.isInitialized)
      ? i18next.t(messageKey)
      : fallback;
    if (!message || message === messageKey) message = fallback;

    toastEl.textContent = message;
    toastEl.classList.add('is-visible');

    // Clear existing timer if any
    if (toastEl._toastTimer) {
      clearTimeout(toastEl._toastTimer);
    }
    toastEl._toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, TOAST_DURATION_MS);
  }

  // Helper: sync radio buttons to current i18next language
  function syncRadioSelection() {
    var currentLang = (typeof i18next !== 'undefined' && i18next.language) || 'en';
    for (var i = 0; i < langInputs.length; i++) {
      var input = langInputs[i];
      var isChecked = input.value === currentLang;
      input.checked = isChecked;
      input.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    }
  }

  // Core language change handler used by both radio clicks and Save button
  function applyLanguage(lng) {
    if (!lng || lng === i18next.language) {
      // Even if same language, show confirmation toast for Save button UX
      showToast('settings_saved', 'Language updated successfully');
      return;
    }

    if (typeof window.changeLanguage === 'function') {
      window.changeLanguage(lng);
    } else if (typeof i18next !== 'undefined' && i18next.changeLanguage) {
      // Fallback if i18n-config.js hasn't attached the global helper
      i18next.changeLanguage(lng, function (err) {
        if (err) {
          console.error('Language change failed:', err);
          showToast('error_loading_translations', 'Failed to load translations');
          return;
        }
        var dir = i18next.dir(lng);
        document.documentElement.setAttribute('lang', lng);
        document.documentElement.setAttribute('dir', dir);
        if (typeof window.updateContent === 'function') window.updateContent();
      });
    } else {
      console.error('i18next is not available');
      showToast('error_loading_translations', 'Failed to load translations');
    }
  }

  // When a radio button is selected, switch language immediately (real-time feedback)
  function onRadioChange(e) {
    var target = e.target;
    if (target && target.name === 'language') {
      applyLanguage(target.value);
    }
  }

  // Save button click: re-apply current selection and show toast
  function onSaveClick() {
    var selected = langSelector.querySelector('input[name="language"]:checked');
    var lng = selected ? selected.value : 'en';
    applyLanguage(lng);
    showToast('settings_saved', 'Language updated successfully');
  }

  // Listen for the global language-change event so this page updates
  // if language is changed from another component or tab
  function onLanguageChanged(e) {
    syncRadioSelection();
    showToast('settings_saved', 'Language updated successfully');
  }

  // Wait for i18next to be ready before syncing UI state
  function initWhenReady() {
    if (typeof i18next !== 'undefined' && i18next.isInitialized) {
      syncRadioSelection();
      window.updateContent();
    } else if (typeof i18next !== 'undefined' && i18next.on) {
      i18next.on('initialized', function () {
        syncRadioSelection();
        window.updateContent();
      });
    } else {
      // i18next not loaded at all — show error after short timeout
      setTimeout(function () {
        if (typeof i18next === 'undefined') {
          showToast('error_loading_translations', 'Failed to load translations');
        }
      }, 2000);
    }
  }

  // Wire events
  if (langSelector) {
    langSelector.addEventListener('change', onRadioChange);
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', onSaveClick);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      // Demo logout: clear preference and redirect to home
      try { localStorage.removeItem(SAVED_LANG_KEY); } catch (e) {}
      window.location.href = 'index.html';
    });
  }

  if (window.addEventListener) {
    window.addEventListener('i18nextLanguageChanged', onLanguageChanged);
  }

  // Initialize
  initWhenReady();
})();
