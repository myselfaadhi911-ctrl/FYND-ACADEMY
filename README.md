# FYND Academy Website

A responsive, lightweight five-page static website for FYND Academy.

## Pages
- `index.html` — Home and Enroll Now dialog
- `about.html` — About the academy and its learning philosophy
- `courses.html` — Learning paths with category filters
- `blogs.html` — Journal cards with live search
- `contact.html` — Enquiry form

## Tech
- Semantic HTML, CSS and vanilla JavaScript
- No framework, build step or runtime dependencies
- Responsive navigation, keyboard support and reduced-motion handling
- SEO descriptions, canonical links, Open Graph metadata and organization structured data

## Preview
Open `index.html` in a browser. No build command is required.

## Before launch
The course list and article cards are starter content and should be confirmed or replaced with current academy information. The enrollment and contact forms are front-end demonstrations only: they do not send or store submissions. Connect a form backend, CRM or email workflow before accepting real enquiries.

## Deploy
The site is connected to Vercel through the GitHub repository. Push changes to the `main` branch to trigger a new deployment.

## Design notes (colour-play update)
- Display font: Bricolage Grotesque (Google Fonts); body: DM Sans.
- Headings are split into letters by `script.js` and animate on scroll; confetti, tilt cards, scroll bar and click bursts are also generated there.
- All motion is disabled under `prefers-reduced-motion`.

## Flow layer (animation update)
- **Flowing background:** a fixed `<canvas>` (created in `script.js`) draws layered blue/charcoal ribbons and soft glows. They drift with scroll position and speed up with scroll velocity. Edit the `layers` / `blobs` arrays to change colour, speed or density.
- **Scroll animation:** elements are auto-tagged `.sx` with directional reveals (up / left / right / zoom / pop / flip, staggered, blur-to-sharp). Add or change targets in the `tag(...)` calls. Parallax shapes, hero fade-out, a scroll-linked giant text marquee, number counters and a header that hides on scroll-down are all in the same block.
- **Creative extras:** orbiting hero chips, stats band, wave dividers before dark sections, cursor spotlight, magnetic buttons, 3D tilt + spotlight on cards, page-load curtain.
- Palette is unchanged (royal blue `#394BD4`, charcoal `#343434`, grey `#E0E0E0`).
- Everything is disabled or made static under `prefers-reduced-motion`.

## Studio layer (second animation update)
- **Header:** floating glass pill with a light travelling round its border, a sliding highlight behind the nav links, and an animated Enroll button.
- **Footer:** closing call-to-action, drifting glow, dot grid and a giant hover-able FYND wordmark. Injected by `script.js` so every page gets it.
- **Cursor:** dot + trailing ring + comet tail + click ripple (mouse only; native cursor is restored over the enquiry dialog). Ring grows over links and cards.
- **Background:** adds an interactive particle network, a dot grid that lights up around the pointer and a fine grain, on top of the flowing ribbons.
- **New elements:** hero search/analytics/like widgets, hand-drawn underline, scroll-drawn "How it works" journey, floating enquire badge, back-to-top ring, rotating badge on inner-page heroes.
