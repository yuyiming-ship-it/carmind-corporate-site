import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve(process.cwd(), "public/media/export");
mkdirSync(outDir, { recursive: true });

const common = {
  center: "CARMIND",
  brands: {
    dealer: ["Mercedes", "BMW", "Audi", "..."],
    platform: ["Dongchedi", "Autohome", "Guazi", "..."],
    fleet: ["DiDi", "T3", "Caocao", "..."]
  }
};

const data = {
  zh: {
    rtl: false,
    title: "海外客户 / 外商",
    request: "提出需求：车型 / 年份 / 预算 / 数量 / 其他要求",
    steps: ["需求确认", "签订服务协议"],
    benefits: ["提供最优采购方案", "全程跟进服务"],
    promiseTitle: "对外商的承诺",
    promises: ["不赚取车辆差价", "只赚取固定服务费"],
    fee: "固定服务费：200 USD / 单",
    feeNote: "无论车价多少，均只收取固定服务费",
    centerSub: "透明化采购服务平台",
    sourceTitle: "多渠道整合车源",
    sourceSub: "为客户寻找更优车源",
    cards: [
      {
        n: "1",
        title: "经销商集团车源",
        subtitle: "品牌 4S 店 / 授权经销商集团",
        logos: ["奔驰", "宝马", "奥迪", "..."],
        points: ["精品二手车", "手续齐全", "车况优质", "价格透明"]
      },
      {
        n: "2",
        title: "平台车源",
        subtitle: "主流二手车平台 / 垂直平台",
        logos: ["懂车帝", "汽车之家", "瓜子", "..."],
        points: ["车型丰富", "AI 智能比价", "实时车源", "精准匹配需求"]
      },
      {
        n: "3",
        title: "网约车 / 加盟车下线车",
        subtitle: "网约车平台 / 租赁公司 / 运营车",
        logos: ["滴滴", "T3 出行", "曹操出行", "..."],
        points: ["批量车源", "里程透明", "高性价比", "适合出口"]
      }
    ],
    supplier: "供货商（车源渠道）"
  },
  en: {
    rtl: false,
    title: "Overseas customers / dealers",
    request: "Submit needs: model / year / budget / quantity / other requirements",
    steps: ["Requirement confirmation", "Service agreement"],
    benefits: ["Optimal sourcing plan", "Full-process follow-up"],
    promiseTitle: "Promise to overseas dealers",
    promises: ["No vehicle price spread", "Fixed service fee only"],
    fee: "Fixed service fee: 200 USD / order",
    feeNote: "No matter the vehicle price, only a fixed service fee is charged",
    centerSub: "Transparent sourcing service platform",
    sourceTitle: "Multi-channel vehicle sourcing",
    sourceSub: "Find better vehicle sources for customers",
    cards: [
      {
        n: "1",
        title: "Dealer group inventory",
        subtitle: "4S stores / authorized dealer groups",
        logos: common.brands.dealer,
        points: ["Premium used cars", "Complete paperwork", "Good condition", "Transparent pricing"]
      },
      {
        n: "2",
        title: "Platform inventory",
        subtitle: "Mainstream used-car / vertical platforms",
        logos: common.brands.platform,
        points: ["Rich model range", "AI price comparison", "Real-time inventory", "Accurate matching"]
      },
      {
        n: "3",
        title: "Ride-hailing / off-lease fleets",
        subtitle: "Ride-hailing / rental / operating fleets",
        logos: common.brands.fleet,
        points: ["Bulk supply", "Transparent mileage", "High value", "Export-ready"]
      }
    ],
    supplier: "Suppliers (vehicle source channels)"
  },
  ar: {
    rtl: true,
    title: "العملاء / التجار في الخارج",
    request: "تقديم المتطلبات: الطراز / السنة / الميزانية / الكمية / متطلبات أخرى",
    steps: ["تأكيد الطلب", "توقيع اتفاقية الخدمة"],
    benefits: ["تقديم أفضل خطة شراء", "متابعة العملية بالكامل"],
    promiseTitle: "التزامنا للتجار",
    promises: ["لا نربح من فرق سعر السيارة", "رسوم خدمة ثابتة فقط"],
    fee: "رسوم خدمة ثابتة: 200 USD / طلب",
    feeNote: "بغض النظر عن سعر السيارة، يتم تحصيل رسوم خدمة ثابتة فقط",
    centerSub: "منصة شراء شفافة",
    sourceTitle: "دمج مصادر متعددة",
    sourceSub: "العثور على مصادر أفضل للعملاء",
    cards: [
      {
        n: "1",
        title: "مصادر مجموعات الوكلاء",
        subtitle: "متاجر 4S / مجموعات وكلاء معتمدة",
        logos: common.brands.dealer,
        points: ["سيارات مستعملة ممتازة", "إجراءات كاملة", "حالة جيدة", "سعر شفاف"]
      },
      {
        n: "2",
        title: "مصادر المنصات",
        subtitle: "منصات مستعملة رئيسية / متخصصة",
        logos: common.brands.platform,
        points: ["طرازات متنوعة", "مقارنة سعر ذكية", "مصادر فورية", "مطابقة دقيقة"]
      },
      {
        n: "3",
        title: "أساطيل تشغيل / تأجير",
        subtitle: "منصات نقل / شركات تأجير / مركبات تشغيل",
        logos: common.brands.fleet,
        points: ["مصادر بالجملة", "كيلومترات واضحة", "قيمة عالية", "جاهزة للتصدير"]
      }
    ],
    supplier: "الموردون (قنوات مصادر المركبات)"
  },
  ru: {
    rtl: false,
    title: "Зарубежные клиенты / дилеры",
    request: "Запрос: модель / год / бюджет / количество / другие требования",
    steps: ["Подтверждение запроса", "Сервисное соглашение"],
    benefits: ["Оптимальный план закупки", "Полное сопровождение"],
    promiseTitle: "Обязательства перед дилерами",
    promises: ["Без маржи на цене авто", "Только фиксированная плата"],
    fee: "Фиксированная плата: 200 USD / заказ",
    feeNote: "Независимо от цены авто взимается только фиксированная плата",
    centerSub: "Прозрачная платформа закупки",
    sourceTitle: "Многоканальные источники авто",
    sourceSub: "Поиск лучших источников для клиентов",
    cards: [
      {
        n: "1",
        title: "Запасы дилерских групп",
        subtitle: "4S-салоны / авторизованные группы",
        logos: common.brands.dealer,
        points: ["Премиальные б/у авто", "Полные документы", "Хорошее состояние", "Прозрачная цена"]
      },
      {
        n: "2",
        title: "Платформенные авто",
        subtitle: "Основные / вертикальные платформы",
        logos: common.brands.platform,
        points: ["Много моделей", "AI-сравнение цен", "Актуальные авто", "Точный подбор"]
      },
      {
        n: "3",
        title: "Такси / лизинговые флоты",
        subtitle: "Платформы такси / аренда / флот",
        logos: common.brands.fleet,
        points: ["Партии авто", "Прозрачный пробег", "Высокая ценность", "Готово к экспорту"]
      }
    ],
    supplier: "Поставщики (каналы авто)"
  }
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function text(lines, x, y, opts = {}) {
  const arr = Array.isArray(lines) ? lines : [lines];
  const {
    size = 24,
    weight = 800,
    color = "#06224b",
    anchor = "start",
    lh = size * 1.25,
    rtl = false,
    cls = ""
  } = opts;
  const dir = rtl ? ' direction="rtl" unicode-bidi="plaintext"' : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}" fill="${color}" font-size="${size}" font-weight="${weight}"${dir}>${arr
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(line)}</tspan>`)
    .join("")}</text>`;
}

function icon(type, x, y, size = 38, color = "#178bff") {
  const paths = {
    users: `<circle cx="12" cy="13" r="5"/><circle cx="25" cy="13" r="5"/><circle cx="18.5" cy="8" r="5"/><path d="M5 30c2-7 9-10 13.5-10S30 23 32 30"/>`,
    checklist: `<path d="M11 9h18v22H9V9h2z"/><path d="M13 18l4 4 9-10"/><path d="M15 28h10"/>`,
    pen: `<path d="M9 28l4-11L26 4l8 8-13 13-12 3z"/><path d="M23 7l8 8"/>`,
    target: `<circle cx="19" cy="19" r="13"/><circle cx="19" cy="19" r="6"/><path d="M28 10l7-7M30 8h5v5"/>`,
    truck: `<path d="M4 14h20v12H4z"/><path d="M24 18h6l4 4v4H24z"/><circle cx="11" cy="29" r="3"/><circle cx="29" cy="29" r="3"/>`,
    search: `<circle cx="17" cy="17" r="9"/><path d="M24 24l8 8"/>`,
    car: `<path d="M7 22l4-8h16l4 8"/><path d="M8 22h22v7H8z"/><circle cx="13" cy="30" r="3"/><circle cx="26" cy="30" r="3"/>`,
    check: `<path d="M7 20l7 7L31 10"/>`
  };
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 38 38" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type] || paths.check}</svg>`;
}

function pill(x, y, w, h, label, rtl = false, size = 17) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="17" fill="#f2f7ff" stroke="#d9e8ff"/>
  ${text(label, x + w / 2, y + h / 2 + 6, { size, weight: 900, anchor: "middle", rtl })}`;
}

function check(x, y, label, rtl = false) {
  const tx = rtl ? x + 174 : x + 26;
  const anchor = rtl ? "end" : "start";
  return `${icon("check", x, y - 19, 18, "#07953e")}${text(label, tx, y, {
    size: 17,
    weight: 850,
    anchor,
    rtl
  })}`;
}

function card(d, x, y, w, h, tone, rtl) {
  const titleAnchor = rtl ? "end" : "start";
  const titleX = rtl ? x + w - 28 : x + 76;
  const pillW = (w - 78) / 4;
  return `<g class="shadow">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#ffffff" stroke="${tone}" stroke-width="2"/>
    <circle cx="${x + 40}" cy="${y + 40}" r="22" fill="#1f8fff"/>
    ${text(d.n, x + 40, y + 48, { size: 20, color: "#fff", weight: 950, anchor: "middle" })}
    ${text(d.title, titleX, y + 42, { size: 23, weight: 950, anchor: titleAnchor, rtl })}
    ${text(d.subtitle, titleX, y + 74, { size: 15, weight: 850, color: "#547096", anchor: titleAnchor, rtl })}
    <g>${d.logos.map((label, i) => pill(x + 28 + i * (pillW + 8), y + 100, pillW, 34, label, rtl, 16)).join("")}</g>
    <g>
      ${check(x + 34, y + 158, d.points[0], rtl)}
      ${check(x + w / 2 + 18, y + 158, d.points[1], rtl)}
      ${check(x + 34, y + 186, d.points[2], rtl)}
      ${check(x + w / 2 + 18, y + 186, d.points[3], rtl)}
    </g>
  </g>`;
}

function actionRow(x, y, w, label, type, rtl = false) {
  const labelX = rtl ? x + w - 64 : x + 70;
  return `<g class="shadow">
    <rect x="${x}" y="${y}" width="${w}" height="58" rx="14" fill="#fff" stroke="#bad8ff"/>
    ${icon(type, x + 20, y + 11, 34)}
    ${text(label, labelX, y + 37, { size: 21, weight: 900, anchor: rtl ? "end" : "start", rtl })}
  </g>`;
}

function render(lang, d) {
  const rtl = d.rtl;
  const topAnchor = rtl ? "end" : "start";
  const topX = rtl ? 1104 : 508;
  const css = `
    <style>
      svg { font-family: Inter, Arial, "Noto Sans", "Noto Sans SC", "Noto Sans Arabic", sans-serif; }
      .shadow { filter: drop-shadow(0 10px 18px rgba(0, 80, 180, .18)); }
    </style>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="864" viewBox="0 0 1536 864" role="img" aria-label="${esc(d.title)}">
  ${css}
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#dcebff"/>
      <stop offset=".45" stop-color="#f9fcff"/>
      <stop offset="1" stop-color="#cfe5ff"/>
    </linearGradient>
    <radialGradient id="coreGlow" cx="42%" cy="18%" r="76%">
      <stop offset="0" stop-color="#1d76ff"/>
      <stop offset=".45" stop-color="#0b48bd"/>
      <stop offset="1" stop-color="#08328f"/>
    </radialGradient>
    <linearGradient id="green" x1="0" x2="1">
      <stop offset="0" stop-color="#079640"/>
      <stop offset="1" stop-color="#0cb34e"/>
    </linearGradient>
    <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M52 0H0v52" fill="none" stroke="#7fb6f0" stroke-opacity=".23" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1536" height="864" fill="url(#bg)"/>
  <rect width="1536" height="864" fill="url(#grid)" opacity=".8"/>
  <path d="M0 112C206 52 338 4 520 20M24 378C180 286 292 186 384 18M1048 44c130 18 246 52 364 112M1112 108c168 30 288 88 416 182" fill="none" stroke="#fff" stroke-width="6" opacity=".62"/>
  <path d="M0 246c168-100 298-154 472-170M1008 40c210 36 382 108 520 220" fill="none" stroke="#7bb8ff" stroke-width="2" opacity=".42"/>

  <g class="shadow">
    <rect x="286" y="30" width="964" height="132" rx="22" fill="#fff" stroke="#0d61df" stroke-width="3"/>
    <rect x="382" y="62" width="78" height="68" rx="20" fill="#eaf3ff"/>
    ${icon("users", 402, 78, 40, "#1f75ff")}
    ${text(d.title, topX, 82, { size: lang === "zh" ? 44 : lang === "ru" ? 34 : 36, weight: 950, anchor: topAnchor, rtl })}
    ${text(d.request, topX, 124, { size: lang === "zh" ? 27 : 21, weight: 900, anchor: topAnchor, rtl })}
  </g>

  <path d="M768 162v42" stroke="#1489ff" stroke-width="8" stroke-linecap="round"/>
  <path d="M768 206l-24-34h48z" fill="#1489ff"/>

  <g class="shadow">
    <rect x="510" y="214" width="516" height="232" rx="94" fill="url(#coreGlow)" stroke="#176be6" stroke-width="9"/>
    <path d="M626 292c68-42 216-42 284 0M648 292l-36 30h312l-38-30" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>
    ${text(common.center, 768, 346, { size: 58, weight: 950, color: "#fff", anchor: "middle" })}
    ${text(d.centerSub, 768, 400, { size: lang === "zh" ? 25 : 22, weight: 900, color: "#fff", anchor: "middle", rtl })}
  </g>

  ${actionRow(104, 274, 342, d.steps[0], "checklist", rtl)}
  ${actionRow(104, 348, 342, d.steps[1], "pen", rtl)}

  <g class="shadow">
    <rect x="1090" y="216" width="354" height="264" rx="24" fill="#fff" stroke="#4b86ff" stroke-width="3"/>
    ${actionRow(1122, 250, 288, d.benefits[0], "target", rtl)}
    ${actionRow(1122, 318, 288, d.benefits[1], "truck", rtl)}
    <path d="M1026 330h44" stroke="#1489ff" stroke-width="8" stroke-linecap="round"/>
    <path d="M1076 330l-30-22v44z" fill="#1489ff"/>
    ${text(d.promiseTitle, rtl ? 1410 : 1122, 404, { size: lang === "zh" ? 22 : 18, weight: 950, color: "#0640b8", anchor: rtl ? "end" : "start", rtl })}
    ${check(1122, 436, d.promises[0], rtl)}
    ${check(1280, 436, d.promises[1], rtl)}
    <rect x="1122" y="450" width="288" height="48" rx="14" fill="#0649c7"/>
    ${text(d.fee, 1266, 480, { size: lang === "zh" ? 20 : 16, weight: 950, color: "#fff", anchor: "middle", rtl })}
  </g>

  <path d="M768 446v64" stroke="#119a42" stroke-width="8" stroke-linecap="round"/>
  <g class="shadow">
    <rect x="492" y="502" width="552" height="76" rx="18" fill="#effff1" stroke="#48bd62" stroke-width="2"/>
    <circle cx="566" cy="540" r="29" fill="#14a840"/>
    ${icon("search", 547, 521, 38, "#fff")}
    ${text(d.sourceTitle, 794, 534, { size: lang === "zh" ? 28 : 23, weight: 950, color: "#05802f", anchor: "middle", rtl })}
    ${text(d.sourceSub, 794, 562, { size: 16, weight: 850, anchor: "middle", rtl })}
  </g>

  <path d="M768 578v28M768 606H286v22M768 606h482v22M768 606v22" stroke="#119a42" stroke-width="7" fill="none" stroke-linecap="round"/>

  ${card(d.cards[0], 80, 624, 410, 198, "#22a64e", rtl)}
  ${card(d.cards[1], 563, 624, 410, 198, "#ff8b2c", rtl)}
  ${card(d.cards[2], 1046, 624, 410, 198, "#7357e6", rtl)}
  <g class="shadow">
    <rect x="520" y="830" width="496" height="42" rx="21" fill="url(#green)"/>
    ${text(d.supplier, 768, 858, { size: lang === "zh" ? 25 : 19, weight: 950, color: "#fff", anchor: "middle", rtl })}
  </g>
</svg>`;
}

for (const [lang, content] of Object.entries(data)) {
  writeFileSync(resolve(outDir, `used-car-procurement-platform-${lang}.svg`), render(lang, content), "utf8");
}
