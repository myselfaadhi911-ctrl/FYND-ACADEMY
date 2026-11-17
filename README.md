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
