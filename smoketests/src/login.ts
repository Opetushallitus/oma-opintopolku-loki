import { Page } from "puppeteer";
import { clickAndWait } from "./helpers";

export const suomiFiLogin = async (
  page: Page,
  hetu: string,
  opts: { local: boolean }
) => {
  if (opts.local) {
    await page.waitForSelector("#hetu");
    await page.type("#hetu", hetu);
    await clickAndWait(page, "button.koski-button.blue", {
      navigation: true,
    });
  } else {
    await clickAndWait(page, "#li_fakevetuma2");
    await clickAndWait(page, ".default-link");
    await clickAndWait(page, "#tunnistaudu");
    await clickAndWait(page, "#continue-button", { navigation: true });
  }
};
