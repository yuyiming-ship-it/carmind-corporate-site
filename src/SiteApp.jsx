import OnlineModel from "./OnlineModel.jsx";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Blocks,
  Boxes,
  Building2,
  Cable,
  CarFront,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  CloudCog,
  Container,
  CreditCard,
  FileCheck2,
  Globe2,
  GraduationCap,
  Landmark,
  Languages,
  Laptop2,
  Mail,
  MapPin,
  Menu,
  MonitorCog,
  Maximize2,
  PackageSearch,
  Phone,
  Radar,
  Route,
  Search,
  ShieldCheck,
  Ship,
  Smartphone,
  TrainFront,
  Truck,
  UsersRound,
  Warehouse,
  Wifi,
  Wrench,
  X,
  Zap
} from "lucide-react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/land-110m.json";
import { trainingDays, dayLabels } from "./trainingContent.js";

const serviceIcons = {
  sourcing: CarFront,
  storage: Warehouse,
  transport: Truck,
  preparation: ClipboardCheck,
  modification: Wrench,
  settlement: CreditCard,
  tax: FileCheck2,
  insurance: ShieldCheck,
  parts: PackageSearch,
  diagnostic: Radar,
  brandDiagnostic: MonitorCog,
  battery: BatteryCharging,
  remote: Wifi,
  training: GraduationCap,
  software: Laptop2,
  team: UsersRound,
  finance: CircleDollarSign,
  cloud: CloudCog,
  garage: Building2,
  scanner: Smartphone,
  container: Container,
  logistics: Ship,
  rail: TrainFront,
  cable: Cable,
  platform: Blocks
};

const localeUi = {
  en: {
    brandLine: "Your automotive export partner",
    footerLine: "Your automotive export partner",
    enlarge: "Enlarge image",
    closeImage: "Close image",
    skip: "Skip to content",
    language: "Language",
    menu: "Open navigation",
    close: "Close navigation",
    newVehicle: "New vehicle",
    usedVehicle: "Used vehicle",
    flowResult: "Customers served",
    diagnosticGeneral: "General diagnostic platform",
    diagnosticDedicated: "Dedicated brand diagnostics",
    workshopCaption: "Workshop layout and equipment configuration",
    teamCaption: "Leadership across supply chain, market growth and regional delivery",
    formNote: "Your inquiry will be routed to the relevant Carmind team.",
    routeLegend: "Service network",
    seaLegend: "Sea trade routes"
  },
  zh: {
    brandLine: "汽车出海协同伙伴",
    footerLine: "汽车出海协同伙伴",
    enlarge: "查看大图",
    closeImage: "关闭大图",
    skip: "跳至正文",
    language: "语言",
    menu: "打开导航",
    close: "关闭导航",
    newVehicle: "新车业务",
    usedVehicle: "二手车业务",
    flowResult: "服务客户",
    diagnosticGeneral: "通用检测平台",
    diagnosticDedicated: "品牌专用诊断",
    workshopCaption: "维修站工位与设备配置方案",
    teamCaption: "覆盖供应链、市场增长与区域交付的合伙人团队",
    formNote: "您的咨询将由 Carmind 对应业务团队跟进。",
    routeLegend: "服务网络",
    seaLegend: "海运贸易路线"
  },
  ar: {
    brandLine: "شريكك في تصدير السيارات",
    footerLine: "شريكك في تصدير السيارات",
    enlarge: "تكبير الصورة",
    closeImage: "إغلاق الصورة",
    skip: "انتقل إلى المحتوى",
    language: "اللغة",
    menu: "فتح التنقل",
    close: "إغلاق التنقل",
    newVehicle: "السيارات الجديدة",
    usedVehicle: "السيارات المستعملة",
    flowResult: "العملاء المستفيدون",
    diagnosticGeneral: "منصة التشخيص العام",
    diagnosticDedicated: "تشخيص العلامات المتخصص",
    workshopCaption: "تخطيط الورشة وتجهيز المعدات",
    teamCaption: "فريق الشركاء لسلسلة التوريد ونمو السوق والتسليم الإقليمي",
    formNote: "سيتم تحويل استفسارك إلى فريق Carmind المختص.",
    routeLegend: "شبكة الخدمة",
    seaLegend: "مسارات التجارة البحرية"
  },
  ru: {
    brandLine: "Партнер по экспорту автомобилей",
    footerLine: "Партнер по экспорту автомобилей",
    enlarge: "Увеличить изображение",
    closeImage: "Закрыть изображение",
    skip: "К содержанию",
    language: "Язык",
    menu: "Открыть навигацию",
    close: "Закрыть навигацию",
    newVehicle: "Новые автомобили",
    usedVehicle: "Автомобили с пробегом",
    flowResult: "Клиенты",
    diagnosticGeneral: "Универсальная диагностика",
    diagnosticDedicated: "Диагностика брендов",
    workshopCaption: "Планировка станции и комплект оборудования",
    teamCaption: "Партнерская команда по поставкам, развитию рынков и региональной доставке",
    formNote: "Запрос будет направлен профильной команде Carmind.",
    routeLegend: "Сервисная сеть",
    seaLegend: "Морские торговые маршруты"
  }
};

const MediaContext = createContext(null);
const afterKeys = ["parts", "software", "diagnostic", "battery", "remote", "training"];

export default function SiteApp({ data }) {
  const { translations } = data;
  const [lang, setLang] = useState("en");
  const [afterTab, setAfterTab] = useState(0);
  const [media, setMedia] = useState(null);
  const t = translations[lang];
  const ui = localeUi[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = "Carmind | " + t.heroTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t.heroBody);
  }, [lang, t]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 40px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [lang, afterTab]);

  return (
    <MediaContext.Provider value={{ open: setMedia, ui }}>
    <div className="site-shell" dir={t.dir}>
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        translations={translations}
        ui={ui}
      />
      <main id="main-content">
        <Hero t={t} />
        <Culture t={t} />
        <Stats t={t} />
        <BusinessOverview t={t} setAfterTab={setAfterTab} />
        <OnlineModel lang={lang} />
        <AutomotiveExport t={t} ui={ui} products={data.productProducts} />
        <AfterSales t={t} ui={ui} active={afterTab} setActive={setAfterTab} lang={lang} deep={data.afterDeepContent[t.code] || data.afterDeepContent.EN} />
        <GlobalNetwork
          t={t}
          offices={data.offices}
          tradeNodes={data.tradeNodes}
        />
        <About t={t} ui={ui} partners={data.partners} />
        <Contact t={t} offices={data.offices} contact={data.CONTACT} />
      </main>
      <Footer t={t} contact={data.CONTACT} ui={ui} />
      {media ? <ImageViewer media={media} close={() => setMedia(null)} ui={ui} /> : null}
    </div>
    </MediaContext.Provider>
  );
}

function SectionIntro({ title, body, inverse = false, align = "left" }) {
  return (
    <div className={"section-intro " + (inverse ? "inverse " : "") + "align-" + align}>
      <div>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
    </div>
  );
}

function Header({ t, lang, setLang, translations, ui }) {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  const menuButton = useRef(null);
  const ids = ["home", "culture", "services", "network", "about", "contact"];

  const selectLanguage = (key) => {
    setLang(key);
    setOpen(false);
  };

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--header-height", `${entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height}px`);
    });
    observer.observe(header.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dismiss = (event) => {
      if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <header className="topbar" ref={header}>
      <a className="brand" href="#home" aria-label="Carmind home" onClick={() => setOpen(false)}>
        <img src="/media/brand/carmind-logo.png" alt="Carmind" />
        <span>{ui.brandLine}</span>
      </a>

      <nav id="primary-navigation" className={"site-nav " + (open ? "is-open" : "")} aria-label={ui.menu}>
        {t.nav.map((item, index) => (
          <a key={ids[index]} href={"#" + ids[index]} onClick={() => setOpen(false)}>
            {item}
          </a>
        ))}
      </nav>

      <div className="header-tools">
        <div className="language-switcher" role="group" aria-label={ui.language}>
          {Object.keys(translations).map((key) => (
            <button
              key={key}
              className={key === lang ? "active" : ""}
              type="button"
              onClick={() => selectLanguage(key)}
              aria-pressed={key === lang}
              lang={key}
            >
              {translations[key].code}
            </button>
          ))}
        </div>
        <label className="language-select">
          <Languages size={17} aria-hidden="true" />
          <select aria-label={ui.language} value={lang} onChange={(event) => selectLanguage(event.target.value)}>
            {Object.entries(translations).map(([key, item]) => <option value={key} key={key}>{item.label}</option>)}
          </select>
        </label>
        <a className="header-cta" href="#contact">
          {t.contactCta}
          <ArrowRight size={16} />
        </a>
        <button
          type="button"
          className="menu-button"
          ref={menuButton}
          aria-label={open ? ui.close : ui.menu}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function Hero({ t }) {
  return (
    <section className="hero" id="home">
      <img
        className="hero-background"
        src="/media/products/falcon-mecha-jetour-kit-optimized.jpg"
        alt="Carmind Falcon Mecha Jetour Traveller modification kit"
      />
      <div className="hero-routes" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-content">
        <h1>{t.heroTitle}</h1>
      </div>
      <div className="hero-brief">
        <p>{t.heroBody}</p>
        <div className="hero-actions">
          <a className="button primary" href="#services">
            {t.explore}
            <ArrowDown size={17} />
          </a>
          <a className="button ghost" href="#contact">
            {t.contactCta}
          </a>
        </div>
      </div>
    </section>
  );
}

function Culture({ t }) {
  const icons = [Globe2, Route, UsersRound, ShieldCheck, Zap];
  return (
    <section className="culture section-band" id="culture">
      <div className="content-shell">
        <SectionIntro title={t.cultureTitle} />
        <div className="culture-list">
          {t.culture.map(([name, body], index) => {
            const Icon = icons[index];
            return (
            <article className="culture-statement reveal" key={name}>
              <Icon size={24} aria-hidden="true" />
              <h3>{name}</h3>
              <p>{body}</p>
            </article>
          );})}
        </div>
      </div>
    </section>
  );
}

function Stats({ t }) {
  return (
    <section className="scorecard section-band">
      <div className="content-shell">
        <SectionIntro title={t.statsTitle} />
        <div className="scorecard-grid">
          {t.stats.map(([value, label]) => (
            <article className="scorecard-item reveal" key={label}>
              <AnimatedStatValue value={value} />
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStatValue({ value }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const raw = String(value);
    const target = Number(raw.replace(/[^\d]/g, ""));
    const suffix = raw.includes("+") ? "+" : "";
    let animationFrame = 0;
    let startTime = 0;
    let started = false;
    const duration = 1300;
    const format = (number) => Math.round(number).toLocaleString("en-US") + suffix;

    const draw = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(format(target * eased));
      if (progress < 1) animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animationFrame = window.requestAnimationFrame(draw);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(format(target));
      return undefined;
    }
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <strong
      ref={ref}
      className={"scorecard-value" + (String(value).length >= 6 ? " is-long" : "")}
      aria-label={String(value)}
    >
      {displayValue}
    </strong>
  );
}

function BusinessOverview({ t, setAfterTab }) {
  const exportIcons = [
    "sourcing",
    "storage",
    "transport",
    "preparation",
    "modification",
    "settlement",
    "tax",
    "insurance"
  ];

  return (
    <section className="business-overview section-band" id="services">
      <div className="content-shell">
        <SectionIntro title={t.servicesTitle} body={t.servicesBody} />
        <div className="business-pair">
          <BusinessPanel
            title={t.exportTitle}
            items={t.exportVisuals}
            icons={exportIcons}
            tone="blue"
            target="#export-process"
          />
          <BusinessPanel
            title={t.afterTitle}
            items={t.afterSystem.platform.services.map(([name]) => name)}
            icons={afterKeys}
            tone="green"
            target="#after-capabilities"
            onSelect={setAfterTab}
          />
        </div>
      </div>
    </section>
  );
}

function BusinessPanel({ title, items, icons, tone, target, onSelect }) {
  return (
    <article className={"business-panel " + tone + " reveal"}>
      <header>
        <h3>{title}</h3>
      </header>
      <div className={"business-icon-grid count-" + items.length}>
        {items.map((item, index) => (
          <a href={target} onClick={() => onSelect?.(index)} className="business-icon-item" key={item}>
            <ServiceIcon name={icons[index]} />
            <strong>{item}</strong>
          </a>
        ))}
      </div>
    </article>
  );
}

function AutomotiveExport({ t, ui, products }) {
  const content = t.exportShowcase;
  return (
    <section className="export-section section-band soft" id="export">
      <div className="content-shell">
        <SectionIntro title={content.title} body={content.body} />

        <div className="vehicle-segments">
          <MediaStory
            label={ui.newVehicle}
            title={content.newTitle}
            body={content.newBody}
            src="/media/export/dubai-showroom.jpg"
          />
          <MediaStory
            label={ui.usedVehicle}
            title={content.usedTitle}
            body={content.usedBody}
            src="/media/export/used-car-export-port-clean.png"
          />
        </div>

        <ExportProcess data={content} ui={ui} />
        <UsedCarProcurementDiagram data={content.usedDiagram} />
        <ModificationShowcase t={t} products={products} />
      </div>
    </section>
  );
}

function MediaStory({ label, title, body, src }) {
  return (
    <article className="media-story reveal">
      <figure>
        <img src={src} alt={title} loading="lazy" />
        <figcaption>{label}</figcaption>
      </figure>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function UsedCarProcurementDiagram({ data }) {
  return (
    <section className="procurement-diagram reveal" aria-labelledby="procurement-title">
      <header className="diagram-heading">
        <div>
          <h3 id="procurement-title">{data.title}</h3>
        </div>
        <p>{data.customerNeeds}</p>
      </header>

      <div className="procurement-flow">
        <div className="procurement-request">
          <UsersRound size={30} />
          <strong>{data.customerTitle}</strong>
          {data.leftSteps.map((step) => (
            <span key={step}>
              <Check size={16} />
              {step}
            </span>
          ))}
        </div>

        <div className="flow-arrow" aria-hidden="true">
          <ArrowRight size={28} />
        </div>

        <div className="procurement-core">
          <CarFront size={42} />
          <strong>{data.centerTitle}</strong>
          <span>{data.centerSub}</span>
          <div className="core-benefits">
            {data.benefits.map((benefit) => (
              <small key={benefit}>{benefit}</small>
            ))}
          </div>
        </div>

        <div className="flow-arrow" aria-hidden="true">
          <ArrowRight size={28} />
        </div>

        <div className="procurement-promise">
          <ShieldCheck size={30} />
          <strong>{data.promiseTitle}</strong>
          {data.promises.map((promise) => (
            <span key={promise}>
              <Check size={16} />
              {promise}
            </span>
          ))}
          <b>{data.fee}</b>
        </div>
      </div>

      <div className="source-head">
        <Search size={24} />
        <div>
          <strong>{data.sourceTitle}</strong>
          <span>{data.sourceSub}</span>
        </div>
      </div>

      <div className="source-grid">
        {data.sourceGroups.map((group, index) => (
          <article className="source-group" key={group.title}>
            <ServiceIcon name={["garage", "platform", "sourcing"][index]} />
            <h4>{group.title}</h4>
            <p>{group.subtitle}</p>
            <div className="source-tags">
              {group.logos.filter((logo) => logo !== "...").map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
            <ul>
              {group.points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={15} />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <footer>{data.supplier}</footer>
    </section>
  );
}

function ExportProcess({ data, ui }) {
  const icons = [
    "sourcing",
    "storage",
    "logistics",
    "tax",
    "preparation",
    "modification",
    "settlement",
    "insurance"
  ];

  return (
    <section className="export-process reveal" id="export-process" aria-labelledby="export-process-title">
      <header>
        <div>
          <h3 id="export-process-title">{data.flowTitle}</h3>
          <p>{data.flowSide}</p>
        </div>
      </header>

      <div className="export-process-layout">
        <div className="export-service-stack">
          <div className="export-mode-row">
            {data.exportModes.slice(0, 5).map((mode) => (
              <span key={mode}>{mode}</span>
            ))}
          </div>
          <div className="export-service-grid">{data.serviceFlow.map(([name, detail], index) => (
            <article key={name}>
              <div className="export-service-label">
                <ServiceIcon name={icons[index]} size={20} />
                <strong>{name}</strong>
              </div>
              <p>{detail}</p>
            </article>
          ))}</div>
        </div>

        <div className="process-bridge" aria-hidden="true">
          <i />
          <ArrowRight size={30} />
        </div>

        <aside className="export-outcomes">
          <span>{ui.flowResult}</span>
          {data.outputs.map((output, index) => (
            <div key={output}>
              {index === 0 ? <Building2 size={24} /> : <Globe2 size={24} />}
              <strong>{output}</strong>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

function ModificationShowcase({ t, products }) {
  return (
    <section className="modification-showcase reveal">
      <header>
        <div>
          <h3>{t.productGalleryTitle}</h3>
          {t.productGalleryBody ? <p>{t.productGalleryBody}</p> : null}
        </div>
        <Wrench size={30} />
      </header>
      <div className="modification-grid">
        {products.map((product) => (
          <figure key={product.key}>
            <img src={product.image} alt={t.products[product.key][0]} loading="lazy" />
            <figcaption>
              <strong>{t.products[product.key][0]}</strong>
              <span>{t.products[product.key][1]}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function AfterSales({ t, ui, deep, active, setActive, lang }) {
  const system = t.afterSystem;
  const highlightIcons = [PackageSearch, Radar, GraduationCap];
  const tabs = useRef([]);
  const onTabKey = (event, index) => {
    const delta = t.dir === "rtl" ? -1 : 1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? 5 :
      event.key === "ArrowRight" ? (index + delta + 6) % 6 :
      event.key === "ArrowLeft" ? (index - delta + 6) % 6 : null;
    if (next !== null) { event.preventDefault(); setActive(next); tabs.current[next]?.focus(); }
  };
  return (
    <section className="after-sales section-band" id="after-sales">
      <div className="content-shell">
        <div className="after-hero reveal">
          <div>
            <SectionIntro title={system.title} body={system.body} />
            <div className="after-highlight-list">
              {system.highlights.map((item, index) => {
                const Icon = highlightIcons[index] || CheckCircle2;
                return (
                  <span key={item}>
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    <strong>{item}</strong>
                  </span>
                );
              })}
            </div>
          </div>
          <figure className="after-capability-visual">
            <img
              src="/media/after-sales/overseas-nev-workshop-capability.jpg"
              alt={system.title}
              loading="lazy"
            />
          </figure>
        </div>

        <div className="after-capabilities" id="after-capabilities">
          <div className="service-tabs" role="tablist" aria-label={system.platform.title}>
            {system.platform.services.map(([name], index) => <button key={afterKeys[index]} ref={(element) => { tabs.current[index] = element; }}
              type="button" role="tab" id={`service-tab-${index}`} aria-controls={`service-panel-${index}`}
              aria-selected={active === index} tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)} onKeyDown={(event) => onTabKey(event, index)}>
              <ServiceIcon name={afterKeys[index]} /><span>{name}</span>
            </button>)}
          </div>
          {[
            <PartsSupplyShowcase parts={system.partsSupply} />,
            <DmsSoftwareShowcase dms={deep.dms} />,
            <DiagnosticEquipmentShowcase diagnostics={deep.diagnostics} ui={ui} />,
            <BatteryEquipmentShowcase kit={system.batteryKit} />,
            <RemoteProgrammingShowcase remote={deep.remote} />,
            <TrainingSystemShowcase training={deep.training} lang={lang} />
          ].map((panel, index) => <div key={afterKeys[index]} className="service-panel" role="tabpanel" id={`service-panel-${index}`} aria-labelledby={`service-tab-${index}`} hidden={active !== index} tabIndex={0}>{panel}</div>)}
        </div>
        <div className="service-outcome">
          <Globe2 size={30} aria-hidden="true" />
          <div><strong>{system.platform.targetTitle}</strong><span>{system.platform.targetMeta}</span></div>
          <div className="service-outcome-pains">{system.platform.pains.map((pain) => <span key={pain}><Check size={16} />{pain}</span>)}</div>
        </div>
        <WorkshopSolutionShowcase workshop={deep.workshop} ui={ui} />
      </div>
    </section>
  );
}

function AfterServicePlatform({ platform }) {
  const icons = ["parts", "software", "diagnostic", "battery", "remote", "training"];
  return (
    <section className="after-platform capability-block reveal" aria-labelledby="after-platform-title">
      <header className="capability-heading">
        <h3 id="after-platform-title">{platform.title}</h3>
      </header>
      <div className="after-platform-layout">
        <aside className="platform-rail">
          <strong>6</strong>
          <span>{platform.sideTitle}</span>
        </aside>
        <div className="platform-rows">
          {platform.services.map(([name, detail, engine, flow, pain], index) => (
            <article key={name}>
              <div className="platform-service-cell">
                <div className="platform-service-label">
                  <ServiceIcon name={icons[index]} />
                  <strong>{name}</strong>
                </div>
                <p>{detail}</p>
              </div>
              <div className="platform-path">
                <span>
                  <Blocks size={17} aria-hidden="true" />
                  {engine}
                </span>
                <ChevronRight size={18} aria-hidden="true" />
                <span>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {flow}
                </span>
              </div>
              <b>
                <ShieldCheck size={16} aria-hidden="true" />
                {pain}
              </b>
            </article>
          ))}
        </div>
        <aside className="platform-outcome">
          <span>{platform.painTitle}</span>
          <div>
            {platform.pains.map((pain) => (
              <strong key={pain}>{pain}</strong>
            ))}
          </div>
          <Globe2 size={34} />
          <b>{platform.targetTitle}</b>
          <small>{platform.targetMeta}</small>
        </aside>
      </div>
    </section>
  );
}

function PartsSupplyShowcase({ parts }) {
  const capabilityIcons = [Boxes, Search, Ship];
  const metricIcons = [CarFront, Search, Radar, Warehouse];
  return (
    <section className="parts-showcase capability-block reveal" aria-labelledby="parts-title">
      <header className="capability-heading">
        <div>
          <small>{parts.eyebrow}</small>
          <h3 id="parts-title">{parts.title}</h3>
          <p>{parts.intro}</p>
        </div>
      </header>
      <div className="parts-layout">
        <div className="parts-lookup">
          <PackageSearch size={52} strokeWidth={1.25} aria-hidden="true" />
          <div className="parts-identifiers">{parts.tabs.slice(1).map((item) => <span key={item}>{item}</span>)}</div>
          <ArrowDown size={24} aria-hidden="true" />
          <h4>{parts.catalog}</h4>
          <p className="parts-brands">{parts.brands.join(" · ")}</p>
          <a className="text-link" href="https://www.carmindglobal.com" target="_blank" rel="noreferrer">carmindglobal.com <ArrowUpRight size={17} /></a>
        </div>
        <div className="parts-capabilities">
          <div className="parts-metrics">
            {parts.metrics.map((metric, index) => {
              const Icon = metricIcons[index] || CheckCircle2;
              return (
                <strong key={metric}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{metric}</span>
                </strong>
              );
            })}
          </div>
          <div className="parts-capability-grid">
            {parts.capabilities.map(([title, body], index) => {
              const Icon = capabilityIcons[index] || PackageSearch;
              return (
                <article key={title}>
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DmsSoftwareShowcase({ dms }) {
  const icons = ["team", "software", "training", "finance"];
  const processIcons = [CarFront, ClipboardCheck, Smartphone, Boxes, Wrench, MonitorCog, CreditCard, Blocks];
  return (
    <section className="dms-showcase capability-block reveal" aria-labelledby="dms-title">
      <header className="capability-heading">
        <div>
          <small>{dms.eyebrow}</small>
          <h3 id="dms-title">{dms.title}</h3>
          <p>{dms.intro}</p>
        </div>
      </header>
      <div className="dms-pillar-grid">
        {dms.pillars.map(([title, body], index) => (
          <article key={title}>
            <ServiceIcon name={icons[index]} />
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </div>
      <div className="dms-process">
        {dms.flow.map((step, index) => {
          const Icon = processIcons[index];
          return (
          <div key={step}>
            <Icon size={25} aria-hidden="true" />
            <strong>{step}</strong>
            {index < dms.flow.length - 1 ? <ChevronRight size={19} /> : null}
          </div>
        );})}
      </div>
    </section>
  );
}

function DiagnosticEquipmentShowcase({ diagnostics, ui }) {
  const generalIcons = [Radar, Wifi, ShieldCheck];
  const productIcons = [Smartphone, Cable, MonitorCog, Radar];
  return (
    <section className="diagnostics-showcase capability-block reveal" aria-labelledby="diagnostics-title">
      <header className="capability-heading">
        <div>
          <small>{diagnostics.eyebrow}</small>
          <h3 id="diagnostics-title">{diagnostics.title}</h3>
          <p>{diagnostics.intro}</p>
        </div>
      </header>
      <div className="diagnostics-layout">
        <article className="general-diagnostics">
          <CropImage className="diagnostic-photo" src="/media/pdf-assets/nev-diagnostics.jpg" alt={diagnostics.generalTitle + " E2S"} size={[2048, 1152]} box={[90, 480, 1110, 620]} />
          <div>
            <span>{ui.diagnosticGeneral}</span>
            <h4>{diagnostics.generalTitle}</h4>
            <ul>
              {diagnostics.generalPoints.map((point, index) => {
                const Icon = generalIcons[index] || CheckCircle2;
                return (
                  <li key={point}>
                    <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </article>
        <article className="dedicated-diagnostics">
          <span>{ui.diagnosticDedicated}</span>
          <h4>{diagnostics.dedicatedTitle}</h4>
          <p>{diagnostics.dedicatedIntro}</p>
          <div>
            {diagnostics.products.map((product, index) => {
              const Icon = productIcons[index % productIcons.length];
              return (
                <strong key={product}>
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                  {product}
                </strong>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

function BatteryEquipmentShowcase({ kit }) {
  const images = [
    "/media/equipment/battery-air-tightness-tester.jpg",
    "/media/equipment/battery-pack-balancer.jpg",
    "/media/equipment/battery-pack-charger-discharger.jpg",
    "/media/equipment/single-cell-battery-maintainer.jpg"
  ];
  return (
    <section className="battery-showcase capability-block reveal" aria-labelledby="battery-title">
      <header className="capability-heading">
        <div>
          <small>{kit.eyebrow}</small>
          <h3 id="battery-title">{kit.title}</h3>
          <p>{kit.intro}</p>
        </div>
      </header>
      <div className="battery-device-grid">
        {kit.items.map(([name, functionText, valueText], index) => (
          <article key={name}>
            <figure>
              <img src={images[index]} alt={name} loading="lazy" />
            </figure>
            <h4>{name}</h4>
            <dl>
              <div>
                <dt>{kit.labels[0]}</dt>
                <dd>{functionText}</dd>
              </div>
              <div>
                <dt>{kit.labels[1]}</dt>
                <dd>{valueText}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function RemoteProgrammingShowcase({ remote }) {
  const icons = ["sourcing", "scanner", "cloud", "team", "diagnostic"];
  return (
    <section className="remote-showcase capability-block reveal" aria-labelledby="remote-title">
      <header className="capability-heading">
        <div>
          <small>{remote.eyebrow}</small>
          <h3 id="remote-title">{remote.title}</h3>
          <p>{remote.intro}</p>
        </div>
      </header>
      <div className="remote-flow">
        {remote.nodes.map((node, index) => (
          <div key={node}>
            <ServiceIcon name={icons[index]} />
            <strong>{node}</strong>
            {index < remote.nodes.length - 1 ? <ArrowRight size={22} /> : null}
          </div>
        ))}
      </div>
      <div className="remote-copy">
        <article>
          <Radar size={24} />
          <h4>{remote.diagnosisTitle}</h4>
          <p>{remote.diagnosisBody}</p>
        </article>
        <article>
          <CloudCog size={24} />
          <h4>{remote.programTitle}</h4>
          <p>{remote.programBody}</p>
        </article>
      </div>
    </section>
  );
}

function TrainingSystemShowcase({ training, lang }) {
  const photos = [
    "/media/training/training-practice-vehicle.jpg",
    "/media/training/training-practice-motor.jpg",
    "/media/training/training-practice-battery.jpg",
    "/media/training/training-practice-equalizer.jpg",
    "/media/training/training-practice-operation.jpg",
    "/media/training/training-practice-summary.original.jpg"
  ];
  const crops = [
    { size: [285,160], box: [7,0,240,160] },
    { size: [285,160], box: [0,5,224,149.333] },
    { size: [290,160], box: [34,0,213,142] },
    { size: [285,160], box: [10,0,222,148] },
    { size: [285,160], box: [0,9,192,128] },
    { size: [290,160], box: [0,3,198,132] }
  ];
  return (
    <section className="training-showcase capability-block reveal" aria-labelledby="training-title">
      <header className="capability-heading">
        <div>
          <small>{training.eyebrow}</small>
          <h3 id="training-title">{training.title}</h3>
          <p>{training.intro}</p>
        </div>
      </header>
      <div className="training-layout">
        <figure className="training-platform-image">
          <img src="/media/training/training-platform.jpg" alt={training.onlineTitle} loading="lazy" />
          <figcaption>
            <Laptop2 size={22} />
            <strong>{training.onlineTitle}</strong>
            <span>{training.online.join(" · ")}</span>
          </figcaption>
        </figure>
        <div className="training-curriculum">
          <header>
            <GraduationCap size={24} />
            <strong>{training.offlineTitle}</strong>
          </header>
          <div className="curriculum-scroll" tabIndex={0} role="region" aria-label={training.offlineTitle}>
            <table><tbody>{trainingDays[lang].map((content, index) => <tr key={index}>
              <th scope="row">{dayLabels[lang](index + 1)}</th><td>{content}</td>
            </tr>)}</tbody></table>
          </div>
        </div>
      </div>
      <div className="training-photo-wall">
        {photos.map((src, index) => (
          <figure key={src}>
            <CropImage src={src} alt={training.offlineTitle} {...crops[index]} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function WorkshopSolutionShowcase({ workshop, ui }) {
  return (
    <section className="workshop-showcase capability-block reveal" aria-labelledby="workshop-title">
      <header className="capability-heading">
        <div>
          <small>{workshop.eyebrow}</small>
          <h3 id="workshop-title">{workshop.title}</h3>
          <p>{workshop.intro}</p>
        </div>
      </header>
      <figure className="workshop-concept">
        <div className="workshop-visual">
          <img src="/media/after-sales/workshop-concept-v3.png" alt={ui.workshopCaption} loading="lazy" />
          <span className="workshop-marker marker-storage">{workshop.zones[5]}</span>
          <span className="workshop-marker marker-battery">{workshop.zones[2]}</span>
          <span className="workshop-marker marker-lift">{workshop.zones[1]}</span>
          <span className="workshop-marker marker-motor">{workshop.zones[4]}</span>
          <span className="workshop-marker marker-reception">{workshop.zones[0]}</span>
        </div>
        <figcaption>{({"Workshop layout and equipment configuration":"Illustrative concept; final layout and equipment are subject to the actual solution.","维修站工位与设备配置方案":"效果示意图，具体布局与设备以实际方案为准。","تخطيط الورشة وتجهيز المعدات":"تصور توضيحي؛ يعتمد التخطيط والمعدات على الحل الفعلي.","Планировка станции и комплект оборудования":"Иллюстрация; окончательная планировка и оборудование определяются проектом."})[ui.workshopCaption] || "Illustrative concept"}</figcaption>
      </figure>
      <div className="workshop-equipment-list" aria-label={ui.workshopCaption}>
        {workshop.equipment.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}
      </div>
    </section>
  );
}

function GlobalNetwork({ t, offices, tradeNodes }) {
  const [selected, setSelected] = useState("shanghai");
  const [animating, setAnimating] = useState(false);
  const frameRef = useRef(null);
  useEffect(() => {
    let visible = false;
    const updateMotion = () => setAnimating(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    }, { threshold: 0.1 });
    observer.observe(frameRef.current);
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);
  const width = 1120;
  const height = 500;
  const land = useMemo(() => feature(worldData, worldData.objects.land), []);
  const projection = useMemo(
    () => geoNaturalEarth1().fitExtent([[12, 16], [width - 12, height - 18]], land),
    [land]
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const locations = [...offices, ...tradeNodes].map((location) => ({
    ...location,
    point: projection([location.lon, location.lat])
  }));
  const byKey = Object.fromEntries(locations.map((location) => [location.key, location]));
  const routePaths = locations.filter((location) => location.key !== "shanghai").map((location) => {
    const from = location.key === "ethiopia" ? byKey.djibouti : byKey.shanghai;
    return { key: location.key, d: path({ type: "LineString", coordinates: [[from.lon, from.lat], [location.lon, location.lat]] }) };
  });

  return (
    <section className="network section-band" id="network">
      <div className="content-shell">
        <SectionIntro title={t.mapTitle} />
        <div className="map-frame reveal" ref={frameRef} data-motion={animating ? "running" : "paused"}>
          <svg viewBox={"0 0 " + width + " " + height} role="img" aria-label={t.mapTitle}>
            <path className="land" d={path(land)} />
            {routePaths.map((route, index) => (
              <g key={route.key} className={"map-connection " + (route.key === selected ? "active" : "")}
                style={{ "--flow-duration": `${8 + (index % 5) * 1.2}s`, "--flow-delay": `${-index * 1.7}s` }}>
                <path className={"map-route " + (route.key === selected ? "active" : "")} d={route.d} />
                <path className="map-flow map-flow-trail" d={route.d} pathLength="100" aria-hidden="true" />
                <path className="map-flow map-flow-light" d={route.d} pathLength="100" aria-hidden="true" />
              </g>
            ))}
            {locations.map((location, index) => (
              <g
                className={"map-node " + (location.key === selected ? "active" : "")}
                key={location.key}
                transform={"translate(" + location.point[0] + "," + location.point[1] + ")"}
                style={{ "--pulse-delay": `${-index * 0.4}s` }}
                data-location={location.key}
                onClick={() => setSelected(location.key)}
              >
                <circle className="pulse" r="10" />
                <circle r="4.5" />
                <title>{t.officeNames[location.key]}</title>
              </g>
            ))}
          </svg>
        </div>
        <div className="map-locations" role="group" aria-label={t.mapTitle}>
          {locations.map((location) => <button type="button" key={location.key} aria-pressed={selected === location.key} onClick={() => setSelected(location.key)}><MapPin size={14} />{t.officeNames[location.key]}</button>)}
        </div>
      </div>
    </section>
  );
}

function About({ t, ui, partners }) {
  return (
    <section className="about section-band soft" id="about">
      <div className="content-shell">
        <SectionIntro title={t.aboutTitle} body={t.aboutBody} />
        <section className="partner-section">
          <header>
            <h3>{t.partnersTitle}</h3>
            <p>{ui.teamCaption}</p>
          </header>
          <div className="partner-grid">
            {partners.map((partner) => (
              <article className="partner-card reveal" key={partner.key}>
                <figure>
                  <img src={partner.image} alt={t.partners[partner.key][0]} loading="lazy" />
                </figure>
                <div>
                  <strong>{t.partners[partner.key][0]}</strong>
                  <span>{t.partners[partner.key][1]}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
        <details className="organization-details">
          <summary><Building2 size={23} /><span>{t.orgTitle}</span><ChevronDown size={20} /></summary>
          <OrgChart t={t} />
        </details>
      </div>
    </section>
  );
}

function OrgChart({ t }) {
  const org = t.org;
  return (
    <section className="org-chart reveal" aria-labelledby="org-title">
      <h3 id="org-title" className="sr-only">{t.orgTitle}</h3>
      <div className="org-leadership">
        <div>
          <span>{org.company}</span>
          <strong>{org.ceoRole}: {org.ceo}</strong>
        </div>
        <i />
        <div>
          <span>{org.presidentRole}</span>
          <strong>{org.president}</strong>
        </div>
      </div>
      <div className="org-centers">
        {org.centers.map((center, index) => (
          <article className={"org-center tone-" + index} key={center.title}>
            <header>{center.title}</header>
            {center.groups.length > 0 && (
              <div>
                {center.groups.map(([group, units]) => (
                  <section key={group}>
                    <strong>{group}</strong>
                    <ul>
                      {units.map((unit) => (
                        <li key={unit}>{unit}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact({ t, offices, contact }) {
  return (
    <section className="contact section-band" id="contact">
      <div className="content-shell">
        <SectionIntro title={t.contactTitle} />
        <aside className="contact-direct reveal" aria-label={t.contactTitle}>
          <ContactItem icon={Mail} label={t.email} value={contact.email} href={"mailto:" + contact.email} />
          <ContactItem icon={Phone} label={t.phone} value={contact.phone} href={"tel:+" + contact.whatsapp} />
          <ContactItem icon={Globe2} label={t.website} value={contact.website} href={"https://" + contact.website} />
        </aside>

        <details className="office-section">
          <summary>
            <MapPin size={24} />
            <h3>{t.officesTitle}</h3>
            <ChevronDown size={20} />
          </summary>
          <div className="office-grid">
            {offices.map((office) => (
              <article key={office.key}>
                <h4>{t.officeNames[office.key]}</h4>
                <p>{t.officeAddresses?.[office.key] ?? office.address}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  return (
    <a href={href} className="contact-item">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </a>
  );
}

function Footer({ t, contact, ui }) {
  return (
    <footer className="footer">
      <div>
        <img src="/media/brand/carmind-logo.png" alt="Carmind" />
        <span>{ui.footerLine}</span>
      </div>
      <p>{t.powered}</p>
      <a href={"https://" + contact.website}>{contact.website}</a>
    </footer>
  );
}

function ServiceIcon({ name, size = 24 }) {
  const Icon = serviceIcons[name] || Zap;
  return <Icon className="service-icon" size={size} strokeWidth={1.9} aria-hidden="true" />;
}

function CropImage({ src, alt, size, box, className = "", zoomable = true }) {
  const media = useContext(MediaContext);
  const [x, y, width, height] = box;
  const Component = zoomable ? "button" : "div";
  return <Component className={`image-crop ${className}`} style={{ aspectRatio: `${width} / ${height}` }}
    {...(zoomable ? { type: "button", title: media.ui.enlarge, "aria-label": `${media.ui.enlarge}: ${alt}`, onClick: () => media.open({ src, alt, size, box }) } : {})}>
    <img src={src} alt={alt} loading="lazy" style={{ width: `${size[0] / width * 100}%`, height: `${size[1] / height * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
    {zoomable ? <span className="image-zoom" aria-hidden="true"><Maximize2 size={16} /></span> : null}
  </Component>;
}

function ImageViewer({ media, close, ui }) {
  const dialog = useRef(null);
  useEffect(() => {
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={dialog} className="image-viewer" aria-label={media.alt} onClose={close}
    onClick={(event) => { if (event.target === dialog.current) close(); }}>
    <button type="button" className="viewer-close" onClick={close} aria-label={ui.closeImage} title={ui.closeImage}><X size={24} /></button>
    <CropImage {...media} zoomable={false} />
  </dialog>;
}
