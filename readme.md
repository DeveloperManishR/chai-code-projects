# ☕ Chai CSS

A lightweight, zero-dependency, utility-first CSS engine built entirely with vanilla JavaScript.

Instead of writing traditional CSS, you write class names following the `chai-*` pattern (e.g. `chai-p-4`, `chai-bg-black`, `chai-text-center`). The engine scans the DOM, reads these class names, converts them into corresponding inline styles, and applies them dynamically — **no build step required**.

---

## 🚀 Quick Start

### 1. Include the script

```html
<script src="chai.js"></script>
```

### 2. Write utility classes

```html
<div class="chai-p-8 chai-bg-black chai-text-white chai-rounded-xl chai-shadow-lg">
  <h3 class="chai-text-2xl chai-font-bold">Hello Chai CSS</h3>
  <p class="chai-text-sm chai-opacity-70">Styled entirely with utility classes.</p>
</div>
```

### 3. Open in browser

That's it. No npm, no webpack, no config files. Just open the HTML and your styles are applied.

---

## ⚙️ How It Works

| Step | Description |
|------|-------------|
| **1. Scan** | After `DOMContentLoaded`, the engine queries all elements in the DOM. |
| **2. Filter** | Only classes starting with `chai-` are selected for processing. |
| **3. Parse** | Each class name is stripped of the prefix and matched against a rules table to find the CSS property and value. |
| **4. Apply** | The computed style is applied as an inline style. The original `chai-*` class is removed from the element. |

A **MutationObserver** watches for dynamically added elements and processes new `chai-*` classes in real time.

---

## 📦 Project Structure

```
├── chai.js        # Core CSS engine (single file, ~430 lines)
├── index.html     # Documentation & demo page
├── index.css      # Styles for the documentation page
└── README.md      # This file
```

---

## 🎨 Supported Utilities

### Spacing

| Class | CSS Output | Description |
|-------|-----------|-------------|
| `chai-p-{n}` | `padding: {n}px` | Padding on all sides |
| `chai-px-{n}` | `padding-left/right` | Horizontal padding |
| `chai-py-{n}` | `padding-top/bottom` | Vertical padding |
| `chai-pt-{n}` / `pr` / `pb` / `pl` | Individual side | Directional padding |
| `chai-m-{n}` | `margin: {n}px` | Margin on all sides |
| `chai-mx-{n}` / `my` / `mt` / `mr` / `mb` / `ml` | Individual side | Directional margin |
| `chai-gap-{n}` | `gap` | Flex/grid gap |

Spacing scale: `0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, px, auto, full`

### Colors

| Class | CSS Output |
|-------|-----------|
| `chai-bg-{color}` | `background-color` |
| `chai-text-{color}` | `color` |
| `chai-border-{color}` | `border-color` |

**Available colors:** `black`, `white`, `transparent`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`, `stone`

### Typography

| Class | CSS Output |
|-------|-----------|
| `chai-text-{size}` | `font-size` — xs, sm, base, lg, xl, 2xl–9xl |
| `chai-font-{weight}` | `font-weight` — thin, light, normal, medium, semibold, bold, extrabold, black |
| `chai-text-{align}` | `text-align` — left, center, right, justify |
| `chai-uppercase` / `lowercase` / `capitalize` | `text-transform` |
| `chai-underline` / `line-through` / `no-underline` | `text-decoration` |
| `chai-leading-{v}` | `line-height` — none, tight, snug, normal, relaxed, loose |
| `chai-tracking-{v}` | `letter-spacing` — tighter, tight, normal, wide, wider, widest |

### Borders & Radius

| Class | CSS Output |
|-------|-----------|
| `chai-border` | `border-width: 1px; border-style: solid` |
| `chai-border-{n}` | `border-width` — 0, 2, 4, 8 |
| `chai-border-{style}` | `border-style` — solid, dashed, dotted, double, none |
| `chai-rounded` | `border-radius: 4px` |
| `chai-rounded-{size}` | `border-radius` — none, sm, md, lg, xl, 2xl, 3xl, full |

### Layout

| Class | CSS Output |
|-------|-----------|
| `chai-flex` / `grid` / `block` / `inline` / `hidden` | `display` |
| `chai-flex-col` / `flex-row` | `flex-direction` |
| `chai-flex-wrap` / `flex-nowrap` | `flex-wrap` |
| `chai-justify-{v}` | `justify-content` — start, end, center, between, around, evenly |
| `chai-items-{v}` | `align-items` — start, end, center, baseline, stretch |
| `chai-w-{n}` / `h-{n}` | `width` / `height` |
| `chai-min-w-{n}` / `max-w-{n}` | `min-width` / `max-width` |
| `chai-grid-cols-{n}` | `grid-template-columns: repeat(n, minmax(0, 1fr))` |
| `chai-relative` / `absolute` / `fixed` / `sticky` | `position` |
| `chai-top-{n}` / `right` / `bottom` / `left` / `inset` | Position offsets |
| `chai-z-{n}` | `z-index` — 0, 10, 20, 30, 40, 50, auto |

### Effects

| Class | CSS Output |
|-------|-----------|
| `chai-shadow` / `shadow-{size}` | `box-shadow` — sm, md, lg, xl, 2xl, none |
| `chai-opacity-{n}` | `opacity` — 0 to 100 in steps of 5 |
| `chai-transition` | `transition: all 150ms` |
| `chai-duration-{ms}` | `transition-duration` |
| `chai-cursor-pointer` / `default` / `not-allowed` | `cursor` |
| `chai-overflow-hidden` / `auto` / `scroll` | `overflow` |
| `chai-select-none` / `text` / `all` | `user-select` |

---

## 🧪 Live Demo

The documentation page (`index.html`) includes:

- **Feature overview** — why Chai CSS exists
- **How it works** — step-by-step engine walkthrough
- **Utility reference** — tabbed tables for every supported class
- **Interactive playground** — type classes and see styles applied in real time
- **Live demo** — cards styled entirely with `chai-*` classes

---

## 💡 JavaScript API

Chai CSS exposes a global `ChaiCSS` object:

```js
// Re-process all elements
ChaiCSS.process();

// Process a single element
ChaiCSS.processElement(document.getElementById('my-el'));

// Access the colour map
console.log(ChaiCSS.colors);

// Version
console.log(ChaiCSS.version); // "1.0.0"
```

---

## 🔑 Key Concepts

- **No build step** — include one `<script>` tag and go
- **Prefix-based** — all utility classes use the `chai-` prefix
- **Inline styles** — styles are applied directly to `el.style`
- **Class cleanup** — processed `chai-*` classes are removed from the DOM
- **Dynamic support** — MutationObserver watches for new elements added after page load
- **Zero dependencies** — pure vanilla JavaScript, no libraries

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Engine | Vanilla JavaScript (IIFE, ~430 LOC) |
| Docs page | HTML5, CSS3, Google Fonts |
| Font | Instrument Serif, Inter, JetBrains Mono |
| Animations | CSS transitions + IntersectionObserver |

---

## 📄 License

MIT — free to use, modify, and distribute.
