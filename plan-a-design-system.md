# Plan A Technologies — Design System

Machine-readable spec of the Plan A front-end design system. Hand this file to any LLM or IDE (Cursor, Claude, Copilot) so it can generate on-brand markup, styles, and components without re-deriving them.

- **Philosophy:** dark-navy base, **rationed orange** (one accent per view — a keyword, a number, or a single CTA), editorial all-caps display type, generous space, purposeful motion.
- **Source of truth:** `assets/plana.css` (tokens + components) and `assets/plana.js` (behavior). The living guide is `brand.html`. Change the CSS/JS and both the site and the guide update.
- **Stack:** static HTML pages sharing one CSS + one JS file. GSAP 3.12.5 + ScrollTrigger for motion; three.js r128 only on pages with the 3D globe. Cache-bust shared assets with `?v=N`.

---

## 1. Design tokens (CSS custom properties)

```css
:root{
  --navy:#0A0F1E;        /* page background, base surface */
  --navy-2:#0F1730;      /* raised surfaces: cards, inputs, panels */
  --navy-3:#131C38;      /* deeper panels, gradient stops */
  --ink:#05070F;         /* near-black: gradient bottoms, text on orange */
  --paper:#F4F1EA;       /* primary text; logo on dark */
  --paper-dim:#B9BDC9;   /* body / secondary text */
  --paper-dimmer:#7A8199;/* tertiary labels, captions, meta */
  --orange:#FF5A16;      /* THE accent — rationed */
  --orange-soft:rgba(255,90,22,.14); /* hover tints, wipe fills */
  --line:rgba(244,241,234,.14);      /* standard hairline borders */
  --line-2:rgba(244,241,234,.08);    /* subtle inner dividers */
  --maxw:1400px;         /* content container width */
  --pad:clamp(20px,5vw,80px); /* fluid page gutter */
}
```

**Accent rule:** never use more than one orange focal point per viewport. Orange is for a highlighted keyword (`<span class="o">`), a stat unit, a hover state, or one CTA — not for body text or large fills (except the deliberate invert panel).

---

## 2. Typography

Two families, loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

- **Space Grotesk** — display. All headings, numbers, labels, buttons, nav. Always `font-weight:700`, `text-transform:uppercase`, `letter-spacing:-.02em`, `line-height:.9–.94`.
- **Inter** — body. Weights 400/500. `line-height:1.6–1.7`.

```css
body{ font-family:"Inter",system-ui,sans-serif; }
h1,h2,h3,h4,.disp{
  font-family:"Space Grotesk",sans-serif;
  text-transform:uppercase; font-weight:700;
  line-height:.94; letter-spacing:-.02em;
}
```

### Type scale

| Role | Size | Class / selector |
|---|---|---|
| Page title (H1) | `clamp(44px, 9vw, 140px)` | `.pagehero h1`, `.ph-title` |
| Hero mega | `clamp(48px, 9.5vw, 165px)`; invert panel `clamp(62px, 13vw, 230px)` | `.wwd .big` |
| Section heading (H2) | `clamp(34px, 6vw, 88px)` | `.sec-head h2` |
| Subsection (H3) | `clamp(22px, 3vw, 42px)` | `.slab .body h3` |
| Big numeral / stat | `clamp(40px, 5.6vw, 78px)`+ | `.hero-metrics .hm b`, `.bignum` |
| Kicker / eyebrow | `12px`, `letter-spacing:.18em`, orange, `✳` prefix | `.kicker` |
| Lead paragraph | `clamp(15px, 1.4vw, 18px)`, lh 1.65 | `.lead` |
| Body | `14–16px`, color `--paper-dim`, lh 1.65 | default |

```css
.kicker{display:inline-flex;align-items:center;gap:12px;font-family:"Space Grotesk";
  font-size:12px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--orange)}
.kicker::before{content:"✳";font-size:13px}
.kicker.dim{color:var(--paper-dim)}
```

**Highlighting:** wrap the accent word in `<span class="o">` → renders orange (`.o{color:var(--orange)}`).

**H1 rule (SEO):** exactly one `<h1>` per page, keyword-led. Where a page keeps a brand-voice visible heading, render it as `<div class="ph-title">…</div>` and add one `<h1 class="sr-only">Descriptive keyword title</h1>`.

---

## 3. Layout & spacing

```css
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--pad)}
.rows{padding:clamp(70px,13vh,150px) 0}   /* standard content section */
.cta{padding:clamp(80px,15vh,200px) 0}    /* closing CTA section */
.sec-head{display:flex;justify-content:space-between;align-items:baseline;
  gap:16px;flex-wrap:wrap;margin-bottom:52px}
```

- One container (`.wrap`, max 1400px) + one fluid gutter (`--pad`).
- Vertical rhythm from `.rows` section padding.
- Common inner gaps: `clamp(10px,1vw,22px)` (card grids), `clamp(20px,4vw,56px)` (two-column).

### Radius (two-speed)

- `0` — structural slabs, logo-wall cells.
- `14–18px` — cards, panels, demo boxes.
- `100px` — pill buttons, tags.

### Borders

`--line` for standard hairlines/dividers; `--line-2` for subtle inner separators. Cards and inputs sit on `--navy-2` with a `--line` border.

### Spacing scale

| Band | Value | Use |
|---|---|---|
| micro | `4 / 8 / 12px` | icon gaps, chip padding |
| tight | `14–22px` | card padding, list gaps |
| grid | `clamp(10px,1vw,22px)` | gaps between cards |
| component | `clamp(20px,4vw,56px)` | inner panel padding, 2-col gap |
| head→content | `52px` | `.sec-head` bottom margin |
| section rhythm | `clamp(70px,13vh,150px)` | `.rows` vertical padding |
| hero / CTA | `clamp(80px,15vh,200px)` | breathing room |

### Spacing rules

1. **Fluid over fixed** — use `clamp()` for anything that scales with the viewport (section padding, gutters, display type). Reserve fixed px for small non-scaling details.
2. **Let it breathe** — vertical rhythm carries hierarchy more than borders do. One idea per band of space.
3. **Cap the measure** — body text at ~52–82ch via `max-width` on paragraphs; never full-bleed body copy.
4. **Consistent inner padding per component** — cards ~24px, big panels `clamp(26px,3vw,48px)`. Don't hand-tune per instance.
5. **One container, one gutter** — align everything to `.wrap` (max 1400px) + `--pad`; don't invent new max-widths.

---

## 4. Buttons & controls

```css
/* Primary pill (CTA) */
.cta .btn{display:inline-block;border:1px solid var(--paper);border-radius:100px;
  padding:17px 42px;font-family:"Space Grotesk";text-transform:uppercase;font-size:14px;
  letter-spacing:.08em;transition:background .3s,color .3s,border-color .3s}
.cta .btn:hover{background:var(--orange);border-color:var(--orange);color:#000}

/* Nav CTA (squared orange outline) */
.nav-links a.btn-talk{border:1px solid var(--orange);color:var(--orange)!important;
  padding:13px 32px!important;border-radius:0}
.btn-talk:hover{background:var(--orange);color:#000!important}

/* Solid submit */
.submit{background:var(--orange);color:#000;border:0;font-family:"Space Grotesk";font-weight:700;
  text-transform:uppercase;letter-spacing:.06em;font-size:14px;padding:16px 40px;border-radius:100px;cursor:pointer}
.submit:hover{transform:translateY(-2px);background:#ff6a2e}

/* Inline "go" link with sliding arrow */
.go{display:inline-flex;align-items:center;gap:8px;font-family:"Space Grotesk";font-weight:700;
  font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--orange)}
.go span{transition:transform .3s}  /* :hover parent → span{transform:translateX(6px)} */
```

Markup: `<span class="go">Explore <span>→</span></span>`

## 5. Form fields

```css
.field label{display:block;font-family:"Space Grotesk";font-size:12px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--paper-dim);margin-bottom:9px}
.field input,.field textarea{width:100%;background:var(--navy-2);border:1px solid var(--line);
  color:var(--paper);font-family:"Inter";font-size:15px;padding:14px 16px}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--orange)}
/* White variant (contact): background:#fff; border:1px solid rgba(0,0,0,.12); color:#0A0F1E;
   border-radius:10px; focus → box-shadow:0 0 0 3px rgba(255,90,22,.16) */
```

Include an off-screen honeypot field (`.honeypot{position:absolute;left:-9999px}`) for spam.

---

## 6. Components

Each entry: purpose · key classes · structure.

### Nav — `nav.site`
Fixed, translucent blurred bar (`background:rgba(10,15,30,.25);backdrop-filter:blur(12px)`), adds `.scrolled` past 30px. Logo left (`.brand img`), links right (`.nav-links`), squared `.btn-talk` CTA. Dropdowns (`.nav-dd`) for Creative Studio + Industries are injected by `plana.js`; hover-open on desktop, tap on mobile; caret is static (no flip). Mobile: `.nav-toggle` reveals a full-screen `.nav-links.open`.

### Page hero — `.pagehero`
Top padding clears the fixed nav. Optional `.pagehero-bg` (cover image, dimmed). Contains `.call` (eyebrow), the H1/`.ph-title`, `.lead`, and often the glass stats band.

### Glass stats band — `.pagehero .hero-metrics`
Row of `.hm` metrics: `<div class="hm"><b><span class="num" data-to="500"><span class="v">0</span></span>+</b><span>Label</span></div>`. Numbers count up on view.

### Numbered slabs — `.slabs > .slab`
Full-width statement rows. Giant outline `.bignum` fills orange on hover; `--orange-soft` wipe sweeps from left. `.body` holds `h3 + p + .go`. Used for "5 things", services, "how we help".

```html
<div class="slabs">
  <div class="slab"><span class="bignum">01</span>
    <div class="body"><h3>Heading</h3><p>Copy…</p><span class="go">Learn more <span>→</span></span></div>
  </div>
</div>
```

### Drop-into-grid pills — `.exp-2col / .exp-drop / .pill`
Left `.exp-head` (kicker + h2 + note), right `.exp-drop` of `.pill` tags in colors `c1` (orange), `c2` (paper), `c3` (navy-3), `c4` (orange outline). Pills fall + bounce into a grid on scroll (JS).

### Logo wall — `.logo-wall`
Grid of `.cell > img`. Logos grayscale/dim → color on hover. Add `.four` for 4 columns (8-logo pages → two rows of 4); default is 6.

### Cards — `.tile` and image variants
`.tile` = bordered `--navy-2` surface (awards, engagement models). Image-backed variants `.ind-card`, `.wk-card`, `.lead-card` lift (`translateY(-6px)`) and reveal color (grayscale→0) on hover; often open a zoom modal.

### FAQ (AEO) — `.faq > details`
Answer-first accordion paired with FAQPage JSON-LD. `+` marker rotates to × on open.

```html
<div class="faq">
  <details><summary>Question?</summary><p>Concise, self-contained answer.</p></details>
</div>
```

### Expanding-panel accordion — `.svc-acc`
Row of columns; the active one flex-grows to reveal its content, the rest collapse to a vertical rotated spine. Active panel: number scales up + orange glow. Responds to hover (desktop), click, keyboard (Enter/Space/focus). Stacks vertically on mobile. Optional `.svc-bg` per panel (grayscale, warms on activation). Shared component in `plana.css`/`plana.js`.

```html
<div class="svc-acc">
  <div class="svc-panel" role="button" tabindex="0" aria-expanded="true">
    <div class="svc-bg" style="background-image:url(…)"></div>   <!-- optional -->
    <span class="svc-idx">01</span>
    <span class="svc-spine">Short label</span>
    <div class="svc-content">
      <span class="svc-tag">Tag</span><h3>Title</h3><p>Copy…</p>
      <a class="go" href="#">Open <span>→</span></a>
    </div>
  </div>
  <!-- more .svc-panel; set aria-expanded="false" on the rest -->
</div>
```
JS toggles `aria-expanded` across panels; no config needed — just include the markup.

### Headshots / portrait imagery — B/W treatment
Square crop (`aspect-ratio:1/1`, `object-position:center top`), rendered **grayscale by default and full color on hover** (`filter:grayscale(1)` → `grayscale(0)`), often with a slight scale on hover. Founders/leads can span larger cells. Same principle governs all photography: desaturated + dimmed at rest, warming on interaction, always under a scrim when text sits on top.

### Scroll-driven patterns (full-page)
- **`.wwd`** pinned wipe: navy statement → **orange** inverted statement → content. The signature moment. Home "What We Do", Work. Panels `.wwd-a/.wwd-b/.wwd-c`; section height ~260–400vh drives the scrub.
- **`.hscroll`** horizontal swipe: vertical scroll translates a pinned track sideways through panels.
- **`.cta-invert`** invert CTA: a paper/orange layer scales up on scroll to flip the closing section.
- **`#globe`** three.js spinning globe; **countdown** film-reel with scrambling captions over sliding backgrounds.

---

## 7. Motion inventory

All motion via GSAP + ScrollTrigger, initialized in `plana.js`. Everything degrades under `prefers-reduced-motion: reduce` and on touch (`matchMedia("(hover:hover) and (pointer:fine)")`, and `innerWidth<=820` → `.plain` fallbacks).

| Animation | Hook | Behavior / where |
|---|---|---|
| Decode / scramble | `[data-rotator][data-words][data-interval]` | Text resolves from random chars, cycles a word list. Hero + headline swaps. |
| Count-up | `[data-to]` + child `.v` | Number ticks 0→target on view. Stats bands, ministats. |
| Split-line reveal | `.split .l i` | Heading lines rise from a clipped mask, staggered. Page-hero titles. |
| Fade-up reveal | `.reveal` (also `.tile,.sec-head,.card,…`) | Ease up + fade in on scroll. Broad entrances. |
| Marquee | `[data-marquee="left|right"]` | Infinite horizontal loop. Tech stack, client strips. |
| Drop-into-grid | `.exp-drop .pill` | Pills fall/tumble/bounce (`bounce.out`) into a grid. |
| Pinned wipe | `.wwd` | Scroll-scrubbed angled clip-path panel sweep. |
| Horizontal swipe | `.hscroll` | Pinned track translates sideways with scroll. |
| Zoom modal | `[data-target]`, `[data-bio]` | Card scales up from click point to full-screen detail. Work, leadership. |
| Expanding accordion | `.svc-acc` `[aria-expanded]` | flex-grow reveal on hover/tap/focus. Services. |
| Cursor tilt | stat cube | 3D element tilts toward pointer. |
| Invert CTA | `.cta-invert` | Scroll-scrubbed layer scales up to flip section. |
| Preloader / gate | `#preloader`, `#gate` | Branded load cover with orange sweep; preview password gate. |

---

## 8. Page conventions

Every page `<head>` includes: unique keyword-led `<title>` (~50–65 chars, ends with "— Plan A Technologies"), unique meta description (140–160), `rel="canonical"` (non-www host), full OG set (`og:title/description/type/url/image`) + Twitter `summary_large_image`, and the shared stylesheet `assets/plana.css?v=N`. OG image is 1200×630 (`/og-image.png`).

Structured data (JSON-LD): `Organization` + `LocalBusiness` sitewide (homepage carries the full entity: address, phone, geo, sameAs); `Service` + `BreadcrumbList` on industry pages; `FAQPage` on Services + industry pages. Site root also serves `robots.txt`, `sitemap.xml`, and `llms.txt`.

Body order: `#preloader` → (optional `#gate`) → `nav.site` → `header` hero → sections → `.cta`/`.cta-invert` → `footer.site` → `<script src="assets/plana.js?v=N">`.

---

## 9. Brand assets

- **Logo:** paper/white wordmark on navy; on light backgrounds use the black version (`filter:brightness(0)` on the white asset, or a true black file). Clear space ≥ the height of the "A". Never recolor, distort, or place on low-contrast imagery without a scrim.
- **Secondary mark:** the `✳` asterisk — bullets, kicker prefix, load/CTA flourishes.
- **Imagery:** treated dark and desaturated by default (grayscale + reduced brightness), warming to color on hover/active. Always pair with a bottom gradient scrim for legible text.

---

## 10. Anti-patterns (what NOT to do)

- **Accent:** never more than one orange focal point per view; no orange body text; no large orange fills outside the deliberate invert panel.
- **Type:** don't use heading tags for size (style with CSS); don't add a third typeface; never ship more than one `<h1>` per page; don't set body copy in pure white or orange.
- **Measure & spacing:** don't run body text full-bleed across the container (cap at ~52–82ch); don't cram sections together and rely on borders to separate them; don't hand-tune padding on every instance.
- **Imagery:** don't place full-brightness photos behind text with no scrim; don't let imagery compete with the single orange accent; keep portraits desaturated at rest.
- **Motion:** don't animate everything; don't block content behind long intros; never ship a scroll effect without a `prefers-reduced-motion` / touch fallback.
- **Logo:** don't recolor, add shadows/effects, stretch, rotate, crowd, or place it on low-contrast imagery.
- **Layout:** don't introduce new arbitrary max-widths or gutters — everything aligns to `.wrap` + `--pad`.

---

_This is a living document — regenerate it whenever `plana.css` / `plana.js` tokens or components change._
