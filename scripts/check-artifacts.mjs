import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { preview } from "vite";
import { chromium } from "playwright";

const server = process.env.SITE_URL ? null : await preview({ configFile: false, preview: { host: "127.0.0.1", port: 0, open: false } });
const baseURL = process.env.SITE_URL || server.resolvedUrls.local[0];
const browser = await chromium.launch();
const report = { baseURL, production: [], offline: [], errors: [] };
const labels = { en: "EN", zh: "中文", ar: "العربية", ru: "Русский" };
const feeTerms = { en: "order", zh: "单", ar: "طلب", ru: "заказ" };

async function checkOrgChart(page) {
  assert.equal(await page.locator(".org-center > header").count(), 4);
  assert.equal(await page.locator(".org-centers > article:nth-child(n+3) > :not(header)").count(), 0);
  assert.equal(await page.locator(".org-centers > article:nth-child(1) section").count(), 4);
  assert.equal(await page.locator(".org-centers > article:nth-child(2) section").count(), 2);
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  await page.goto(baseURL);
  for (const [lang, label] of Object.entries(labels)) {
    await page.locator(".language-switcher").getByRole("button", { name: label, exact: true }).click();
    assert.equal(await page.locator("html").getAttribute("lang"), lang);
    await checkOrgChart(page);
    assert.ok((await page.locator(".procurement-promise > b").innerText()).includes(feeTerms[lang]));
    assert.ok((await page.locator(".scorecard-value").nth(1).innerText()).includes("15,000+"));
    assert.ok((await page.locator(".scorecard-item").nth(1).innerText()).includes("2025"));
    assert.equal(await page.locator(".brand img").getAttribute("src"), await page.locator(".footer img").getAttribute("src"));
    const text = await page.locator("body").innerText();
    assert.ok(!/SCROLL TO EXPLORE|CAM 01|真实经纬度|素材预留|Office and service nodes are plotted/.test(text));
    if (lang === "zh") {
      for (const term of ["汽车出海协同伙伴", "中国汽车供应链", "厂家直营新车", "零公里二手车", "中国小微汽车出口企业", "海外汽车贸易商", "零差价服务", "于懿铭", "财务总监"]) assert.ok(text.includes(term), term);
      assert.equal(await page.locator(".modification-showcase h3").innerText(), "改装产品");
      assert.equal(await page.locator(".modification-showcase > header p").count(), 0);
    }
    if (lang === "en") assert.equal(await page.locator("#procurement-title").innerText(), "Your Transparent Gateway to China’s Used Cars.");
    for (let index = 0; index < 6; index++) {
      await page.locator("[role=tab]").nth(index).click();
      assert.ok(await page.locator(`#service-panel-${index}`).isVisible());
      await page.locator(`#service-panel-${index} img`).evaluateAll(async (images) => {
        await Promise.all(images.map((image) => { image.loading = "eager"; return image.decode(); }));
      });
    }
    assert.equal(await page.locator(".battery-device-grid article").count(), 4);
    assert.equal(await page.locator(".training-photo-wall .image-crop").count(), 6);
    assert.equal(await page.locator(".workshop-diagram .image-crop").count(), 2);
    report.production.push(lang);
  }
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => { image.loading = "eager"; return image.decode(); }));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".language-select select").selectOption("zh");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.locator(".menu-button").click();
  assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "true");
  await page.locator(".site-nav a[href='#network']").click();
  assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
  await page.waitForFunction(() => document.querySelector("#network h2").getBoundingClientRect().top >= document.querySelector(".topbar").getBoundingClientRect().bottom);
  await page.locator(".menu-button").click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator(".contact-item").nth(0).getAttribute("href"), "mailto:Ryan@carmindglobal.com");
  assert.equal(await page.locator(".contact-item").nth(1).getAttribute("href"), "tel:+8613512249255");
  assert.equal(await page.locator(".contact-item").nth(2).getAttribute("href"), "https://www.carmindglobal.com");
  await context.close();

  const offline = await browser.newContext({ offline: true, viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const filePage = await offline.newPage();
  const networkRequests = [];
  filePage.on("pageerror", (error) => report.errors.push(error.message));
  filePage.on("request", (request) => { if (/^https?:/.test(request.url())) networkRequests.push(request.url()); });
  await filePage.goto(new URL("../Carmind-官网-对外分享版.html", import.meta.url).href);
  for (const [lang, label] of Object.entries(labels)) {
    await filePage.locator(".language-switcher").getByRole("button", { name: label, exact: true }).click();
    assert.equal(await filePage.locator("html").getAttribute("lang"), lang);
    await checkOrgChart(filePage);
    for (let index = 0; index < 6; index++) {
      await filePage.locator("[role=tab]").nth(index).click();
      await filePage.locator(`[role=tabpanel]:visible img`).evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode()));
      });
    }
    const missing = await filePage.locator("img").evaluateAll((images) => images.filter((image) => !image.src.startsWith("data:")).map((image) => image.src));
    assert.deepEqual(missing, [], "Offline images must all be embedded");
    report.offline.push(lang);
  }
  const metaImage = await filePage.locator('meta[property="og:image"]').getAttribute("content");
  assert.ok(metaImage.startsWith("https://carmind-corporate-site.vercel.app/"));
  assert.deepEqual(networkRequests, [], "Offline HTML must not depend on a server or CDN");
  assert.deepEqual(report.errors, [], "Runtime errors");
  await offline.close();
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await server?.close();
  await writeFile(new URL("../.qa/artifacts-report.json", import.meta.url), JSON.stringify(report, null, 2));
}
