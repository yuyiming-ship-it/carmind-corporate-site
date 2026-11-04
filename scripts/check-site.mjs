import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const baseURL = process.env.SITE_URL || "http://127.0.0.1:5173/";
const output = new URL("../.qa/", import.meta.url);
const artifactPath = (name) => fileURLToPath(new URL(name, output));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const results = [];
const sizes = [[3440,1440], [2560,1440], [1920,1080], [1440,900], [1280,720], [1024,768], [768,1024], [390,844], [360,640], [320,568], [844,390]];
const names = { en: "EN", zh: "中文", ar: "العربية", ru: "Русский" };

async function locale(page, lang) {
  if (await page.locator(".language-select").isVisible()) await page.locator(".language-select select").selectOption(lang);
  else await page.locator(".language-switcher").getByRole("button", { name: names[lang], exact: true }).click();
  await page.waitForFunction((key) => document.documentElement.lang === key, lang);
}

async function images(page, parent) {
  await parent.scrollIntoViewIfNeeded();
  await parent.locator("img").evaluateAll(async (elements) => {
    await Promise.all(elements.map((image) => image.decode().catch(() => {})));
  });
  const missing = await parent.locator("img").evaluateAll((elements) => elements.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.getAttribute("src")));
  assert.deepEqual(missing, [], "Broken images");
}

async function layout(page, label) {
  const state = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main strong, main p, main button:not(.image-crop), .topbar a, .topbar button")]
      .filter((element) => element.getClientRects().length && !element.closest("dialog, .sr-only"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.right > width + 2 || bounds.left < -2 || element.scrollWidth > element.clientWidth + 3;
      }).map((element) => ({ tag: element.tagName, class: element.className, text: element.textContent.slice(0,90) }));
    return { documentWidth: document.documentElement.scrollWidth, viewportWidth: width, offenders };
  });
  assert.ok(state.documentWidth <= state.viewportWidth + 1, `${label}: document overflow ${JSON.stringify(state)}`);
  assert.deepEqual(state.offenders, [], `${label}: text or control overflow`);
}

try {
  for (const [width,height] of sizes) {
    for (const lang of Object.keys(names)) {
      const label = `${lang}-${width}x${height}`;
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        await page.goto(baseURL, { waitUntil: "networkidle" });
        await locale(page, lang);
        assert.equal(await page.locator("html").getAttribute("dir"), lang === "ar" ? "rtl" : "ltr");
        assert.equal(await page.locator("h1").count(), 1);
        const framing = await page.evaluate(() => ({
          culture: document.querySelector("#culture").getBoundingClientRect().top,
          actions: document.querySelector(".hero-actions").getBoundingClientRect().bottom,
          height: innerHeight
        }));
        assert.ok(framing.culture >= height - 1, `${label}: culture visible in first viewport`);
        assert.ok(framing.actions <= height + 1, `${label}: hero actions outside viewport (${framing.actions})`);
        await layout(page, label);
        assert.equal(await page.locator("form").count(), 0);
        assert.equal(await page.locator(".contact-direct a").count(), 3);
        assert.equal(await page.locator(".export-mode-row span").count(), 3);
        assert.equal(await page.locator(".export-service-grid article").count(), 8);
        assert.equal(await page.locator(".partner-grid article").count(), 5);
        assert.equal(await page.locator(".map-node").count(), 14);
        assert.equal(await page.locator(".map-node[data-location='lagos']").count(), 1);
        assert.equal(await page.locator(".language-select select option").count(), 4);
        const duplicateIds = await page.locator("[id]").evaluateAll((elements) => elements.map((e) => e.id).filter((id,index,all) => all.indexOf(id) !== index));
        assert.deepEqual(duplicateIds, []);
        const hashLinks = await page.locator("a[href^='#']").evaluateAll((elements) => elements.map((e) => e.hash));
        for (const target of hashLinks) assert.equal(await page.locator(target).count(), 1, `Missing navigation target ${target}`);
        const sequenceBadges = await page.locator("main span, main small, main i").evaluateAll((elements) => elements.filter((e) => e.getClientRects().length && /^(0\d|\d{2}\s*\/\s*\d{2})$/.test(e.textContent.trim())).map((e) => e.textContent));
        assert.deepEqual(sequenceBadges, [], "Decorative sequence numbers");
        await page.locator(".organization-details > summary").click();
        assert.equal(await page.locator(".org-center > header").count(), 4);
        assert.equal(await page.locator(".org-centers > article:nth-child(n+3) > :not(header)").count(), 0);
        assert.equal(await page.locator(".org-centers > article:nth-child(1) section").count(), 4);
        assert.equal(await page.locator(".org-centers > article:nth-child(2) section").count(), 2);
        await layout(page, `${label}: organization`);
        await page.locator(".office-section > summary").click();
        assert.equal(await page.locator(".office-grid article").count(), 8);
        await layout(page, `${label}: offices`);
        if (width === 1440 || width === 390) {
          for (let index = 0; index < 6; index++) {
            await page.locator("[role='tab']").nth(index).click();
            const panel = page.locator("[role='tabpanel']:visible");
            assert.equal(await panel.count(), 1);
            assert.equal(await page.locator("[role='tab'][aria-selected='true']").count(), 1);
            assert.equal(await panel.getAttribute("id"), `service-panel-${index}`);
            await images(page, panel);
            await layout(page, `${label}: capability ${index}`);
            if (lang === "zh") await panel.screenshot({ path: artifactPath(`${label}-service-${index}.png`) });
          }
          assert.equal(await page.locator(".training-curriculum tr").count(), 15);
          await page.locator(".training-photo-wall .image-crop").last().click();
          assert.equal(await page.locator("dialog[open]").count(), 1);
          await page.keyboard.press("Escape");
          await page.locator("dialog").waitFor({ state: "detached" });
          assert.equal(await page.locator("dialog").count(), 0);
          await page.locator("[role='tab']").last().focus();
          await page.keyboard.press("Home");
          assert.equal(await page.locator("[role='tab']").first().getAttribute("aria-selected"), "true");
          await page.keyboard.press(lang === "ar" ? "ArrowLeft" : "ArrowRight");
          assert.equal(await page.locator("[role='tab']").nth(1).getAttribute("aria-selected"), "true");
          await page.locator(".map-locations button").last().click();
          assert.ok((await page.locator(".map-node.active").getAttribute("data-location")) === "lagos");
          for (const selector of [".hero", ".vehicle-segments", ".modification-grid", ".after-hero", ".workshop-diagram", ".partner-grid"]) await images(page, page.locator(selector));
          if (lang === "zh") {
            for (const selector of [".export-process", ".procurement-diagram", ".workshop-diagram", ".network", ".contact-direct"]) {
              await page.locator(selector).screenshot({ path: artifactPath(`${label}-${selector.slice(1)}.png`) });
            }
          }
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({ path: artifactPath(`${label}-home.png`) });
        assert.deepEqual(errors, [], "Runtime errors");
        results.push(label);
        console.log(`PASS ${label}`);
      } catch (error) {
        failures.push({ label, message: error.message, stack: error.stack });
        console.error(`FAIL ${label}: ${error.message}`);
        await page.screenshot({ path: artifactPath(`${label}-failure.png`) });
      } finally { await page.close(); }
    }
  }
} finally {
  await browser.close();
  await writeFile(new URL("report.json", output), JSON.stringify({ baseURL, passed: results, failures }, null, 2));
}
assert.equal(failures.length, 0, `${failures.length} checks failed. See .qa/report.json`);
console.log(`All ${results.length} locale/viewport checks passed.`);
