# AGENTS.md

## ⚠️ `main` is production

Every push to `main` deploys straight to **https://www.jamesashwood.com** via DigitalOcean
App Platform (static site, no build step). There is no staging environment.

- Treat every commit on `main` as a release. Preview locally before committing:
  `python3 -m http.server 8080` from the repo root.
- For risky or experimental changes, work on a branch and open a PR. The production app
  watches `main`; merging is the deploy.
- Never park WIP, secrets, analytics keys or unpublished personal information on `main`.
- Pushing also redeploys `cv/james-ashwood-cv.pdf` if it changed, so rebuild the PDF before
  committing it.
- After a push, check the live site (it may take a minute to rebuild). Asset URLs carry a
  `?v=` query; bump it when the CSS or JS changes so returning visitors do not get a stale mix.

## What this is

Hand-written static personal site — no framework, build step or runtime dependencies.
Interface type is system sans; essays use self-hosted Newsreader and labels use IBM Plex
Mono. Palette and spacing are CSS custom properties at the top of `assets/styles.css`.

```
index.html          about + selected work + ideas previews
404.html
work/               all projects
notes/              approved technical notes
ideas/              ideas page
cv/index.html       web CV + PDF download
assets/styles.css   design tokens, layout, light/dark themes, responsive rules
assets/main.js      theme toggle, mobile nav, active section, scroll reveals
assets/fonts/       self-hosted woff2 subsets (OFL)
cv/                 LaTeX CV source + compiled PDF
deploy/nginx.conf   server block for a droplet install
CNAME               GitHub Pages custom domain
```

## Checks before pushing

- `node --check assets/main.js`
- `python3 -m http.server 8080` and look at desktop + ~390px width, light + dark.
- Links: `/work/`, `/ideas/`, `/cv/` resolve; the CV PDF opens.
- The site must stay fully static: no external font/script/CDN requests.

## Content approval

- **Never publish first-person notes, blog posts, opinions or employer/client details that
  James has not explicitly approved.** This is not a drafting surface.
- Do not turn CV or LinkedIn material into blog posts. If asked to draft one, keep it out
  of the repo and out of `main` until it has been read and approved.
- Unapproved drafts were removed and history purged on 23 November 2026. New notes are
  based only on projects James named and reproduce facts from the source repositories.
- Project and CV facts may be used, but avoid inventing narrative, motives or specifics.

## CV

```bash
cd cv
pdflatex james-ashwood-cv.tex
pdflatex james-ashwood-cv.tex   # twice for links/outlines
```

Do not commit `.aux`, `.log`, `.out` (ignored). Replace the PDF in the same commit as the
`.tex` change.

## Deployment facts

- Production host: DigitalOcean App Platform, static site, output directory `/`.
- Domain: `www.jamesashwood.com` is the canonical/live host; HTTPS handled by the
  platform. The apex `jamesashwood.com` has no A record (as of Nov 2026), so all canonical,
  OG, sitemap and JSON-LD URLs must use `www`.
- A droplet alternative is documented in `README.md` and `deploy/nginx.conf`, but the live
  app is the App Platform one.
