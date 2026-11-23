# jamesashwood.com

The source for [jamesashwood.com](https://www.jamesashwood.com) — a hand-written static
site with no build step, no framework and no third-party requests. System sans for the
interface, self-hosted Newsreader for essays and IBM Plex Mono for labels, with a
light/dark theme. Also contains the LaTeX
source for my CV.

```
.
├── AGENTS.md               # note: main deploys straight to production
├── index.html              # dense about + selected work + ideas
├── 404.html
├── work/                   # all projects
├── notes/                  # short technical notes
├── ideas/                  # idea list
├── cv/index.html           # web CV + PDF download
├── assets/
│   ├── styles.css
│   ├── main.js             # theme toggle, mobile nav, scroll reveals
│   ├── fonts/              # Newsreader + IBM Plex Mono (OFL)
│   ├── favicon.svg
│   └── og.png              # social preview image
├── cv/
│   ├── james-ashwood-cv.tex
│   └── james-ashwood-cv.pdf
├── deploy/
│   └── nginx.conf          # server block for a DigitalOcean droplet
├── CNAME                   # used by GitHub Pages
├── robots.txt
└── sitemap.xml
```

## Local preview

Any static server works:

```bash
cd jamesashwood.com
python3 -m http.server 8080
# open http://localhost:8080
```

Use a server rather than opening the files directly: the site uses root-relative paths
(`/assets/...`) so that the work, ideas and CV pages resolve from their subdirectories.

## Editing content

The home page is `index.html`; each section is marked with a comment. Work lives in
`work/`, notes in `notes/`, ideas in `ideas/`, and the web CV in `cv/index.html`. Notes
are published only after James has approved them. Colours and type live
at the top of `assets/styles.css` as CSS custom properties, with a separate block for dark
mode.

The light/dark toggle respects the visitor's system preference on first visit, then
remembers their choice in `localStorage`.

### Updating the CV

```bash
cd cv
pdflatex james-ashwood-cv.tex
pdflatex james-ashwood-cv.tex   # twice, so links resolve
```

The PDF is linked from the CV page and the contact section. Replace
`cv/james-ashwood-cv.pdf` after rebuilding.

### Things you may want to add

- **A photo.** Drop a portrait at `assets/photo.jpg` and add an `<img>` to the hero or
  about section. The current design deliberately works without one.
- **Your phone number** is on the CV but intentionally left off the website.
- **Analytics** (e.g. Plausible or GoatCounter) can be added as a single script tag in
  `<head>`.
- **Notes** only after James has approved the final text. Do not publish first-person
  drafts or employer-related details without explicit sign-off.

## Deploying to DigitalOcean

> **`main` is production.** The live app is connected to `main`, so every push deploys
> straight to https://www.jamesashwood.com. There is no staging environment — preview
> locally before committing. The apex `jamesashwood.com` has no DNS record yet, so `www`
> is the canonical host in the metadata. See `AGENTS.md` for the working agreement.

### DNS (as of November 2026)

- `www.jamesashwood.com` → `king-prawn-app-9r8fb.ondigitalocean.app` (correct).
- `jamesashwood.com` (apex) has **no A/AAAA record** and returns NXDOMAIN. If you open the
  apex and see something, it is a cached or parked page, not this deployment.
- To fix it at Namecheap: **Advanced DNS → Add New Record**, either
  - `A` record, host `@`, value one of the App Platform ingress IPs shown in
    DigitalOcean (currently `162.159.140.98` and `172.66.0.96`), or
  - a **URL Redirect** record, host `@` → `https://www.jamesashwood.com`.
  Then add `jamesashwood.com` under the app's **Settings → Domains** in DigitalOcean.

### Option A — App Platform (the live setup)

App Platform builds and serves the site directly from GitHub, gives you HTTPS and a CDN,
and redeploys on every push to `main`.

1. Push this repository to GitHub.
2. In DigitalOcean: **Apps → Create App → GitHub**, pick this repo and the `main` branch.
3. Choose **Static Site** as the resource type.
4. Build command: leave empty (or `echo "no build step"`).
5. Output directory: `/`.
6. Create the app, then **Settings → Domains** and add `jamesashwood.com` and
   `www.jamesashwood.com`.
7. DigitalOcean will show the DNS records to create at your registrar (an `A` record for
   the apex and a `CNAME` for `www`). Add them, wait for propagation, and enable HTTPS.

Because `CNAME` is present, GitHub Pages also works with no extra configuration if you
ever want a fallback.

### Option B — Droplet with Nginx

On a fresh Ubuntu droplet:

```bash
sudo apt update && sudo apt install -y nginx git
sudo mkdir -p /var/www/jamesashwood.com
sudo git clone https://github.com/ja927cam/jamesashwood.com.git /var/www/jamesashwood.com
sudo chown -R www-data:www-data /var/www/jamesashwood.com
```

Install the server block:

```bash
sudo cp /var/www/jamesashwood.com/deploy/nginx.conf /etc/nginx/sites-available/jamesashwood.com
sudo ln -s /etc/nginx/sites-available/jamesashwood.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Point an `A` record for `jamesashwood.com` (and `www`) at the droplet's IP. Then add TLS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jamesashwood.com -d www.jamesashwood.com
```

To publish changes after pushing to GitHub:

```bash
cd /var/www/jamesashwood.com && sudo git pull
```

No build, no restart — Nginx serves the files straight from disk.

## Licence

Site content and CV © James Ashwood. The code is free to learn from; please don't reuse
the personal content or pass the site off as your own.
