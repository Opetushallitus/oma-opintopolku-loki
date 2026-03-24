import { Page } from "puppeteer";

export const RETRIES = 3;
export const TIMEOUT_MS = 30000;
export const POLL_INTERVAL_MS = 30000;
export const POLL_TIMEOUT_MS = 600000; // 10 minutes

export const clickAndWait = async (
  page: Page,
  selector: string,
  options: { navigation?: boolean } = {}
) => {
  console.log(`Wait for ${selector}`);
  await page.waitForSelector(selector);

  if (options.navigation) {
    console.log(`Click ${selector}`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(selector),
    ]);
  } else {
    await page.click(selector);
  }
};

export const waitForUrlPart = async (page: Page, part: string) => {
  console.log("Wait for url part", part);
  await page.waitForFunction(
    (expected: string) => window.location.href.includes(expected),
    {},
    part
  );
};

export const expectTexts = async (page: Page, texts: string[]) => {
  await page.waitForFunction(
    (expected: string[]) => {
      const content = document.documentElement?.innerText?.toLowerCase() || "";
      return expected.every((t) => content.includes(t.toLowerCase()));
    },
    {},
    texts
  );
};

export const withRetries = async <T>(
  attempts: number,
  fn: (attempt: number) => Promise<T>
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(i + 1);
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${i + 1}/${attempts} failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  throw lastError;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
