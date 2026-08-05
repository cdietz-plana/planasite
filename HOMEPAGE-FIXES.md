# Plan A Technologies — Homepage Modernization

### What the new front-end fixes vs. the current live homepage

This document covers the **homepage front-end only** — structure, markup, SEO, accessibility, and design. Backend concerns (hosting, redirects, server-rendered metadata, CMS) are noted where a front-end fix needs a matching production step, but are otherwise out of scope for this prototype.

---

## 1. Heading structure & on-page SEO

**The problem (live site):** The homepage's heading markup doesn't describe the page to search engines. The `<h1>` is literally the word **"WE."** Section labels are scattered across the wrong levels — "…AND MANY MORE!" and "YOU" are each marked up as `<h1>`, "THE NEXT ONE COULD BE" as an `<h5>` — so there are **multiple H1s** and a broken outline. The six-figure stat bar (500+, 200+, 0.4%, etc.) is marked up as **`<h4>` headings** when it's really data, which pollutes the heading tree. Whole sections ("Who we've worked with") have no real heading at all.

**The fix:**

- **One descriptive, keyword-rich `<h1>`** — "We modernize, advise, transform, build, integrate, automate and rescue software, AI, agents, data and enterprise systems." The bold rotating-verb visual is preserved, but the crawlable H1 now carries the full value proposition instead of one bare word.
- **A clean, single-level-per-section hierarchy:** every major section is an `<h2>` (What we do, Who we've worked with, Industries we serve, How we do it, Our expertise, Who we are, Why customers love us, Where/When we work, the CTA), and the items inside each section are `<h3>`.
- **Stats are data, not headings** — the numbers render as styled `<div>`s, so they no longer inflate the heading outline.
- **Exactly one `<h1>` on the page**, verified.

## 2. Crawlability of the "Why customers love us" content

**The problem (typical of JS-driven carousels):** Interactive sliders often hide their content in a way search engines discount, or duplicate it. A naive build of this section would either bury the ten reasons in `display:none` panels (which Google down-weights) or render a duplicate copy.

**The fix:** All **ten reasons are real `<h3>` + paragraph content that stays in the DOM and is crawlable** (visually hidden via a clip technique, not `display:none`). The animated foreground text that scrambles between frames is marked `aria-hidden="true"` and uses non-heading tags, so it's purely presentational — no duplicate headings, no hidden-text penalty, and the full content is available with JavaScript disabled.

## 3. Navigation

**The problem (live site):** The **"Our Work" nav item renders as plain text, not a link** — a dead menu entry that goes nowhere and passes no link equity. The 20 "Our Expertise" items are also plain text with **no links**.

**The fix:** Every nav item is a real, crawlable `<a>`. "Work" links to a dedicated work page, and the **20 expertise items are now individual links** into the services hub, creating real internal linking and crawl paths. A new "Creative Studio" dropdown (UX Studio / Game Studio) is injected consistently across every page.

## 4. Images & alt text

**The problem (live site):** The ten "Why Choose Us" images **use their own file path as alt text** (`alt="/images/whyChooseUs/1.jpg"`), and the "What Makes Plan A Special" gallery uses placeholder alt like `alt="Slide 1"`…`"Slide 9"`. That's meaningless to screen readers and to image search.

**The fix:** Every image carries **meaningful alt text** — client logos are labeled by company name; the award/gallery slides describe the work; and the "Why customers love us" photos have descriptive alt ("Two young professionals smiling while working in a modern office," etc.). Decorative-only visuals (the hero video, the 3D globe canvas) are correctly marked so assistive tech skips them. The photos were also swapped to **high-resolution imagery** to replace the low-res originals.

## 5. Duplicated / bloated markup

**The problem (live site):** The "Technologies We Use" marquee list is **rendered four times in the DOM**, bloating the page and repeating content.

**The fix:** The tech marquee is a **single DOM instance**; the infinite-scroll effect is achieved with CSS/JS transforms rather than by duplicating the markup four times.

## 6. Metadata, social & structured data

**The problem (live site):** Thin, generic head metadata (the meta description is just "Plan A Technologies"), and limited social-share coverage.

**The fix:** The homepage ships a **descriptive `<title>` and meta description**, a **canonical URL**, a full **Open Graph** set (`og:title`, `og:description`, `og:type`, `og:site_name`, `og:url`, `og:image`), **Twitter Card** tags, and **Organization JSON-LD** structured data (name, URL, phone, address, LinkedIn) so search engines and social platforms render rich, accurate previews.

## 7. Accessibility & semantics

**The fix:** Semantic landmarks throughout (`<nav>`, `<header>`, `<section>`, `<footer>`), a screen-reader-only descriptive H1, `aria-hidden` on decorative/animated layers, real `<label>`s on the contact form, keyboard-dismissable focus mode (Esc), and a **`prefers-reduced-motion` fallback** that turns every scroll-driven animation (the What-We-Do wipe sequence, the reel, the CTA reveal) into a clean static layout.

## 8. Design & brand

**The problem (stated):** The current design feels dated, and "the black and orange is pretty unforgiving."

**The fix:** A modern **dark-navy base** with **orange rationed as a single accent** (tickers, numbers, CTAs, hover states) softens the harsh black/orange while keeping the brand's bold, all-caps energy. The static info-squares become interactive, dimensional elements (cursor-tilt stat cards, a scroll-driven film-reel, a scramble hero, a 3D world map globe, a sideways-wipe What-We-Do sequence), and a scroll-driven contact reveal.

---

## Production follow-ups (need a backend/deploy step)

These are correct in the front-end but require a matching server-side action to fully close out:

- **One canonical hostname.** The live site currently serves the full site on **both `www.` and the apex domain with no redirect** — two crawlable copies. The prototype sets a `<link rel="canonical">`; production should also **301-redirect one hostname to the other.**
- **Serve assets from the canonical domain.** Client logos on the live site load from a `*.azurewebsites.net` staging host; migrate them (and self-host the Unsplash/CDN media used here) under the production domain.
- **Server-rendered metadata & per-route titles** for the other pages, plus `JobPosting` schema on careers and `sitemap.xml` / `robots.txt` — recommended in the full SEO audit and applied structurally here on the homepage.

*Scope: homepage front-end prototype. Copy is verbatim from the live site pending a separate content pass.*
