# How Far from Clinical Deployment? Evaluating the Complete UDA Pipeline in Medical Imaging

Source code for the project website of the WACV 2027 paper:

> **How Far from Clinical Deployment? Evaluating the Complete Unsupervised Domain Adaptation Pipeline in Medical Imaging**
> Yiheng Xiong, Luisa Gallée, Daniel Santak Wolf, Heiko Hillenhagen, Michael Götz
> Section of Experimental Radiology, Ulm University Medical Center · Visual Computing Group, Ulm University

The website is a static single-page site built on the [Nerfies](https://github.com/nerfies/nerfies.github.io) template (HTML + Bulma CSS + a small amount of vanilla JavaScript). No build step is required.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. You can also open `index.html` directly in a browser.

## Deploying to GitHub Pages

The site is served directly from the repository root, so any static host works.

1. Create a GitHub repository, e.g. `complete-uda-pipeline-site`.
2. Push the contents of this folder to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Add WACV 2027 project website"
   git branch -M main
   git remote add origin https://github.com/xiongyiheng/complete-uda-pipeline-site.git
   git push -u origin main
   ```
3. In the repository settings, open **Pages** and set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. The site will be published at `https://xiongyiheng.github.io/complete-uda-pipeline-site/`.

All asset paths are relative (`./static/...`), so the site works under a repository subpath as well.

## Structure

```
index.html                  single-page site
static/css/index.css        site styles (built on bulma.min.css)
static/js/index.js          navbar, results table, lightbox, copy-to-clipboard
static/js/results-data.js   machine-readable per-scenario result tables
static/images/teaser.png    hero teaser figure (webp fallback: teaser.webp)
static/images/figures/      result figures (converted from the paper PDFs)
static/pdf/paper.pdf        camera-ready paper
static/pdf/supplementary.pdf supplementary material
```

## Updating metadata

- **arXiv**: linked to <https://arxiv.org/abs/2608.12035> in the hero and resources.
- **BibTeX**: currently cites the arXiv preprint. Once WACV assigns proceedings details, update the entry
  to an `@inproceedings` with the final page numbers and DOI.

## Website license

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This website is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>, following the Nerfies template.
