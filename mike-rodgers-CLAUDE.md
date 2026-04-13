# Lionheart & Soul — Claude Context

## What this is
Personal portfolio/coaching site for Mike Rodgers, certified life coach.
Deployed on GitHub Pages. Live at https://lionheartandsoulbymike.com

## Stack
- Vanilla HTML/CSS/JS — no frameworks, no build tools
- Single-page site: all content is inline in index.html
- Google Fonts: Playfair Display (700,800) + Inter (300–800)
- Inline SVG icons (no icon library)
- GitHub Actions for deployment (.github/workflows/)

## File structure
```
index.html       — All page content lives here
css/styles.css   — All styles. Versioned with ?v=N on <link> tag.
js/main.js       — All interactions: nav scroll, carousel, video mute, form submit
CNAME            — Custom domain. Do not edit.
*.jpeg / *.png   — Images at root level
*.mp4            — Videos at root level (speaking + testimonial)
```

## Page sections (in order)
1. `<nav>` — sticky navbar with hamburger
2. `<section.hero>` — full-screen bg image
3. `<section.services>` — service cards grid
4. `<section.mission>` — dark bg, bold quote
5. `<section.gallery>` — image carousel (Carousel-1 through Carousel-10)
6. `<section.about>` — 2-col: image | bio + certifications grid
7. `<section.content>` — speaking video + social platform links
8. `<section.testimonial-section>` — testimonial video
9. `<section.book>` — contact form with success state
10. `<footer>` — logo + social icons + copyright

## Key rules
- All content is in index.html — edit it directly
- Always increment `?v=N` on the css/styles.css link when editing CSS
- Video files autoplay, muted, looped — mute toggle is in js/main.js
- The gallery carousel expects exactly Carousel-1.jpeg through Carousel-N.jpeg
- Form submits via js/main.js fetch — check there before touching form HTML
- Do not add a backend or serverless functions — this is static only

## When I ask about styles
Edit css/styles.css only. Bump the version on the link tag in index.html.

## When I ask about the carousel
The carousel logic is in js/main.js. Gallery images are at root level.

## Do not
- Add React, Vue, or any framework
- Add a package.json or node_modules
- Rename files that are referenced in index.html without updating all references
- Edit CNAME
- Change the deployment workflow in .github/workflows/ without being asked
