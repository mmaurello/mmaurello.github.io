# Resume — mmaurello.github.io

A data-driven resume site built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and deployed to GitHub Pages.

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

Email and phone are intentionally omitted from the public resume. Use the **Contact** section at the bottom of the page instead.

## Contact form setup

The contact form uses [Web3Forms](https://web3forms.com) to deliver messages to your personal inbox without exposing your email on the site.

1. Sign up at [web3forms.com](https://web3forms.com) with the email address that should receive messages.
2. Copy your access key from the dashboard.
3. For local development, copy `.env.example` to `.env` and set your key:

   ```sh
   cp .env.example .env
   # edit PUBLIC_WEB3FORMS_ACCESS_KEY in .env
   ```

4. For production (GitHub Pages), add a repository secret:
   - Repo → **Settings → Secrets and variables → Actions**
   - New secret: `WEB3FORMS_ACCESS_KEY` = your Web3Forms access key

The deploy workflow passes this secret into the build as `PUBLIC_WEB3FORMS_ACCESS_KEY`.

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
