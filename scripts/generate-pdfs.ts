import { type ChildProcess, spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Browser, chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const previewPort = 4322;
const baseUrl = `http://127.0.0.1:${previewPort}`;

interface PdfVariant {
  path: string;
  file: string;
  label: string;
}

const variants: PdfVariant[] = [
  {
    path: "/",
    file: "CV_MJM_full-stack.pdf",
    label: "Full-stack",
  },
  {
    path: "/web3",
    file: "CV_MJM_web3.pdf",
    label: "Web3",
  },
];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url: string, attempts = 40): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) return;
    } catch {
      // not ready yet
    }
    await wait(250);
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

function startPreview(): ChildProcess {
  const child = spawn(
    "pnpm",
    ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", String(previewPort)],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    },
  );

  child.stdout?.on("data", (chunk: Buffer) => {
    process.stdout.write(chunk);
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    process.stderr.write(chunk);
  });

  return child;
}

async function generatePdfs(): Promise<void> {
  await mkdir(publicDir, { recursive: true });

  const preview = startPreview();
  let browser: Browser | undefined;

  try {
    await waitForServer(baseUrl);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Ensure reveal animations are visible without relying on beforeprint.
    await page.emulateMedia({ media: "print", colorScheme: "light" });

    for (const variant of variants) {
      const url = `${baseUrl}${variant.path}`;
      console.log(`Generating ${variant.label} PDF from ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        for (const el of document.querySelectorAll(".reveal")) {
          el.classList.add("is-visible");
        }
        document.documentElement.classList.remove("dark");
        document.body?.classList.remove("dark");
      });

      const outPath = path.join(publicDir, variant.file);
      await page.pdf({
        path: outPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "0.8cm",
          right: "0.8cm",
          bottom: "0.8cm",
          left: "0.8cm",
        },
      });
      console.log(`Wrote ${outPath}`);
    }
  } finally {
    await browser?.close();
    preview.kill("SIGTERM");
  }
}

generatePdfs().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
