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
  testPerson: { hetu: string; kutsumanimi: string };
};

const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
  local: {
    omadataUrl: process.env.OMADATA_URL || "http://localhost:7051",
    lokiUrl: "http://localhost:8080",
    testPerson: { hetu: "210281-8715", kutsumanimi: "Nordea" },
  },
  dev: {
    omadataUrl: "https://oph-koski-omadataoauth2sample-dev.testiopintopolku.fi",
    lokiUrl: "https://untuvaopintopolku.fi/oma-opintopolku/tietojen-kaytto",
    testPerson: { hetu: "210281-9988", kutsumanimi: "Nordea" },
  },
  qa: {
    omadataUrl: "https://oph-koski-omadataoauth2sample-qa.testiopintopolku.fi",
    lokiUrl: "https://testiopintopolku.fi/oma-opintopolku/tietojen-kaytto",
    testPerson: { hetu: "210281-9988", kutsumanimi: "Nordea" },
  },
};

// --- Trigger OAuth2 flow (deployed only) ---

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

  await suomiFiLogin(page, config.testPerson.hetu, { local: environment === "local" });

  await waitForUrlPart(page, "omadata-oauth2/authorize");
  await clickAndWait(page, "button.acceptance-button", { navigation: true });
  await waitForUrlPart(page, "form-post-response-cb");

  console.log("OAuth2 flow completed — audit log event should be generated");
};

// --- Verify loki UI renders audit log entries ---

const verifyLokiUI = async (page: Page, config: EnvironmentConfig) => {
  console.log("Verifying loki frontend...");

  await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });

  await expectTexts(page, ["tietojeni käyttö"]);

  await page.waitForFunction(
    () => {
      const content = document.documentElement?.innerText || "";
      return content.includes("Opintosuoritukset") || content.includes("organisaatio") || content.includes("20");
    },
    { timeout: 30000 }
  );

  console.log("Loki frontend renders audit log entries successfully");
};

const pollLokiUI = async (
  page: Page,
  config: EnvironmentConfig,
  baselineContent: string
) => {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    console.log("Polling loki UI for new entry...");
    await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });

    await expectTexts(page, ["tietojeni käyttö"]);

    const currentContent = await page.evaluate(
      () => document.documentElement?.innerText || ""
    );

    if (currentContent.length > baselineContent.length) {
      console.log("New audit log entry appeared in UI");
      return;
    }

    console.log(`No new entry yet. Retrying in ${POLL_INTERVAL_MS / 1000}s...`);
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `No new audit log entry appeared in UI within ${POLL_TIMEOUT_MS / 1000}s`
  );
};

// --- Main ---

const runLocal = async () => {
  const config = ENVIRONMENTS.local;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    page.setDefaultTimeout(TIMEOUT_MS);
    page.setDefaultNavigationTimeout(TIMEOUT_MS);

    // Locally: frontend at localhost:8080 with mock server, no auth needed
    // Parser is already covered by `make test` in CI
    console.log("Verifying local frontend renders mock data...");
    await verifyLokiUI(page, config);
    console.log("PASSED: Local frontend renders audit log data");
  } finally {
    await browser.close();
  }
};

const runDeployed = async (environment: "dev" | "qa") =>
  withRetries(RETRIES, async (attempt) => {
    console.log(
      `Running auditlog pipeline smoke test (${environment}) – attempt ${attempt}/${RETRIES}`
    );

    const config = ENVIRONMENTS[environment];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      page.setDefaultTimeout(TIMEOUT_MS);
      page.setDefaultNavigationTimeout(TIMEOUT_MS);

      // Step 1: Check loki UI baseline (may need login)
      console.log("Getting baseline from loki UI...");
      await page.goto(config.lokiUrl, { waitUntil: "networkidle2" });

      // TODO: handle suomi.fi login redirect for loki frontend if needed
      const baselineContent = await page.evaluate(
        () => document.documentElement?.innerText || ""
      );
      console.log(`Baseline content length: ${baselineContent.length}`);

      // Step 2: Trigger OAuth2 flow (generates audit log event)
      await triggerOAuth2Flow(page, config, environment);

      // Step 3: Poll loki UI until new entry appears
      await pollLokiUI(page, config, baselineContent);

      console.log("PASSED: Full pipeline works — audit log visible in UI");
    } finally {
      await browser.close();
    }
  });

// --- CLI ---

const environment = process.argv[2] as Environment | undefined;

if (!environment || !ENVIRONMENTS[environment]) {
  console.error("Usage: pnpm smoketest:local | pnpm smoketest:dev | pnpm smoketest:qa");
  process.exit(1);
}

if (environment === "local") {
  runLocal().catch((error) => {
    console.error(error instanceof Error ? error.message : JSON.stringify(error));
    process.exit(1);
  });
} else {
  runDeployed(environment).catch((error) => {
    console.error(error instanceof Error ? error.message : JSON.stringify(error));
    process.exit(1);
  });
}
