import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const output = new URL("../.qa/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];
const labels = { en: "EN", zh: "中文", ar: "العربية", ru: "Русский" };
const targets = {
  preview: process.env.SITE_URL || "http://127.0.0.1:5173/",
  offline: new URL("../Carmind-官网-对外分享版.html", import.meta.url).href
};

try {
  for (const [target, url] of Object.entries(targets)) {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        offline: target === "offline",
        reducedMotion: "no-preference"
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url);
      for (const [lang, label] of Object.entries(labels)) {
        if (width < 520) await page.locator(".language-select select").selectOption(lang);
        else await page.locator(".language-switcher").getByRole("button", { name: label, exact: true }).click();
        await page.locator(".map-frame").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector(".map-frame").dataset.motion === "running");
        assert.equal(await page.locator(".map-location").count(), 0);
        assert.equal(await page.locator(".map-node").count(), 14);
        assert.equal(await page.locator(".map-node[data-location='shanghai']").count(), 1);
        assert.equal(await page.locator(".map-flow-light").count(), 13);
        assert.equal(await page.locator(".map-flow-trail").count(), 13);
        const routesMatch = await page.locator(".map-connection").evaluateAll((routes) => routes.every((route) =>
          [...route.querySelectorAll("path")].every((path) => path.getAttribute("d") === route.firstElementChild.getAttribute("d"))
        ));
        assert.ok(routesMatch, "Animated paths must follow the real map routes");
        const before = await page.locator(".map-flow-light").first().evaluate((element) => getComputedStyle(element).strokeDashoffset);
        await page.waitForFunction((previous) => getComputedStyle(document.querySelector(".map-flow-light")).strokeDashoffset !== previous, before);
        assert.equal(await page.locator(".map-flow-light").first().evaluate((element) => getComputedStyle(element).animationPlayState), "running");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const point = page.locator(".map-node[data-location='lagos']");
        const position = await point.getAttribute("transform");
        await page.locator(".map-locations button").last().click();
        assert.equal(await page.locator(".map-node.active").getAttribute("data-location"), "lagos");
        assert.equal(await point.getAttribute("transform"), position);
        assert.equal(await page.locator(".map-location").count(), 0);
        if (lang === "en") {
          await page.locator(".map-frame").scrollIntoViewIfNeeded();
          await page.waitForTimeout(650);
          const first = await page.locator(".map-frame").screenshot({ path: fileURLToPath(new URL(`network-${target}-${width}-a.png`, output)) });
          await page.waitForTimeout(600);
          const second = await page.locator(".map-frame").screenshot({ path: fileURLToPath(new URL(`network-${target}-${width}-b.png`, output)) });
          assert.ok(!first.equals(second), "Map pixels must change over time");
        }
        results.push(`${target}-${lang}-${width}`);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(await page.locator(".map-flow-light").first().evaluate((element) => getComputedStyle(element).display), "none");
      assert.equal(await page.locator(".map-node.active .pulse").evaluate((element) => getComputedStyle(element).animationName), "none");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(() => document.querySelector(".map-frame").dataset.motion === "paused");
      assert.equal(await page.locator(".map-flow-light").first().evaluate((element) => getComputedStyle(element).animationPlayState), "paused");
      await context.close();
    }
  }
  assert.deepEqual(errors, []);
  console.log(`All ${results.length} animated map checks passed, including offline and reduced motion.`);
} finally {
  await browser.close();
  await writeFile(new URL("network-report.json", output), JSON.stringify({ passed: results, errors }, null, 2));
}
