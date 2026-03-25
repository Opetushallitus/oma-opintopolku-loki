import puppeteer, { Page } from "puppeteer";
import { suomiFiLogin } from "./login";
import {
  clickAndWait,
  waitForUrlPart,
  expectTexts,
  withRetries,
  sleep,
  RETRIES,
  TIMEOUT_MS,
  POLL_INTERVAL_MS,
  POLL_TIMEOUT_MS,
} from "./helpers";

type Environment = "local" | "dev" | "qa";

type EnvironmentConfig = {
  omadataUrl: string;
  lokiUrl: string;
  testPerson: { hetu: string };
};

const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
  local: {
    omadataUrl: process.env.OMADATA_URL || "http://localhost:7051",
    lokiUrl: "http://localhost:8080",
    testPerson: { hetu: "210281-8715" },
  },
  dev: {
    omadataUrl: "https://oph-koski-omadataoauth2sample-dev.testiopintopolku.fi",
    lokiUrl: "https://untuvaopintopolku.fi/oma-opintopolku-loki/",
    testPerson: { hetu: "210281-9988" },
  },
  qa: {
    omadataUrl: "https://oph-koski-omadataoauth2sample-qa.testiopintopolku.fi",
    lokiUrl: "https://testiopintopolku.fi/oma-opintopolku-loki/",
    testPerson: { hetu: "210281-9988" },
  },
};

const launchBrowser = () =>
  puppeteer.launch({
    headless: true,
    args: process.env.CI ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  });

// --- Login to loki frontend via suomi.fi ---

const loginToLoki = async (page: Page, config: EnvironmentConfig) => {
  console.log("Navigating to loki frontend...");
  await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });

  const loginButton = await page.$("#header-login-button").catch(() => null);
  if (loginButton) {
    console.log("Clicking login button...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.evaluate(() => {
        (document.querySelector("#header-login-button") as HTMLElement)?.click();
      }),
    ]);
  }

  const url = page.url();
  if (url.includes("tunnistus") || url.includes("apro")) {
    console.log("At suomi.fi login, authenticating...");
    await suomiFiLogin(page, config.testPerson.hetu, { local: false });
    await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  }

  await expectTexts(page, ["tietojeni käyttö"]);
  console.log("Logged in to loki frontend");
};

// --- Trigger OAuth2 flow ---

const triggerOAuth2Flow = async (
  page: Page,
  config: EnvironmentConfig,
  environment: Environment
) => {
  console.log("Navigating to omadata OAuth2 sample...");
  await page.goto(config.omadataUrl, { waitUntil: "networkidle2" });

  await clickAndWait(
    page,
    'a[href="/api/openid-api-test?scope=HENKILOTIEDOT_KAIKKI_TIEDOT+OPISKELUOIKEUDET_SUORITETUT_TUTKINNOT"]',
    { navigation: true }
  );

  const url = page.url();
  if (url.includes("tunnistus") || url.includes("apro")) {
    console.log("Need to login for OAuth2 flow...");
    await suomiFiLogin(page, config.testPerson.hetu, { local: environment === "local" });
  }

  await waitForUrlPart(page, "omadata-oauth2/authorize");
  await clickAndWait(page, "button.acceptance-button", { navigation: true });
  await waitForUrlPart(page, "form-post-response-cb");

  console.log("OAuth2 flow completed — audit log event generated");
};

// --- Audit log data from frontend's window.__auditLogData ---

type AuditLogEntry = {
  organizations: Array<{ oid: string; name: Record<string, string> }>;
  timestamps: string[];
  serviceName: string;
  isMyDataUse: boolean;
  isJakolinkkiUse: boolean;
};

const readAuditLogData = async (page: Page): Promise<AuditLogEntry[]> => {
  return page.evaluate(() => (window as any).__auditLogData || []);
};

const getMyDataTimestampCount = (entries: AuditLogEntry[]): number =>
  entries
    .filter((e) => e.isMyDataUse)
    .reduce((sum, e) => sum + e.timestamps.length, 0);

const logEntries = (entries: AuditLogEntry[]) => {
  for (const entry of entries) {
    const orgNames = entry.organizations
      .map((o) => (typeof o.name === "string" ? o.name : o.name.fi) || o.oid)
      .join(", ");
    console.log(
      `  ${orgNames} | ${entry.serviceName} | ${entry.timestamps.length} timestamps | myData=${entry.isMyDataUse}`
    );
  }
};

// --- Verify loki UI renders audit log entries ---

const verifyLokiUI = async (page: Page) => {
  await expectTexts(page, ["tietojeni käyttö"]);

  await page.waitForFunction(
    () => {
      const content = document.documentElement?.innerText || "";
      return (
        content.includes("Opintosuoritukset") ||
        content.includes("organisaatio") ||
        content.includes("20")
      );
    },
    { timeout: 30000 }
  );
};

// --- Navigate to loki and read data ---

const loadLokiAndReadData = async (
  page: Page,
  config: EnvironmentConfig
): Promise<AuditLogEntry[]> => {
  await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });

  // Re-login if session was lost
  const loginButton = await page.$("#header-login-button").catch(() => null);
  if (loginButton) {
    console.log("Session lost, re-logging in...");
    await loginToLoki(page, config);
  }

  // Wait for data to load
  await page.waitForFunction(
    () => (window as any).__auditLogData !== undefined,
    { timeout: TIMEOUT_MS }
  );

  return readAuditLogData(page);
};

// --- Poll for new entry ---

const pollForNewEntry = async (
  page: Page,
  config: EnvironmentConfig,
  baselineCount: number
) => {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    console.log("Polling for new myData entry...");

    try {
      const entries = await loadLokiAndReadData(page, config);
      const currentCount = getMyDataTimestampCount(entries);

      console.log(
        `MyData timestamps: baseline=${baselineCount}, current=${currentCount}`
      );

      if (currentCount > baselineCount) {
        console.log("New audit log entry found!");
        return;
      }
    } catch (e) {
      console.log(`Poll failed: ${e instanceof Error ? e.message : e}`);
    }

    console.log(`No new entry yet. Retrying in ${POLL_INTERVAL_MS / 1000}s...`);
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `No new audit log entry appeared within ${POLL_TIMEOUT_MS / 1000}s`
  );
};

// --- Main ---

const runLocal = async () => {
  const config = ENVIRONMENTS.local;
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    page.setDefaultTimeout(TIMEOUT_MS);
    page.setDefaultNavigationTimeout(TIMEOUT_MS);

    console.log("Verifying local frontend renders mock data...");
    await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });
    await verifyLokiUI(page);
    console.log("PASSED: Local frontend renders audit log data");
  } finally {
    await browser.close();
  }
};

const runDeployed = async (environment: "dev" | "qa") =>
  withRetries(RETRIES, async (attempt) => {
    console.log(
      `Running smoke test (${environment}) – attempt ${attempt}/${RETRIES}`
    );

    const config = ENVIRONMENTS[environment];
    const browser = await launchBrowser();
    const page = await browser.newPage();

    try {
      page.setDefaultTimeout(TIMEOUT_MS);
      page.setDefaultNavigationTimeout(TIMEOUT_MS);

      // Step 1: Login and verify UI
      await loginToLoki(page, config);
      await verifyLokiUI(page);
      console.log("PASSED: UI renders audit log data\n");

      // Step 2: Read API data from window.__auditLogData
      await page.waitForFunction(
        () => Array.isArray((window as any).__auditLogData) && (window as any).__auditLogData.length > 0,
        { timeout: TIMEOUT_MS }
      );
      const entries = await readAuditLogData(page);
      console.log(`API returned ${entries.length} entries:`);
      logEntries(entries);
      const baselineCount = getMyDataTimestampCount(entries);
      console.log(`Baseline myData timestamps: ${baselineCount}\n`);

      // Step 3: Trigger OAuth2 flow
      await triggerOAuth2Flow(page, config, environment);

      // Step 4: Poll for new myData timestamp
      await pollForNewEntry(page, config, baselineCount);

      console.log("PASSED: Full pipeline — new audit log entry visible");
    } finally {
      await browser.close();
    }
  });

// --- CLI ---

const environment = process.argv[2] as Environment | undefined;

if (!environment || !ENVIRONMENTS[environment]) {
  console.error(
    "Usage: npm run smoketest:local | npm run smoketest:dev | npm run smoketest:qa"
  );
  process.exit(1);
}

if (environment === "local") {
  runLocal().catch((error) => {
    console.error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    process.exit(1);
  });
} else {
  runDeployed(environment).catch((error) => {
    console.error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    process.exit(1);
  });
}
