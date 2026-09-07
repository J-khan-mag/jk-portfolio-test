# Jahangir Khan — Architecture Portfolio

A portfolio of 54 projects, arranged as a building.

**Live:** https://jahangir-khan-portfolio.vercel.app

## The idea

The original portfolio numbered its sections after floor levels, so the site is
built as a section through a building rather than a list of work. You enter at
the top and descend:

| Level | |
|---|---|
| **L4** | In Development — live on site |
| **L3** | Built — completed and occupied |
| **L2** | Design Development — concept to authority approval |
| **L1** | Academic — thesis and studio work |
| **M** | Competitions & Experimental |
| **G** | The Record — profile, education, scope, tools |
| **B1** | Basement — everything that isn't architecture |

A drawn elevation tracks your position as you scroll, lighting the window that
corresponds to whichever project is under the cursor.

## Details worth knowing

- **Imagery** is graded to black and white with an SVG `feTurbulence` grain, and
  returns to full colour on hover. Grain strength lives in the filter's
  `feFuncA slope` — CSS opacity does nothing under `mix-blend-mode: overlay`.
- **Plates assemble from a mosaic** of small tiles as they rise into view, driven
  purely by scroll geometry rather than a timeline.
- **Ambient piano** is synthesised in the browser — no audio files. Partials
  follow the string inharmonicity law `fn = f1·n·√(1 + B·n²)`, through a
  generated convolution reverb.
- **The basement** is deliberately hard to reach and holds nothing architectural.

## Stack

Vite 6 · React 18 · TypeScript · no UI framework, no CSS framework, no analytics.
Deployed on Vercel.

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
```

`print.html` renders every project as paginated spreads, which is how the PDF
edition of the portfolio is produced.

## Security

The site is static: no accounts, no forms, no database, no user data. It ships a
strict `Content-Security-Policy` (`default-src 'self'`, no `unsafe-inline`
anywhere), HSTS, `frame-ancestors 'none'`, a restrictive `Permissions-Policy`
and cross-origin isolation headers — all defined in `vercel.json`. Fonts are
self-hosted, so the browser contacts no third-party host at any point.

Disclosure contact: `/.well-known/security.txt`.

## Credit

Project imagery for Keturah Resort and Keturah Reserve is published developer
material, reproduced to illustrate scope of involvement. All other images are
the author's own work.
