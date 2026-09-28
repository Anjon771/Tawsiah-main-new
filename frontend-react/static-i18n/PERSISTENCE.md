# Settings Page — Cross-Page Persistence & How It Works

## 1. How Language Choice Persists Across Pages

Because this is a static multi-page site (not an SPA), persistence relies on **localStorage** plus **i18next-browser-languagedetector**.

### Initialization flow on every page (including `index.html` and `settings.html`)
1. `i18next` initializes with `detection.order: ['localStorage', 'navigator', 'htmlTag']`.
2. On first visit, if `localStorage` has no `i18nextLng`, the browser's `navigator.language` is used.
3. On `settings.html`, when the user selects a language:
   - `changeLanguage(lng)` is called.
   - `localStorage.setItem('i18nextLng', lng)` is written.
   - `html lang` and `html dir` are updated immediately.
   - A `CustomEvent('i18nextLanguageChanged')` is dispatched on `window`.
4. When the user navigates to `index.html` (or any other page):
   - The new page loads `i18n-config.js`.
   - i18next reads `localStorage.getItem('i18nextLng')`.
   - The saved language is loaded automatically — **no refresh or query parameters required**.

### Cross-tab synchronization
- `i18n-config.js` listens to the browser's `storage` event.
- If the user changes language in a `settings.html` tab while `index.html` is open in another tab, `index.html` detects the `localStorage` change and auto-updates its own language and direction.

## 2. Global Event Architecture

### `i18nextLanguageChanged` (CustomEvent)
Dispatched on `window` every time `changeLanguage()` succeeds.

**Payload:**
```js
{ detail: { lng: 'ar', dir: 'rtl' } }
```

**Usage in any page script:**
```js
window.addEventListener('i18nextLanguageChanged', function (e) {
  console.log('Language changed to', e.detail.lng);
  // Re-render dynamic components, re-fetch data, etc.
});
```

## 3. Real-Time Updates on the Settings Page

The settings page updates **without a refresh** through two mechanisms:

1. **Immediate change:** Selecting a radio button immediately calls `applyLanguage()` → `changeLanguage()`, which updates `lang`/`dir` attributes and re-translates all `[data-i18n]` elements.
2. **Save button confirmation:** Clicking **Save** re-applies the selected language (idempotent if already applied) and triggers a toast notification using the key `settings_saved`.

## 4. Error Handling Strategy

| Scenario | Behavior |
|---|---|
| `translation.json` fails to load (404 / network) | `i18next` falls back to the key names (e.g., "settings_title" appears literally). `settings.js` shows a toast with `error_loading_translations`. |
| i18next CDN blocked or not loaded | `settings.js` waits 2 seconds, then shows the error toast and falls back to static HTML text. |
| `localStorage` disabled (private mode) | Language still changes for the current session. The next page load falls back to `navigator.language` detection. |
| User selects already-active language | Toast still appears (UX feedback) but no unnecessary network requests are made. |

## 5. Accessibility Checklist

- **ARIA:** `role="radiogroup"` and `aria-labelledby="lang-heading"` on the language selector.
- **Keyboard:** Radio inputs handle arrow keys, Tab, and Space natively.
- **Screen readers:** `aria-live="polite"` on the toast ensures announcements without interrupting the user.
- **Focus:** `focus-visible` styles provide visible focus rings on all interactive elements.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables transitions for users who need them off.

## 6. Testing the Implementation

1. **Serve the site** (`npx serve .` or any static server).
2. Open `http://localhost:3000/settings.html`.
3. Switch to **العربية**:
   - Verify `html lang="ar" dir="rtl"`.
   - Verify font switches to Cairo/Tajawal.
   - Verify toast appears: "تم تحديث اللغة بنجاح".
4. Click **Back** → `index.html` should load in Arabic automatically.
5. Open `index.html` in a second browser tab.
6. Change language on `settings.html`.
7. Switch to the `index.html` tab — it should auto-sync to the new language.
8. Disable JavaScript and reload `settings.html` — fallback English text remains readable.
9. Test keyboard-only navigation: Tab to radio group, use arrow keys to select a language.
10. Open DevTools → Application → Local Storage → confirm `i18nextLng` exists with the correct value.
