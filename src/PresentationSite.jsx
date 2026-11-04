import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BatteryCharging,
  Box,
  ChevronRight,
  CircleDot,
  Menu,
  PackageCheck,
  Phone,
  Route,
  ShieldCheck,
  Wrench,
  X,
  Zap
} from "lucide-react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/land-110m.json";

const chapterLabels = {
  en: ["Introduction", "Export system", "NEV after-sales", "Global network", "Team", "Contact"],
  zh: ["我们是谁", "整车出口", "新能源售后", "全球网络", "管理团队", "开始合作"],
  ar: ["مقدمة", "نظام التصدير", "خدمة الطاقة الجديدة", "الشبكة العالمية", "الفريق", "تواصل"],
  ru: ["Введение", "Экспорт", "Послепродажный сервис", "Глобальная сеть", "Команда", "Контакты"]
};

const capabilityIcons = [PackageCheck, Route, Wrench, ShieldCheck];

export default function PresentationSite({ data }) {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = data.translations[lang];
  const chapters = chapterLabels[lang];
  const isRtl = t.dir === "rtl";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = `Carmind | ${t.heroTitle}`;
  }, [lang, t]);

  const jump = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="p-site" dir={t.dir}>
      <div className="p-grain" aria-hidden="true" />
      <header className="p-header">
        <button className="p-brand" type="button" onClick={() => jump("#home")} aria-label="Carmind home">
          <img src="/media/brand/carmind-logo.png" alt="Carmind" />
          <span>{t.powered}</span>
        </button>
        <nav className={menuOpen ? "p-nav is-open" : "p-nav"} aria-label="Primary navigation">
          {chapters.map((label, index) => {
            const target = ["#home", "#export", "#after-sales", "#network", "#team", "#contact"][index];
            return <button type="button" key={target} onClick={() => jump(target)}><i>0{index + 1}</i>{label}</button>;
          })}
        </nav>
        <div className="p-tools">
          <div className="p-languages" aria-label="Language selector">
            {Object.entries(data.translations).map(([key, option]) => (
              <button key={key} type="button" className={key === lang ? "active" : ""} onClick={() => setLang(key)}>{option.code}</button>
            ))}
          </div>
          <button className="p-menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <main>
        <section className="p-hero" id="home">
          <img className="p-hero-image" src="/media/hero/carmind-hero-auto-export.png" alt="Vehicle export logistics" />
          <div className="p-hero-overlay" />
          <div className="p-corner p-corner-a" aria-hidden="true" />
          <div className="p-corner p-corner-b" aria-hidden="true" />
          <div className="p-frame-label p-hero-cam"><CircleDot size={13} /> GLOBAL DELIVERY · CAM 01</div>
          <div className="p-frame-label p-hero-section">01 · {chapters[0]}</div>
          <div className="p-hero-copy">
            <p className="p-kicker">CARMIND / UNITYAUTO</p>
            <h1>{lang === "en" ? "Global automotive delivery, made reliable." : t.heroTitle}</h1>
            <p className="p-lede">{t.heroBody}</p>
            <button className="p-primary" type="button" onClick={() => jump("#export")}>
              {t.explore}<ArrowDownRight size={18} />
            </button>
          </div>
          <div className="p-hero-proof">
            <span>{t.stats[1][0]}</span>
            <p>{t.stats[1][1]}</p>
          </div>
          <div className="p-scroll-note"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={16} /></div>
        </section>

        <section className="p-section p-intro-section" id="story">
          <div className="p-section-meta"><span>01 / 05</span><span>{chapters[0]}</span></div>
          <div className="p-intro-grid">
            <div className="p-statement">
              <p className="p-kicker">THE CARMIND METHOD</p>
              <h2>{t.servicesTitle}</h2>
            </div>
            <div className="p-intro-copy"><p>{t.servicesBody}</p><span className="p-line" /></div>
          </div>
          <div className="p-metric-grid">
            {t.stats.map(([value, label], index) => <article key={label}><i>0{index + 1}</i><strong>{value}</strong><span>{label}</span></article>)}
          </div>
        </section>

        <section className="p-section p-export-section" id="export">
          <div className="p-section-meta inverse"><span>02 / 05</span><span>{chapters[1]}</span></div>
          <div className="p-export-heading">
            <div><p className="p-kicker">VEHICLE EXPORT SYSTEM</p><h2>{t.exportTitle}</h2></div>
            <p>{t.exportShowcase.body}</p>
          </div>
          <div className="p-route-strip" aria-label="Export process">
            {t.exportVisuals.map((step, index) => <React.Fragment key={step}><div><span>0{index + 1}</span><b>{step}</b></div>{index < t.exportVisuals.length - 1 ? <ChevronRight aria-hidden="true" /> : null}</React.Fragment>)}
          </div>
          <div className="p-export-bottom">
            <div className="p-image-card">
              <img src="/media/export/used-car-export-port-clean.png" alt="Vehicles prepared for overseas export" />
              <span>{t.exportShowcase.newTitle} / {t.exportShowcase.usedTitle}</span>
            </div>
            <div className="p-export-evidence">
              <p className="p-kicker">WHAT WE CONNECT</p>
              {t.exportShowcase.serviceFlow.slice(0, 4).map(([name, body], index) => {
                const Icon = capabilityIcons[index];
                return <article key={name}><Icon size={20} /><div><b>{name}</b><p>{body}</p></div></article>;
              })}
              <a className="p-text-link" href="#contact">{t.contactCta}<ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="p-section p-after-section" id="after-sales">
          <div className="p-section-meta"><span>03 / 05</span><span>{chapters[2]}</span></div>
          <div className="p-after-grid">
            <div className="p-after-media"><img src="/media/after-sales/overseas-nev-workshop-capability.jpg" alt="New energy vehicle workshop" /><span>NEV SERVICE CAPABILITY</span></div>
            <div className="p-after-copy">
              <p className="p-kicker">BEYOND VEHICLE DELIVERY</p>
              <h2>{t.afterTitle}</h2>
              <p>{t.afterSystem.body}</p>
              <div className="p-highlight-row">{t.afterSystem.highlights.map((item) => <span key={item}><Zap size={15} />{item}</span>)}</div>
              <div className="p-service-list">
                {t.afterSystem.solutions.map((item, index) => {
                  const detail = t.afterSystem.platform.services[index];
                  return <details key={item.title} open><summary><span>0{index + 1}</span><div><b>{item.title}</b><p>{item.body}</p></div><ChevronRight size={18} /></summary><div className="p-service-expand"><p>{detail?.[1]}</p><span>{detail?.[2]}</span><small>{detail?.[3]}</small></div></details>;
                })}
              </div>
            </div>
          </div>
          <AfterSalesDetail t={t} />
        </section>

        <section className="p-section p-network-section" id="network">
          <div className="p-section-meta inverse"><span>04 / 05</span><span>{chapters[3]}</span></div>
          <div className="p-network-heading"><div><p className="p-kicker">CHINA TO THE WORLD</p><h2>{t.mapTitle}</h2></div></div>
          <GlobalNetworkMap t={t} offices={data.offices} tradeNodes={data.tradeNodes} />
        </section>

        <section className="p-section p-products-section">
          <div className="p-section-meta"><span>FIELD PROOF</span><span>Proof of capability</span></div>
          <div className="p-products-heading"><p className="p-kicker">FROM STANDARD TO DISTINCTIVE</p><h2>{t.productGalleryTitle}</h2></div>
          <div className="p-product-grid">
            {data.productProducts.map((product) => <article key={product.key}><img src={product.image} alt={t.products[product.key][0]} /><div><span>{t.products[product.key][1]}</span><h3>{t.products[product.key][0]}</h3><ArrowUpRight size={20} /></div></article>)}
          </div>
        </section>

        <TeamSection t={t} partners={data.partners} />

        <section className="p-contact" id="contact">
          <div className="p-contact-marker"><Phone size={17} /> 06 / {chapters[5]}</div>
          <p className="p-kicker">START A CONVERSATION</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactBody}</p>
          <div className="p-contact-actions">
            <a href={`mailto:${data.CONTACT.email}`}>{data.CONTACT.email}<ArrowUpRight size={18} /></a>
            <a href={`https://wa.me/${data.CONTACT.whatsapp}`}>{data.CONTACT.phone}<ArrowUpRight size={18} /></a>
          </div>
          <footer><img src="/media/brand/carmind-logo.png" alt="Carmind" /><span>{t.powered}</span><span>© {new Date().getFullYear()} CARMIND</span></footer>
        </section>
      </main>
    </div>
  );
}

function AfterSalesDetail({ t }) {
  const platform = t.afterSystem.platform;
  const parts = t.afterSystem.partsSupply;
  const battery = t.afterSystem.batteryKit;
  return (
    <div className="p-after-detail">
      <div className="p-detail-heading"><p className="p-kicker">OVERSEAS REPAIR NETWORK</p><h3>{platform.title}</h3><p>{platform.targetTitle} · {platform.targetMeta}</p></div>
      <div className="p-pain-grid">
        <div className="p-pain-intro"><span>03</span><b>{platform.painTitle}</b>{platform.pains.map((pain, index) => <p key={pain}>0{index + 1} / {pain}</p>)}</div>
        <div className="p-platform-table">
          {platform.services.map(([service, scope, system, delivery, pain], index) => <details className="p-platform-row" key={service} open><summary><span>0{index + 1}</span><div><b>{service}</b><p>{scope}</p></div><div><small>{system}</small><p>{delivery}</p></div><i>{pain}</i><ChevronRight size={15} /></summary><div className="p-platform-expand"><strong>{system}</strong><p>{delivery}</p><span>{scope}</span></div></details>)}
        </div>
      </div>
      <div className="p-detail-split">
        <div className="p-parts-card"><PartsLookupPreview parts={parts} /><div><p className="p-kicker">PARTS · DIAGNOSIS · WAREHOUSING</p><h3>{parts.title}</h3><p>{parts.intro}</p>{parts.capabilities.map(([title, body]) => <article key={title}><b>{title}</b><span>{body}</span></article>)}</div></div>
        <div className="p-battery-card"><img src="/media/pdf-assets/battery-equipment.jpg" alt={battery.title} /><div><p className="p-kicker">BATTERY SERVICE CAPABILITY</p><h3>{battery.title}</h3><p>{battery.intro}</p></div><ol>{battery.items.map(([name, functionText, value]) => <li key={name}><b>{name}</b><span>{functionText}</span><p>{value}</p></li>)}</ol></div>
      </div>
    </div>
  );
}

function PartsLookupPreview({ parts }) {
  return <div className="p-parts-site-preview" aria-label={parts.title}><header><img src="/media/brand/carmind-logo.png" alt="Carmind" /><div>{parts.nav.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div></header><main><p>{parts.eyebrow}</p><h4>{parts.title}</h4><div className="p-parts-tabs">{parts.tabs.map((tab, index) => <span className={index === 1 ? "active" : ""} key={tab}>{tab}</span>)}</div><div className="p-parts-search"><span>LVVDB21B7ND******</span><b>{parts.search}</b></div><footer><strong>{parts.catalog}</strong><div>{parts.brands.slice(0, 6).map((brand) => <span key={brand}>{brand}</span>)}</div></footer></main></div>;
}

function GlobalNetworkMap({ t, offices, tradeNodes }) {
  const width = 1120;
  const height = 500;
  const land = useMemo(() => feature(worldData, worldData.objects.land), []);
  const projection = useMemo(() => geoNaturalEarth1().fitExtent([[12, 16], [width - 12, height - 18]], land), [land]);
  const path = useMemo(() => geoPath(projection), [projection]);
  const locations = [...offices, ...tradeNodes].map((location) => ({ ...location, point: projection([location.lon, location.lat]) }));
  const byKey = Object.fromEntries(locations.map((location) => [location.key, location]));
  const hubs = ["tianjin", "shanghai", "guangzhou", "horgos"];
  const arc = (from, to, lift) => {
    const middleX = (from.point[0] + to.point[0]) / 2;
    const middleY = Math.min(from.point[1], to.point[1]) - lift;
    return `M ${from.point[0]} ${from.point[1]} Q ${middleX} ${middleY} ${to.point[0]} ${to.point[1]}`;
  };
  const routes = [
    ...locations.filter((location) => !hubs.includes(location.key) && !location.routeType).map((to) => ({ from: byKey.shanghai, to, type: "office" })),
    ...tradeNodes.map((node) => byKey[node.key]).filter(Boolean).map((to) => ({ from: byKey.guangzhou, to, type: "sea" }))
  ].flatMap((route) => {
    if (!(route.type === "sea" && route.to.lon < -50)) return [{ key: `${route.from.key}-${route.to.key}`, ...route, d: arc(route.from, route.to, route.type === "sea" ? 62 : 38) }];
    const sharedLat = (route.from.lat + route.to.lat) / 2;
    const east = { ...route.to, point: projection([178, sharedLat]) };
    const west = { ...route.to, point: projection([-178, sharedLat]) };
    return [{ key: `${route.to.key}-east`, type: route.type, d: arc(route.from, east, 58) }, { key: `${route.to.key}-west`, type: route.type, d: arc(west, route.to, 34) }];
  });
  return <div className="p-world-map"><svg className="p-world-map-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.mapTitle}><path className="p-land" d={path(land)} />{routes.map((route) => <path className={`p-map-route ${route.type}`} d={route.d} key={route.key} />)}{locations.map((location, index) => <g className={`p-map-node ${location.routeType ? "trade" : "office"}`} key={location.key} style={{ animationDelay: `${index * 110}ms` }} transform={`translate(${location.point[0]},${location.point[1]})`}><circle className="p-pulse" r="10" /><circle r="4.5" /><text x={location.label[0]} y={location.label[1]} textAnchor={location.label[2]}>{t.officeNames[location.key]}</text></g>)}</svg></div>;
}

function TeamSection({ t, partners }) {
  return <section className="p-section p-team-section" id="team"><div className="p-section-meta"><span>05 / 06</span><span>{t.aboutTitle}</span></div><div className="p-team-heading"><div><p className="p-kicker">LEADERSHIP & OPERATING MODEL</p><h2>{t.aboutTitle}</h2></div><p>{t.aboutBody}</p></div><OriginalOrgChart t={t} /><div className="p-partner-grid">{partners.map((partner) => <article key={partner.key}><img src={partner.image} alt={t.partners[partner.key][0]} /><div><b>{t.partners[partner.key][0]}</b><span>{t.partners[partner.key][1]}</span></div></article>)}</div></section>;
}

function OriginalOrgChart({ t }) {
  const org = t.org;
  return <section className="p-original-org" aria-label={t.orgTitle}><header><h3>{t.orgTitle}</h3></header><div className="p-original-org-leadership"><div><span>{org.company}</span><strong>{org.ceoRole}: {org.ceo}</strong></div><i /><div><span>{org.presidentRole}</span><strong>{org.president}</strong></div></div><div className="p-original-org-centers">{org.centers.map((center, index) => <article className={`p-original-org-center tone-${index}`} key={center.title}><header>{center.title}</header><div>{center.directUnits ? <ul className="p-original-org-direct-units">{center.groups.flatMap(([, units]) => units).map((unit) => <li key={unit}>{unit}</li>)}</ul> : center.groups.map(([group, units]) => <section key={group}><strong>{group}</strong><ul>{units.map((unit) => <li key={unit}>{unit}</li>)}</ul></section>)}</div></article>)}</div></section>;
}
