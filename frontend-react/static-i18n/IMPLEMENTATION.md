# i18n Implementation Checklist & Critical Notes

## 1. Recommended File Structure

```
static-i18n/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── i18n-config.js
├── locales/
│   ├── ar/
│   │   └── translation.json      (Arabic translations — English keys, Arabic values)
│   └── en/
│       └── translation.json      (English translations — same keys, English values)
└── IMPLEMENTATION.md
```

## 2. Step-by-Step Implementation Checklist

### Add `data-i18n` attributes to HTML elements
- Attach `data-i18n="keyName"` to any element that should display translated text.
- Example: `<h1 data-i18n="welcome">Welcome to Tawsiah</h1>`
- **Fallback content**: place default (English) text inside the element. It will be overwritten by i18next once loaded, but remains visible for crawlers and users with JavaScript disabled.

### Handle nested keys (dot notation)
- Use the full path as the attribute value: `data-i18n="settings.title"`
- Ensure your JSON has the matching nested structure:
  ```json
  {
    "settings": {
      "title": "الإعدادات"
    }
  }
  ```

### Handle pluralization (Arabic & English)
- i18next has built-in plural rules for Arabic and English.
- Use the `count` interpolation variable. i18next will automatically select the correct plural form.
- Example JSON structure:
  ```json
  {
    "review": "تقييم",
    "review_plural": "{{count}} تقييمات",
    "review_zero": "لا يوجد تقييمات"
  }
  ```
- In HTML: `data-i18n="written_reviews" data-i18n-options='{"count": 5}'`
- In JS: `i18next.t('review', { count: 5 })`

### Store and retrieve user language preference
- The language detector in `i18n-config.js` uses this priority order:
  1. `localStorage` key `i18nextLng`
  2. Browser `navigator.language`
  3. `<html lang="...">` tag
- The chosen language is cached back into `localStorage` so the preference persists across sessions.

### Handle images/icons that need mirroring in RTL
- Add a class like `.icon-directional` or `.img-directional` to any asset that conveys direction (arrows, chevrons, progress indicators).
- CSS automatically flips them:
  ```css
  [dir="rtl"] .icon-directional { transform: scaleX(-1); }
  ```

### Test the implementation
1. Open `index.html` in a browser (must be served over HTTP/HTTPS or `file://` with CORS off for local JSON).
2. Switch languages using the buttons; verify:
   - Text updates.
   - `<html lang="...">` changes.
   - `<html dir="rtl/ltr">` changes.
3. Check DevTools > Application > Local Storage for `i18nextLng`.
4. Disable JavaScript and reload; confirm fallback English text appears.
5. Set browser primary language to Arabic and reload with Local Storage cleared; confirm auto-detection loads Arabic.

## 3. Critical Implementation Notes

### JSON key/value pattern
- The attached `translation.json` uses **English keys** (e.g., `team_name`, `welcome_subtitle`) with **Arabic values**.
- This is correct for the `locales/ar/translation.json` file.
- For English, create `locales/en/translation.json` with the **exact same keys** but English values.
- **Never** change the keys themselves when translating; i18next looks up by key.

### Using the `t()` function for programmatic translations
- Access translations anywhere in JavaScript after initialization:
  ```js
  alert(i18next.t('welcome'));
  console.log(i18next.t('written_reviews', { count: 5 }));
  ```
- Always pass interpolation variables as the second argument.

### Interpolation syntax
- Inside JSON: `"written_reviews": "لقد كتبت {{count}} تقييم"`
- The `{{variable}}` syntax is i18next's default interpolation format.
- In HTML, use `data-i18n-options`:
  ```html
  <span data-i18n="written_reviews" data-i18n-options='{"count": 5}'></span>
  ```
- In JS:
  ```js
  i18next.t('written_reviews', { count: 5 })
  ```

### Performance considerations for static sites
- **CDN preconnect**: `<link rel="preconnect">` headers speed up Google Fonts and i18next CDN loads.
- **Font loading**: Use `display=swap` so text renders immediately while Arabic fonts load.
- **JSON caching**: Ensure your static server (or GitHub Pages / S3) sets `Cache-Control` headers on `locales/**/*.json` to avoid re-fetching translations.
- **No bundler needed**: This setup is optimized for vanilla HTML/JS; no build step is required.

### Accessibility concerns
- **Screen readers** rely heavily on the `<html lang>` attribute. Always keep it in sync with the active translation language.
- **Bidirectional text** depends on `<html dir>`. Correct `dir="rtl"` ensures that inline punctuation, numbers, and mixed-language sentences render correctly for Arabic users.
- **Focus management**: When switching languages, focus order should follow the visual layout. Test tab navigation in both directions.
- **Reduced motion**: CSS respects `prefers-reduced-motion` so users who disable animations are not affected by transition fades.
