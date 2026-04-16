# AICW Summarize Widget

A lightweight, standalone widget that adds a floating "Summarize with AI" and "Share" button to any website. Zero dependencies, no tracking, no analytics, just a clean UI widget embeddable with a single `<script>` tag.

**IMPORTANT**: this widget is **not** generating AI summary of the page! It shows summary from the meta description field by default, and allowing users to click their  favorite AI service to generate summary of the current page. 

## Quick Start

Add this single line to your HTML, right before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"></script>
```

That's it. A floating "Summarize" button will appear on the right side of the page. Clicking it opens a popup with links to AI services (ChatGPT, Gemini, Claude, Perplexity, Grok) and share buttons (WhatsApp, Telegram, X, Gmail, LinkedIn). The widget automatically detects dark/light mode from your browser and site settings.

This uses jsDelivr's `@latest` which points to the most recent GitHub release. A new release is created automatically whenever `src/` changes are pushed to main.

To pin to a specific release (recommended for production):

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@v20260416.162431/dist/aicw-summarize.min.js"></script>
```

## How It Works

- The widget creates a floating trigger button on the page edge
- Clicking it opens a popup with AI service links that pass the current page URL + title to the selected AI
- Share buttons let visitors share the page via social platforms, email, or clipboard
- The page's meta description is shown as a preview in the popup
- Fully responsive: becomes a bottom sheet on mobile

## Configuration

All configuration is done via `data-*` attributes on the script tag.

### Layout

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-position` | `left` \| `right` \| `top` \| `bottom` | `right` | Position of the floating trigger bar |
| `data-mobile-position` | `top` \| `bottom` | `bottom` | Position on mobile devices |
| `data-label` | string | auto | Custom label for the trigger button. Auto-detects: "Summarize" (if AI enabled) or "Share" (if share-only) |

### Features

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-summarize` | `true` \| `false` | `true` | Enable/disable AI summarize section |
| `data-services` | string | `chatgpt,gemini,claude,perplexity,grok` | Comma-separated list of AI services to show |
| `data-prompt` | string | `Summarize this page:` | Custom prompt sent to AI services. Use `\|` to separate multiple prompts — one is picked randomly per click |
| `data-share` | `true` \| `false` | `true` | Enable/disable share section |
| `data-share-services` | string | `whatsapp,telegram,x,gmail,linkedin` | Comma-separated list of share services |
| `data-paths` | string | (empty) | Comma-separated regex patterns for URL paths where the widget should appear. Empty = all pages |

### Dark Mode

The widget automatically adapts to dark/light mode. By default it checks `localStorage` for a `theme` variable set to `dark`, then falls back to the browser's `prefers-color-scheme` media query.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-auto-theme` | `true` \| `false` | `true` | Enable/disable automatic dark/light mode detection |
| `data-theme-storage` | string | `theme=dark` | localStorage variable and value that indicates dark mode, in `varName=darkValue` format. Set to `none` to skip localStorage and rely only on browser preference |

**How detection works:**
1. Check `localStorage.getItem("theme")` — if it equals `"dark"`, use dark mode
2. If localStorage has no value (or `data-theme-storage="none"`), fall back to `prefers-color-scheme: dark`
3. The widget listens for changes (browser theme toggle, localStorage updates from other tabs) and switches live

**Built-in color defaults:**

| | Light mode | Dark mode |
|---|---|---|
| Background | `rgba(255,255,255,0.92)` | `rgba(30,30,30,0.95)` |
| Text | `#374151` | `#e5e7eb` |
| Icons | `#1f2937` | `#d1d5db` |
| Button background | `rgba(255,255,255,0.85)` | `rgba(30,30,30,0.9)` |
| Accent | (from text color) | `#818cf8` |

### Colors (manual override)

Any explicit color attribute overrides the auto-detected theme colors. Use these when you want full control or need to match specific brand colors.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-bg-color` | CSS color | (auto) | Popup background color |
| `data-text-color` | CSS color | (auto) | Text color in the popup |
| `data-accent-color` | hex color | (auto) | Accent gradient color on the bar/popup edge |
| `data-icon-color` | CSS color | (auto) | Icon fill color |
| `data-button-bg-color` | CSS color | (auto) | Trigger button background |
| `data-button-text-color` | CSS color | (auto) | Trigger button text color |

## Supported AI Services

| Key | Service | What happens |
|-----|---------|--------------|
| `chatgpt` | ChatGPT | Opens chat.openai.com with the page URL as a prompt |
| `gemini` | Gemini | Opens Google AI search with the page URL |
| `claude` | Claude | Opens claude.ai with the page URL as a prompt |
| `perplexity` | Perplexity | Opens perplexity.ai search with the page URL |
| `grok` | Grok | Opens Grok on X with the page URL |
| `deepseek` | DeepSeek | Opens chat.deepseek.com with the page URL |
| `copilot` | Copilot | Opens Microsoft Copilot with the page URL |

## Supported Share Services

| Key | Service |
|-----|---------|
| `whatsapp` | WhatsApp |
| `x` | X (Twitter) |
| `telegram` | Telegram |
| `facebook` | Facebook |
| `linkedin` | LinkedIn |
| `reddit` | Reddit |
| `threads` | Threads |
| `bluesky` | Bluesky |
| `mastodon` | Mastodon |
| `gmail` | Gmail |
| `email` | Email (mailto:) |
| `copy` | Copy link to clipboard |

## Examples

### Minimal (all defaults)

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"></script>
```

### Custom position and custom label

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-position="bottom"
  data-label="Summarize"
></script>
```

### Auto dark mode (default behavior)

Dark mode is automatic — no configuration needed. The widget reads the browser's `prefers-color-scheme` and checks `localStorage.theme`. To use a different localStorage variable:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-theme-storage="darkMode=true"
></script>
```

To disable auto-detection and force light mode:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-auto-theme="false"
></script>
```

### Custom colors (manual dark theme override)

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-auto-theme="false"
  data-bg-color="rgba(30,30,30,0.95)"
  data-text-color="#e5e7eb"
  data-accent-color="#818cf8"
  data-icon-color="#d1d5db"
  data-button-bg-color="rgba(30,30,30,0.9)"
  data-button-text-color="#e5e7eb"
></script>
```

### Random prompts

Use `|` to separate multiple prompt variations — one is picked randomly each time a user clicks an AI service:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-prompt="Summarize this page:|Explain this article in simple terms:|Give me the key takeaways from:"
></script>
```

### AI-only (no share buttons)

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-share="false"
></script>
```

### Share-only (no AI)

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-summarize="false"
  data-share-services="whatsapp,x,linkedin,copy"
></script>
```

### Specific AI services + custom prompt

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-services="claude,chatgpt"
  data-prompt="Explain this article in simple terms:"
  data-share="false"
></script>
```

### Show only on specific pages

Use `data-paths` with regex patterns (comma-separated). Only exact top-level paths, not their children:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-paths="^/$,^/meditate/$,^/visual/$,^/games/$"
></script>
```

This shows the widget on `/`, `/meditate/`, `/visual/`, `/games/` but **not** on child pages like `/meditate/something` or `/games/level-1`.

Show on all article pages:

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-paths="^/blog/"
></script>
```

### Left sidebar with brand colors

```html
<script src="https://cdn.jsdelivr.net/gh/aicw-io/aicw-summarize@latest/dist/aicw-summarize.min.js"
  data-position="left"
  data-accent-color="#4f46e5"
  data-button-bg-color="#4f46e5"
  data-button-text-color="#ffffff"
></script>
```

## Self-Hosting / Building

If you prefer to self-host instead of using the CDN:

### Prerequisites

- Node.js 18+

### Build

```bash
git clone https://github.com/aicw-io/aicw-summarize.git
cd aicw-summarize
npm install
npm run build
```

Output: `dist/aicw-summarize.min.js` — copy this file to your server and reference it directly.

### Development (watch mode)

```bash
npm run dev
```

Rebuilds automatically when `src/widget.js` changes.

### Validate syntax only

```bash
npm run validate
```

## Technical Details

- **Zero dependencies** at runtime — vanilla JavaScript IIFE
- **No external requests** — all icons are inline SVGs, no fonts or stylesheets loaded
- **No tracking / analytics** — the widget makes zero network calls (only navigates when user clicks a service link)
- **CSS isolation** — all styles use high-specificity `#aicw-ask-ai-*` selectors to avoid conflicts
- **iframe-safe** — automatically disabled inside iframes to prevent recursion
- **~34 KB minified** — lightweight enough for any website

## License

MIT - made by [AICW](https://www.aicw.io)
