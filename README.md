# Resume — mmaurello.github.io

A data-driven resume site built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Local development

```sh
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) to preview the site.

## Editing your resume

All resume content lives in a single file:

```
src/data/resume.ts
```

Update your name, experience, skills, and other sections there. No component changes are needed for content updates.

## Build

```sh
pnpm build
pnpm preview   # preview the production build locally
```

## Deploy to GitHub Pages

1. Merge changes to the `main` branch.
2. In your GitHub repo, go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

The site will be published at [https://mmaurello.github.io](https://mmaurello.github.io).
