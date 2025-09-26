# Biolink — Personal Bio Tool to link everything

This project is a self-hosted alternative to Linktree, built only with HTML, CSS, and JavaScript.  
It runs entirely on GitHub Pages without any external dependencies.

👉 **Live site:** [https://ericmargay.github.io/biolink/](https://ericmargay.github.io/biolink/)

---

## Features
- **Public page — clean, responsive link hub with profile, avatar, badges, and clickable link cards.
- **Admin panel — local editor for profile and links.
  - Password-protected to prevent casual edits.
  - Save locally in your browser (`localStorage`).
  - Export / Import `data.json` to publish changes.
- **SVG official icons** for common services (website, email, github, x, linkedin, instagram, facebook, youtube, tiktok, discord, telegram, whatsapp, spotify, soundcloud, twitch, bandcamp, medium, substack, paypal, patreon, kofi, amazon, shopify).
- **Full-card click**: each link card is entirely clickable.
- **Dark/Light theme toggle** with accent color customization.

---

## How it works
- All configuration is stored in `data.json`.
- `index.html` fetches
