import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/land-110m.json";
import "./site.css";
import SiteApp from "./SiteApp.jsx";

const CONTACT = {
  email: "Ryan@carmindglobal.com",
  phone: "+86 135 1224 9255",
  whatsapp: "8613512249255",
  website: "www.carmindglobal.com"
};

const offices = [
  {
    key: "tianjin",
    lat: 39.3434,
    lon: 117.3616,
    label: [12, -22, "start"],
    address:
      "UnityAuto Tech Co., Ltd · Room 308, Zone C.1 Tongda Plaza, Tianjin Pilot Free Trade Zone"
  },
  {
    key: "shanghai",
    lat: 31.2304,
    lon: 121.4737,
    label: [16, 16, "start"],
    address:
      "UnityAuto Tech Co., Ltd · Room 701, Building 6, West Zone, CSCEC Enterprise World, Qingpu District, Shanghai"
  },
  {
    key: "guangzhou",
    lat: 22.8016,
    lon: 113.5252,
    label: [12, 30, "start"],
    address:
      "UnityAuto Tech Co., Ltd · Room 301, Haijia Automobile Terminal, Nansha District, Guangzhou City, Guangdong Province, China"
  },
  {
    key: "horgos",
    lat: 44.218,
    lon: 80.414,
    label: [14, -28, "start"],
    address:
      "Horgos Carmind Network Technology · Warehouse 1-2, D, Cross-border E-commerce Industrial Park, Comprehensive Free Trade Zone, Horgos, Ili"
  },
  {
    key: "dubai",
    lat: 25.2048,
    lon: 55.2708,
    label: [-16, 22, "end"],
    address:
      "CARMIND FZE, G5324 YIWU Market, Ground Floor, Dubai · CARMIND MOTOR, P.O. Box 63278, Ducamz, Dubai"
  },
  {
    key: "tashkent",
    lat: 41.2995,
    lon: 69.2401,
    label: [-22, 20, "end"],
    address:
      "CAR MIND GLOBAL · Toshkent viloyat Zangota tumani Yangixayot MFY BUT 14-uy"
  },
  {
    key: "djibouti",
    lat: 11.5721,
    lon: 43.1456,
    label: [-16, 26, "end"],
    address: "CARMIND DJIBOUTI FZE · DIFTZ (Djibouti International Free Trade Zone)"
  },
  {
    key: "jordan",
    lat: 31.9539,
    lon: 35.9106,
    label: [-18, -18, "end"],
    address: "CHINESE AUTOHOME FOR CARS AND SPARE PARTS TRADING COMPANY"
  }
];

const tradeNodes = [
  {
    key: "iquique",
    lat: -20.2307,
    lon: -70.1357,
    label: [-14, 22, "end"],
    routeType: "sea"
  },
  {
    key: "chancay",
    lat: -11.5714,
    lon: -77.2707,
    label: [-14, -16, "end"],
    routeType: "sea"
  },
  {
    key: "dominican",
    lat: 18.4861,
    lon: -69.9312,
    label: [-14, -18, "end"],
    routeType: "sea"
  },
  {
    key: "ethiopia",
    lat: 8.9806,
    lon: 38.7578,
    label: [12, 18, "start"],
    routeType: "sea"
  },
  {
    key: "algeria",
    lat: 36.7538,
    lon: 3.0588,
    label: [-12, -16, "end"],
    routeType: "sea"
  },
  {
    key: "lagos",
    lat: 6.5244,
    lon: 3.3792,
    label: [-12, 20, "end"],
    routeType: "sea"
  }
];

const partners = [
  {
    key: "ceo",
    image: "/media/partners/ceo-business-portrait-wayne-v2.jpg"
  },
  {
    key: "president",
    image: "/media/partners/president-business-portrait.jpg"
  },
  {
    key: "africa",
    image: "/media/partners/africa-director-business-portrait.jpg"
  },
  {
    key: "centralAsia",
    image: "/media/partners/central-asia-director-business-portrait.jpg"
  },
  {
    key: "supply",
    image: "/media/partners/supply-chain-director-ryan-v2.jpg"
  }
];

const productProducts = [
  {
    key: "goldenOasis",
    image: "/media/products/golden-oasis-li-auto-kit.jpg"
  },
  {
    key: "falconMecha",
    image: "/media/products/falcon-mecha-jetour-kit-optimized.jpg"
  }
];

const translations = {
  en: {
    code: "EN",
    label: "English",
    dir: "ltr",
    nav: ["Home", "Culture", "Services", "Global Network", "About", "Contact"],
    contactCta: "Contact Us",
    heroTitle: "Your automotive export partner",
    heroBody:
      "Carmind connects China's automotive supply chain, overseas delivery, digital trade operations, and new energy after-sales capabilities for partners across key growth markets.",
    powered: "Powered by UnityAuto China supply-chain capability",
    explore: "Explore Services",
    statsTitle: "Operating at export scale",
    stats: [
      ["23+", "Years of industry experience"],
      ["15,000+", "Vehicles exported in 2025"],
      ["20+", "Countries in business network"],
      ["200+", "Overseas partners"]
    ],
    servicesTitle: "Two connected business systems",
    servicesBody:
      "From vehicle sourcing to overseas after-sales enablement, Carmind builds an integrated service chain for automotive globalization.",
    expandText: "View details",
    collapseText: "Collapse details",
    exportTitle: "Automotive Export Solutions",
    exportItems: [
      "Sourcing: bulk purchase and agency purchase in China",
      "Storage: border warehouses and overseas warehouses",
      "Transport: domestic, sea, and land logistics tracking",
      "Preparation: standardized inspection, repair, and reconditioning",
      "Modification: vehicle conversion and customization",
      "Settlement: flexible payment and financing support",
      "Tax refund: export tax refund service",
      "FX and insurance: settlement, L/C, credit insurance, order financing"
    ],
    exportVisuals: ["Sourcing", "Storage", "Transport", "Preparation", "Modification", "Settlement", "Tax refund", "FX / Insurance"],
    exportShowcase: {
      title: "Vehicle export capability",
      body: "Carmind supports both new vehicle export and used vehicle export with sourcing, warehousing, preparation, logistics, settlement, tax refund, foreign exchange, insurance, and digital coordination.",
      newTitle: "New vehicle export",
      newBody: "Showroom-based vehicle selection, authorized new-car sourcing, configuration confirmation, and overseas delivery coordination.",
      usedTitle: "Used vehicle export",
      usedBody: "Used-car sourcing, compliance preparation, inspection, transfer, warehousing, and multi-route export delivery.",
      flowTitle: "One-stop new vehicle export service platform",
      flowSide: "Eight services",
      exportModes: ["Factory-direct new vehicles", "Modified vehicles", "Zero-kilometer used vehicles"],
      serviceFlow: [
        ["Sourcing", "Centralized sourcing and agency purchase"],
        ["Storage", "Overseas warehouse and border warehouse"],
        ["Logistics", "Domestic logistics, sea freight, land transport, and rail"],
        ["Tax refund", "Export tax refund and tax support"],
        ["Preparation", "Inspection, repair, preparation, and fitting"],
        ["Modification", "Vehicle conversion and customized kits"],
        ["Settlement", "Payment collection, settlement, and financing"],
        ["FX / Insurance", "Foreign exchange and export credit insurance"]
      ],
      outputs: ["Chinese small and micro automotive exporters", "Overseas automotive traders"],
      outputTitle: "Customers served",
      itSupport: "IT support: customer cloud + warehousing cloud + light flow + multi-dimensional operations",
      usedDiagram: {
        imageSrc: "/media/export/used-car-procurement-platform-en.svg",
        title: "Your Transparent Gateway to China’s Used Cars.",
        customerTitle: "Overseas customers / dealers",
        customerNeeds: "Request: model / year / budget / quantity / other requirements",
        leftSteps: ["Demand confirmation", "Service agreement"],
        benefits: ["Best sourcing plan", "End-to-end tracking"],
        promiseTitle: "Zero-spread service",
        promises: ["No vehicle price spread", "Only fixed service fee"],
        fee: "Fixed service fee: USD 200 / order",
        centerTitle: "CARMIND",
        centerSub: "Transparent sourcing service platform",
        sourceTitle: "Multi-channel vehicle sourcing",
        sourceSub: "Finding better vehicle sources for customers",
        supplier: "Suppliers / vehicle-source channels",
        sourceGroups: [
          {
            title: "Dealer group sources",
            subtitle: "Brand 4S stores / authorized dealer groups",
            logos: ["Mercedes-Benz", "BMW", "Audi", "..."],
            points: ["Premium used cars", "Complete procedures", "Quality condition", "Transparent price"]
          },
          {
            title: "Platform sources",
            subtitle: "Mainstream used-car platforms / vertical platforms",
            logos: ["Dongchedi", "Autohome", "Guazi", "..."],
            points: ["Rich models", "AI price comparison", "Real-time sources", "Accurate matching"]
          },
          {
            title: "Ride-hailing / fleet cars",
            subtitle: "Ride-hailing platforms / leasing companies / operating fleets",
            logos: ["DiDi", "T3 Mobility", "Caocao", "..."],
            points: ["Batch sources", "Transparent mileage", "High value", "Export-ready"]
          }
        ]
      },
      brandWallTitle: "Multi-brand vehicle sourcing network",
      brandWallBody: "Carmind works across Chinese and global mainstream brands to support overseas market demand.",
      brandNames: ["Hyundai", "Kia", "Toyota", "Honda", "BYD", "MG", "Jetour", "Li Auto", "Volkswagen", "Mercedes-Benz", "Nissan", "Mazda", "Hongqi", "NIO", "Leapmotor", "AITO", "Haval", "Geely", "Lynk & Co", "GAC", "Changan", "Avatr", "XPeng", "Tesla", "Great Wall", "Smart"]
    },
    afterTitle: "New Energy After-sales Solutions",
    afterItems: [
      "Parts supply by VIN, OE code, and model",
      "General diagnostic tools covering mainstream NEV systems",
      "Dedicated diagnostic equipment for major vehicle brands",
      "Battery testing and maintenance equipment",
      "Remote diagnosis and programming",
      "Online and offline technical training"
    ],
    afterVisuals: ["Parts", "General diagnostics", "Brand diagnostics", "Battery service", "Remote diagnosis", "Training"],
    afterSystem: {
      title: "New Energy After-sales Service System",
      body:
        "A complete overseas enablement system for NEV service partners, covering parts, diagnostics, battery maintenance, remote support, and technician training.",
      highlights: ["VIN / OE / model parts matching", "95%+ mainstream NEV diagnostics", "Remote programming and practical training"],
      solutionTitle: "Integrated service capabilities",
      solutions: [
        {
          icon: "parts",
          title: "Parts supply system",
          body: "Search and match parts by VIN, OE code, and model across mainstream Chinese new energy vehicles."
        },
        {
          icon: "diagnostic",
          title: "General diagnostics",
          body: "Full-system diagnostic tools for 95%+ mainstream NEV models, with online upgrade support."
        },
        {
          icon: "brandDiagnostic",
          title: "Brand-specific diagnostics",
          body: "Dedicated equipment coverage for BYD, Changan, Neta, Volkswagen, Honda, Toyota, BMW, Mercedes, and more."
        },
        {
          icon: "battery",
          title: "Battery service equipment",
          body: "Air tightness testing, battery balancing, charge-discharge maintenance, and cell maintenance."
        },
        {
          icon: "remote",
          title: "Remote diagnosis and programming",
          body: "Cross-border remote diagnosis and remote programming support for overseas service teams."
        },
        {
          icon: "training",
          title: "Training system",
          body: "Online courses with English subtitles plus offline practical training for local maintenance capability."
        }
      ],
      platform: {
        title: "Integrated After-sales Service Platform",
        sideTitle: "Six overseas after-sales services",
        targetTitle: "Overseas integrated repair network",
        targetMeta: "1,000+ light-chain service partners",
        painTitle: "Three key pain points",
        pains: ["Parts shortage", "Fault diagnosis", "Repair capability"],
        services: [
          ["Parts", "OEM parts, branded parts, dismantled parts, EPC matching", "Parts cloud network", "Domestic border warehouse + overseas warehouse", "Parts shortage"],
          ["Software", "EPC query embedded into diagnostic tools", "Diagnostic access", "Connects parts lookup with workshop workflow", "Fault diagnosis"],
          ["Equipment", "General diagnostics, dedicated diagnostics", "Diagnostic tools", "Identify system faults", "Fault diagnosis"],
          ["Battery", "Full battery repair plan and recycling reuse", "Battery service", "Testing, balancing, maintenance, reuse", "Repair capability"],
          ["Remote", "Remote diagnosis and programming", "Remote expert support", "Cross-border issue handling", "Repair capability"],
          ["Training", "Online + offline technician training", "Training system", "Build local NEV repair skills", "Repair capability"]
        ]
      },
      partsSupply: {
        eyebrow: "Parts supply capability",
        title: "Supply of new energy vehicle parts",
        intro:
          "Carmind connects online EPC lookup, multi-brand parts catalog, and cross-border warehousing to help overseas service teams identify and receive NEV parts faster.",
        tabs: ["Keywords", "VIN code", "Part number", "Vehicle model"],
        nav: ["Home", "Cars", "After Sale", "About Us", "Contact us"],
        search: "Search",
        catalog: "Brand catalog",
        cart: "Inquiry cart",
        brands: ["BYD", "Li Auto", "NIO", "XPeng", "AITO", "Avatr", "Geely", "Changan", "Zeekr", "Great Wall", "Toyota", "BMW"],
        capabilities: [
          ["Full model coverage", "Covers mainstream Chinese new energy vehicle models."],
          ["Accurate lookup", "Search parts by VIN, OE code, and model; EPC integration covers 95% of mainstream models."],
          ["Fast logistics", "Domestic stock in Tianjin and Horgos, with overseas warehouses in Dubai, Djibouti, and Jordan."]
        ],
        metrics: ["VIN", "OE", "95%+", "5 warehouses"]
      },
      batteryKit: {
        eyebrow: "Battery repair equipment",
        title: "Battery testing and maintenance four-piece kit",
        intro:
          "Portable equipment for battery pack sealing, balancing, charge-discharge maintenance, and single-cell service, helping overseas workshops assess battery health and improve repair capability.",
        labels: ["Function", "Value"],
        items: [
          [
            "Portable air-tightness leak tester",
            "Tests the sealing performance of automotive power battery systems.",
            "Prevents steam, dust, and water from entering the battery pack, reducing moisture, short-circuit, and overheating risks."
          ],
          [
            "Portable battery pack balancing maintainer",
            "Balances battery voltage and capacity.",
            "Extends battery life, restores driving range, and improves charge-discharge efficiency."
          ],
          [
            "Portable battery pack charge-discharge maintainer",
            "Performs battery pack charging, discharging, and capacity testing.",
            "Improves battery performance, safety, and health assessment accuracy."
          ],
          [
            "Portable single-cell battery maintainer",
            "Performs charge-discharge, voltage regulation, and capacity testing for single cells.",
            "Extends cell life, improves performance and safety, and supports accurate health evaluation."
          ]
        ]
      },
      cta: "Build overseas NEV service capability"
    },
    productGalleryTitle: "Modification Products",
    productGalleryBody: "",
    products: {
      goldenOasis: ["Golden Oasis", "Li Auto modification kit"],
      falconMecha: ["Falcon Mecha", "Jetour Traveller modification kit"]
    },
    mapTitle: "Global Layout",
    mapBody:
      "Office and service nodes are plotted from real latitude and longitude. Lines represent service relationships, not shifted locations.",
    cultureTitle: "Culture",
    culture: [
      ["Vision", "Make automotive global partners better through our efforts."],
      ["Mission", "Improve the full automotive globalization chain through technology and win-win collaboration."],
      ["Positioning", "Collaborative partner for automotive exports."],
      ["Promise", "Efficient, simple, and reliable."],
      ["Values", "Integrity, kindness, bold experimentation, and resilience."]
    ],
    aboutTitle: "Our Team",
    aboutBody:
      "Carmind is the international business brand backed by UnityAuto / Huayi Chelian in China. The group was founded in Tianjin in 2002 and has built long-term capability across automotive export, warehousing, preparation, modification, digital operations, and new energy after-sales services.",
    partnersTitle: "Partner team",
    portraitSlot: "Business portrait asset",
    orgTitle: "Organization Structure",
    org: {
      company: "UnityAuto / Huayi Chelian",
      ceoRole: "CEO",
      ceo: "Wayne",
      presidentRole: "President",
      president: "Nico",
      ownerLabel: "Owner",
      centers: [
        {
          title: "Customer Growth Center",
          owner: "Nico",
          tone: "green",
          groups: [
            ["East Africa Region", ["Ethiopia", "Djibouti"]],
            ["Middle East Region", ["UAE", "Jordan"]],
            ["Central Asia Region", ["Central Asia Development"]],
            ["China Region", ["Tianjin Team", "Guangdong Team"]]
          ]
        },
        {
          title: "Supply Chain Center",
          owner: "Ryan",
          tone: "cyan",
          groups: [
            ["Vehicle Supply Chain", ["Supply Chain Team 1", "Supply Chain Team 2", "Supply Chain Team 3"]],
            ["After-sales Supply Chain", ["Dubai After-sales Project", "Innovation Project", "Software Parts Team", "Parts & Equipment Team"]]
          ]
        },
        {
          title: "Finance Shared Center",
          owner: "Ryan",
          tone: "blue",
          groups: []
        },
        {
          title: "Admin & HR Shared Center",
          owner: "Wayne",
          tone: "slate",
          groups: []
        }
      ]
    },
    partners: {
      ceo: ["Wayne", "CEO"],
      president: ["Nico", "President"],
      africa: ["Alan", "Africa Director"],
      centralAsia: ["Christ", "Central Asia Director"],
      supply: ["Ryan", "Finance Director"]
    },
    contactTitle: "Contact",
    contactBody: "Use the company email or phone below, or send a project inquiry through the form.",
    email: "Email",
    phone: "Phone / WhatsApp",
    website: "Website",
    officesTitle: "Office addresses",
    form: {
      name: "Name",
      company: "Company",
      country: "Country / Region",
      email: "Email",
      phone: "WhatsApp / Phone",
      service: "Interested Service",
      message: "Message",
      send: "Send Inquiry",
      options: ["Automotive Export", "New Energy After-sales", "Spare Parts", "Remote Diagnosis", "Training", "Other"]
    },
    officeNames: {
      tianjin: "Tianjin, China",
      shanghai: "Shanghai, China",
      guangzhou: "Guangzhou, China",
      horgos: "Horgos, China",
      dubai: "Dubai, UAE",
      tashkent: "Tashkent, Uzbekistan",
      djibouti: "Djibouti",
      jordan: "Jordan",
      iquique: "Iquique, Chile",
      chancay: "Chancay Port, Peru",
      dominican: "Dominican Republic",
      ethiopia: "Ethiopia",
      algeria: "Algeria",
      lagos: "Lagos, Nigeria"
    }
  },
  zh: {
    code: "中文",
    label: "中文",
    dir: "ltr",
    nav: ["首页", "企业文化", "业务", "全球网络", "关于我们", "联系我们"],
    contactCta: "联系我们",
    heroTitle: "汽车出海协同伙伴",
    heroBody: "Carmind 连接中国汽车供应链、海外交付、数字化贸易运营与新能源售后能力，服务重点增长市场的合作伙伴。",
    powered: "由 UnityAuto / 华宜车联中国供应链能力支持",
    explore: "了解业务",
    statsTitle: "规模化出口运营能力",
    stats: [
      ["23+", "年行业经验"],
      ["15,000+", "2025 年出口车辆"],
      ["20+", "业务覆盖国家"],
      ["200+", "海外合作伙伴"]
    ],
    servicesTitle: "两套相互连接的业务体系",
    servicesBody: "从车辆采购到海外售后能力建设，Carmind 为汽车全球化打造一体化服务链路。",
    expandText: "查看详细介绍",
    collapseText: "收起详细介绍",
    exportTitle: "中国汽车出海服务",
    exportItems: [
      "采：集采与代采，协助海外客户在中国采购车辆",
      "存：边贸仓、海外仓和车辆验收记录管理",
      "运：国内运输、海运、陆运和进度跟踪",
      "修 / 整备：标准化检测、维修和整备",
      "改：车辆改装与定制服务",
      "垫：灵活结算和融资支持",
      "退：出口退税服务",
      "汇 / 保：外汇结算、信用证、信用保险和订单融资"
    ],
    exportVisuals: ["车辆采购", "仓储", "运输", "整备", "改装", "结算", "退税", "汇兑 / 保险"],
    exportShowcase: {
      title: "整车出口能力",
      body: "Carmind 同时支持新车出海与二手车出海，围绕车源、仓储、整备、物流、结算、退税、汇兑、保险和数字化协同形成完整出口服务。",
      newTitle: "新车出海",
      newBody: "依托展厅看车、授权新车车源、配置确认和海外交付协同，为海外客户提供稳定的新车出口服务。",
      usedTitle: "二手车出海",
      usedBody: "覆盖二手车车源、合规整备、检测、过户、仓储和多线路出口交付，服务海外整车进口商。",
      flowTitle: "一站式新车出口服务平台",
      flowSide: "整车出口八大服务",
      exportModes: ["厂家直营新车", "改装车", "零公里二手车"],
      serviceFlow: [
        ["采", "车源采购：集采、代采"],
        ["存", "仓储：海外仓、边贸仓"],
        ["运", "物流：国内物流、海运、陆运、班列"],
        ["退", "退税：出口退税和垫税支持"],
        ["修", "整备：维修、检测、加装"],
        ["改", "改装：定制套件和精品配件"],
        ["汇", "结汇：查款、收款和结算"],
        ["保", "保险：中信保和订单保障"]
      ],
      outputs: ["中国小微汽车出口企业", "海外汽车贸易商"],
      outputTitle: "服务客户",
      itSupport: "IT 支撑：客户云 + 仓储云 + 轻流 + 多维运营",
      usedDiagram: {
        imageSrc: "/media/export/used-car-procurement-platform-zh.svg",
        title: "通往中国二手车的透明门户",
        customerTitle: "海外客户 / 外商",
        customerNeeds: "提出需求：车型 / 年份 / 预算 / 数量 / 其他要求",
        leftSteps: ["需求确认", "签订服务协议"],
        benefits: ["提供最优采购方案", "全程跟进服务"],
        promiseTitle: "零差价服务",
        promises: ["不赚取车辆差价", "只赚取固定服务费"],
        fee: "固定服务费：200 USD / 单",
        centerTitle: "CARMIND",
        centerSub: "透明化采购服务平台",
        sourceTitle: "多渠道整合车源",
        sourceSub: "为客户寻找更优车源",
        supplier: "供货商（车源渠道）",
        sourceGroups: [
          {
            title: "经销商集团车源",
            subtitle: "品牌 4S 店 / 授权经销商集团",
            logos: ["奔驰", "宝马", "奥迪", "..."],
            points: ["精品二手车", "手续齐全", "车况优质", "价格透明"]
          },
          {
            title: "平台车源",
            subtitle: "主流二手车平台 / 垂直平台",
            logos: ["懂车帝", "汽车之家", "瓜子", "..."],
            points: ["车型丰富", "AI 智能比价", "实时车源", "精准匹配需求"]
          },
          {
            title: "网约车 / 加盟车下线车",
            subtitle: "网约车平台 / 租赁公司 / 运营车",
            logos: ["滴滴", "T3 出行", "曹操出行", "..."],
            points: ["批量车源", "里程透明", "高性价比", "适合出口"]
          }
        ]
      },
      brandWallTitle: "多品牌车源网络",
      brandWallBody: "覆盖中国与全球主流汽车品牌，支撑不同海外市场的车型采购与交付需求。",
      brandNames: ["现代", "起亚", "丰田", "本田", "比亚迪", "名爵", "捷途", "理想", "大众", "奔驰", "日产", "马自达", "红旗", "蔚来", "零跑", "问界", "哈弗", "吉利", "领克", "广汽", "长安", "阿维塔", "小鹏", "特斯拉", "长城", "Smart"]
    },
    afterTitle: "中国新能源售后体系出海",
    afterItems: [
      "配件：按 VIN、OE 码和车型供应",
      "通用检测设备：覆盖主流新能源车型系统",
      "专用检测设备：支持主要汽车品牌诊断",
      "电池检测维修设备",
      "远程诊断与编程",
      "线上和线下技术培训"
    ],
    afterVisuals: ["配件", "通用诊断", "专用诊断", "电池服务", "远程诊断", "培训"],
    afterSystem: {
      title: "中国新能源售后体系出海",
      body: "面向海外服务伙伴的一整套新能源售后能力建设方案，覆盖配件、诊断、电池维修、远程支持和技术培训。",
      highlights: ["VIN / OE / 车型配件匹配", "覆盖 95%+ 主流新能源车型诊断", "远程编程与实战培训"],
      solutionTitle: "一体化售后能力",
      solutions: [
        {
          icon: "parts",
          title: "配件供应系统",
          body: "支持按 VIN、OE 码和车型检索，覆盖中国主流新能源车型配件。"
        },
        {
          icon: "diagnostic",
          title: "通用检测设备",
          body: "覆盖 95% 以上主流新能源车型全系统，并支持在线升级。"
        },
        {
          icon: "brandDiagnostic",
          title: "专用检测设备",
          body: "支持比亚迪、长安、哪吒、大众、本田、丰田、宝马、奔驰等品牌诊断设备。"
        },
        {
          icon: "battery",
          title: "电池检测维修设备",
          body: "覆盖气密性检测、电池均衡、充放电维护和单体电池维护。"
        },
        {
          icon: "remote",
          title: "远程诊断与编程",
          body: "为海外服务团队提供跨国远程诊断、远程编程和疑难问题支持。"
        },
        {
          icon: "training",
          title: "培训体系",
          body: "线上英文字幕课程结合线下实战培训，帮助客户建立新能源维修能力。"
        }
      ],
      platform: {
        title: "售后综合服务平台",
        sideTitle: "售后出海六大服务",
        targetTitle: "海外综合修理厂",
        targetMeta: "1000+ 轻连锁服务伙伴",
        painTitle: "三大痛点",
        pains: ["缺配件", "查故障", "不会修"],
        services: [
          ["配件", "原厂件、品牌件、拆车件，EPC 查配件", "配件公网", "国内边贸仓 + 海外仓供应", "缺配件"],
          ["软件", "EPC 查询植入通检设备", "诊断入口", "打通配件查询和维修流程", "查故障"],
          ["设备", "通检、专检设备", "检测设备矩阵", "定位系统故障", "查故障"],
          ["电池", "电池维修整体方案，电池回收再利用", "电池服务", "检测、均衡、维护、再利用", "不会修"],
          ["远程", "远程诊断、远程编程", "远程专家支持", "跨国处理疑难问题", "不会修"],
          ["培训", "线上 + 线下技术培训", "培训体系", "帮助本地团队形成维修能力", "不会修"]
        ]
      },
      partsSupply: {
        eyebrow: "配件供应能力",
        title: "新能源汽车配件供应",
        intro: "通过 Carmind 独立站、EPC 查件能力和跨境仓储网络，帮助海外维修伙伴更快识别、确认并获取中国新能源车型配件。",
        tabs: ["关键词", "VIN 码", "零件号", "车型"],
        nav: ["首页", "车辆", "售后", "关于我们", "联系我们"],
        search: "查询",
        catalog: "品牌目录",
        cart: "询价清单",
        brands: ["比亚迪", "理想", "蔚来", "小鹏", "问界", "阿维塔", "吉利", "长安", "极氪", "长城", "丰田", "宝马"],
        capabilities: [
          ["品类：全车型覆盖", "供货范围覆盖中国主流新能源车型。"],
          ["查配件：准确", "支持按 VIN、OE 码、车型检索配件清单，集成主机厂 EPC 系统，覆盖 95% 主流车型。"],
          ["物流：快速", "在天津、霍尔果斯设国内备货仓，在迪拜、吉布提、约旦设立海外仓。"]
        ],
        metrics: ["VIN", "OE", "95%+", "5 个仓"]
      },
      batteryKit: {
        eyebrow: "电池维修设备",
        title: "电池检测维修设备四件套",
        intro: "围绕电池包密封性、电池组均衡、充放电维护和单体电池维护，帮助海外维修网点建立新能源电池检测、维护和健康评估能力。",
        labels: ["功能", "作用"],
        items: [
          [
            "便携式气密性检漏测试仪",
            "用于检测汽车动力电池系统的密封性。",
            "防止汽、尘、水进入电池内部，避免气密性问题导致电池受潮、短路、过热等故障。"
          ],
          [
            "便携式电池组均衡维护仪",
            "用于均衡电池电压、容量。",
            "延长电池使用寿命，恢复续航里程，提高充放电效率。"
          ],
          [
            "便携式电池组充放电维护仪",
            "对电池组进行充电、放电和容量检测。",
            "延长电池使用寿命，提升电池性能，保障电池安全，并准确评估电池健康状况。"
          ],
          [
            "便携式单体电池维护仪",
            "对单体电池进行充放电、调压和容量检测。",
            "延长电池使用寿命，提升电池性能，保障电池安全，并准确评估电池健康状况。"
          ]
        ]
      },
      cta: "建立海外新能源售后能力"
    },
    productGalleryTitle: "改装产品",
    productGalleryBody: "",
    products: {
      goldenOasis: ["金色绿洲 Golden Oasis", "理想改装套件"],
      falconMecha: ["猎隼机甲 Falcon Mecha", "捷途旅行者改装套件"]
    },
    mapTitle: "全球布局",
    mapBody: "办公室和服务节点均按真实经纬度投点。线路表示业务连接关系，不改变城市实际位置。",
    cultureTitle: "企业文化",
    culture: [
      ["愿景", "让汽车出海伙伴因我们更美好。"],
      ["使命", "用科技完善汽车出海全链路，与合作伙伴共生、共赢。"],
      ["定位", "汽车出海协同伙伴。"],
      ["客户承诺", "高效、简单、保障。"],
      ["价值观", "诚信、善良、折腾、皮实。"]
    ],
    aboutTitle: "我们的团队",
    aboutBody:
      "Carmind 是面向海外市场的国际业务主品牌，由中国的 UnityAuto / 华宜车联提供供应链能力背书。集团于 2002 年在天津创立，长期建设汽车出口、仓储、整备、改装、数字化运营和新能源售后服务能力。",
    partnersTitle: "合伙人团队",
    portraitSlot: "商业头像素材位",
    orgTitle: "组织架构",
    org: {
      company: "华宜车联 / UnityAuto",
      ceoRole: "CEO",
      ceo: "杨宏伟（Wayne）",
      presidentRole: "总裁",
      president: "牛瑞东（Nico）",
      ownerLabel: "负责人",
      centers: [
        {
          title: "客户增长中心",
          owner: "牛瑞东（Nico）",
          tone: "green",
          groups: [
            ["东非大区", ["埃塞俄比亚", "吉布提"]],
            ["中东大区", ["阿联酋", "约旦"]],
            ["中亚大区", ["中亚拓新"]],
            ["中国大区", ["天津组", "广东组"]]
          ]
        },
        {
          title: "供应链中心",
          owner: "于懿铭（Ryan）",
          tone: "cyan",
          groups: [
            ["整车供应链", ["供应链一组", "供应链二组", "供应链三组"]],
            ["售后供应链", ["迪拜售后项目", "创新项目", "软件备件组", "备件设备组"]]
          ]
        },
        {
          title: "财务共享中心",
          owner: "于懿铭（Ryan）",
          tone: "blue",
          groups: []
        },
        {
          title: "行政人事共享中心",
          owner: "杨宏伟（Wayne）",
          tone: "slate",
          groups: []
        }
      ]
    },
    partners: {
      ceo: ["杨宏伟（Wayne）", "CEO"],
      president: ["牛瑞东（Nico）", "总裁"],
      africa: ["张立（Alan）", "非洲区负责人"],
      centralAsia: ["孟垂升（Christ）", "中亚区负责人"],
      supply: ["于懿铭（Ryan）", "财务总监"]
    },
    contactTitle: "联系我们",
    contactBody: "可通过以下邮箱、电话联系，也可以提交项目咨询表单。",
    email: "邮箱",
    phone: "电话 / WhatsApp",
    website: "网站",
    officesTitle: "办公室地址",
    form: {
      name: "姓名",
      company: "公司",
      country: "国家 / 地区",
      email: "邮箱",
      phone: "WhatsApp / 电话",
      service: "感兴趣业务",
      message: "留言",
      send: "提交咨询",
      options: ["汽车出口", "新能源售后", "配件", "远程诊断", "培训", "其他"]
    },
    officeNames: {
      tianjin: "天津，中国",
      shanghai: "上海，中国",
      guangzhou: "广州，中国",
      horgos: "霍尔果斯，中国",
      dubai: "迪拜，阿联酋",
      tashkent: "塔什干，乌兹别克斯坦",
      djibouti: "吉布提",
      jordan: "约旦",
      iquique: "伊基克，智利",
      chancay: "钱凯港，秘鲁",
      dominican: "多米尼加",
      ethiopia: "埃塞俄比亚",
      algeria: "阿尔及利亚",
      lagos: "拉各斯，尼日利亚"
    },
    officeAddresses: {
      tianjin: "华宜车联汽车科技有限公司 · 天津自贸试验区通达广场 C.1 区 308 室",
      shanghai: "华宜车联汽车科技有限公司 · 上海市青浦区中建企业天地西区 6 号楼 701 室",
      guangzhou: "华宜车联汽车科技有限公司 · 广东省广州市南沙区海嘉汽车码头 301 室",
      horgos: "霍尔果斯华宜车联网络科技有限公司 · 新疆伊犁霍尔果斯综合保税区跨境电商产业园 D 区 1-2 号仓"
    }
  },
  ar: {
    code: "العربية",
    label: "العربية",
    dir: "rtl",
    nav: ["الرئيسية", "الثقافة", "الخدمات", "الشبكة العالمية", "من نحن", "اتصل بنا"],
    contactCta: "اتصل بنا",
    heroTitle: "شريكك في تصدير السيارات",
    heroBody: "تربط Carmind سلسلة توريد السيارات الصينية والتسليم الخارجي والتشغيل التجاري الرقمي وقدرات ما بعد البيع لشركاء الأسواق النامية.",
    powered: "مدعومة بقدرات سلسلة التوريد الصينية من UnityAuto",
    explore: "استكشف الخدمات",
    statsTitle: "قدرات تشغيلية على نطاق التصدير",
    stats: [
      ["23+", "سنوات من الخبرة"],
      ["15,000+", "مركبة مصدرة في 2025"],
      ["20+", "دولة ضمن الشبكة"],
      ["200+", "شريك خارجي"]
    ],
    servicesTitle: "نظامان متكاملان للأعمال",
    servicesBody: "من توريد المركبات إلى بناء قدرات ما بعد البيع الخارجية، تقدم Carmind سلسلة خدمات متكاملة لعولمة السيارات.",
    expandText: "عرض التفاصيل",
    collapseText: "إخفاء التفاصيل",
    exportTitle: "حلول تصدير السيارات",
    exportItems: [
      "التوريد: شراء جماعي وشراء بالوكالة من الصين",
      "التخزين: مستودعات حدودية وخارجية",
      "النقل: تتبع النقل المحلي والبحري والبري",
      "التجهيز: فحص وإصلاح وإعداد موحد",
      "التعديل: تحويل وتخصيص المركبات",
      "التسوية: حلول دفع وتمويل مرنة",
      "استرداد الضريبة: خدمة استرداد ضريبة التصدير",
      "الصرف والتأمين: تسوية واعتماد مستندي وتأمين ائتماني وتمويل الطلبات"
    ],
    exportVisuals: ["التوريد", "التخزين", "النقل", "التجهيز", "التعديل", "التسوية", "استرداد الضريبة", "الصرف / التأمين"],
    exportShowcase: {
      title: "قدرات تصدير المركبات",
      body: "تدعم Carmind تصدير السيارات الجديدة والمستعملة عبر التوريد والتخزين والتجهيز واللوجستيات والتسوية واسترداد الضريبة والصرف والتأمين والتنسيق الرقمي.",
      newTitle: "تصدير السيارات الجديدة",
      newBody: "اختيار من صالة العرض، توريد سيارات جديدة معتمدة، تأكيد المواصفات، وتنسيق التسليم الخارجي.",
      usedTitle: "تصدير السيارات المستعملة",
      usedBody: "توريد المركبات المستعملة، التجهيز النظامي، الفحص، نقل الملكية، التخزين، والتسليم عبر مسارات متعددة.",
      flowTitle: "منصة شاملة لتصدير السيارات الجديدة",
      flowSide: "ثماني خدمات",
      exportModes: ["سيارات جديدة مباشرة من المصنع", "سيارات معدلة", "سيارات مستعملة صفر كيلومتر"],
      serviceFlow: [
        ["توريد", "شراء جماعي وشراء بالوكالة"],
        ["تخزين", "مستودعات خارجية وحدودية"],
        ["لوجستيات", "محلي، بحري، بري، وسكك حديد"],
        ["ضريبة", "استرداد ضريبة ودعم ضريبي"],
        ["تجهيز", "فحص وإصلاح وتركيب"],
        ["تعديل", "أطقم مخصصة وملحقات"],
        ["تسوية", "تحصيل وتسوية وتمويل"],
        ["تأمين", "صرف وتأمين ائتماني للتصدير"]
      ],
      outputs: ["شركات تصدير السيارات الصينية الصغيرة ومتناهية الصغر", "تجار السيارات في الخارج"],
      outputTitle: "العملاء المستفيدون",
      itSupport: "دعم رقمي: سحابة العملاء + سحابة المستودعات + سير عمل خفيف + عمليات متعددة الأبعاد",
      usedDiagram: {
        imageSrc: "/media/export/used-car-procurement-platform-ar.svg",
        title: "بوابتك الشفافة إلى السيارات المستعملة في الصين",
        customerTitle: "العملاء / التجار في الخارج",
        customerNeeds: "الطلب: الطراز / السنة / الميزانية / الكمية / متطلبات أخرى",
        leftSteps: ["تأكيد الطلب", "توقيع اتفاقية الخدمة"],
        benefits: ["أفضل خطة توريد", "متابعة كاملة"],
        promiseTitle: "خدمة دون فرق سعري",
        promises: ["لا نربح من فرق سعر السيارة", "رسوم خدمة ثابتة فقط"],
        fee: "رسوم خدمة ثابتة: 200 دولار / طلب",
        centerTitle: "CARMIND",
        centerSub: "منصة خدمة توريد شفافة",
        sourceTitle: "دمج مصادر متعددة",
        sourceSub: "العثور على مصادر أفضل للعملاء",
        supplier: "الموردون / قنوات السيارات",
        sourceGroups: [
          {
            title: "مصادر مجموعات الوكلاء",
            subtitle: "متاجر 4S / مجموعات وكلاء معتمدة",
            logos: ["Mercedes-Benz", "BMW", "Audi", "..."],
            points: ["سيارات مستعملة ممتازة", "إجراءات كاملة", "حالة جيدة", "سعر شفاف"]
          },
          {
            title: "مصادر المنصات",
            subtitle: "منصات سيارات مستعملة رئيسية ومتخصصة",
            logos: ["Dongchedi", "Autohome", "Guazi", "..."],
            points: ["طرازات متنوعة", "مقارنة سعر ذكية", "مصادر فورية", "مطابقة دقيقة"]
          },
          {
            title: "سيارات أساطيل وتشغيل",
            subtitle: "منصات نقل / شركات تأجير / أساطيل تشغيل",
            logos: ["DiDi", "T3 Mobility", "Caocao", "..."],
            points: ["مصادر بالجملة", "كيلومترات واضحة", "قيمة عالية", "جاهزة للتصدير"]
          }
        ]
      },
      brandWallTitle: "شبكة توريد متعددة العلامات",
      brandWallBody: "تغطي Carmind علامات صينية وعالمية رئيسية لتلبية احتياجات الأسواق الخارجية.",
      brandNames: ["Hyundai", "Kia", "Toyota", "Honda", "BYD", "MG", "Jetour", "Li Auto", "Volkswagen", "Mercedes-Benz", "Nissan", "Mazda", "Hongqi", "NIO", "Leapmotor", "AITO", "Haval", "Geely", "Lynk & Co", "GAC", "Changan", "Avatr", "XPeng", "Tesla", "Great Wall", "Smart"]
    },
    afterTitle: "حلول ما بعد البيع للطاقة الجديدة",
    afterItems: [
      "توريد قطع الغيار حسب VIN ورمز OE والطراز",
      "أدوات تشخيص عامة لأنظمة مركبات الطاقة الجديدة",
      "معدات تشخيص مخصصة للعلامات الرئيسية",
      "معدات اختبار وصيانة البطاريات",
      "تشخيص وبرمجة عن بعد",
      "تدريب تقني عبر الإنترنت وحضوريا"
    ],
    afterVisuals: ["قطع الغيار", "تشخيص عام", "تشخيص مخصص", "خدمة البطارية", "تشخيص عن بعد", "التدريب"],
    afterSystem: {
      title: "نظام خدمات ما بعد البيع لمركبات الطاقة الجديدة",
      body: "منظومة متكاملة لتمكين شركاء الخدمة في الخارج، تشمل قطع الغيار والتشخيص وصيانة البطاريات والدعم عن بعد والتدريب الفني.",
      highlights: ["مطابقة القطع حسب VIN و OE والطراز", "تشخيص أكثر من 95% من مركبات الطاقة الجديدة", "برمجة عن بعد وتدريب عملي"],
      solutionTitle: "قدرات خدمة متكاملة",
      solutions: [
        {
          icon: "parts",
          title: "نظام قطع الغيار",
          body: "بحث ومطابقة قطع الغيار حسب VIN ورمز OE والطراز لمركبات الطاقة الجديدة الصينية."
        },
        {
          icon: "diagnostic",
          title: "تشخيص عام",
          body: "أجهزة تشخيص كاملة الأنظمة لأكثر من 95% من الطرازات الرئيسية مع دعم التحديث عبر الإنترنت."
        },
        {
          icon: "brandDiagnostic",
          title: "تشخيص مخصص للعلامات",
          body: "معدات مخصصة لعلامات مثل BYD وChangan وNeta وVolkswagen وHonda وToyota وBMW وMercedes."
        },
        {
          icon: "battery",
          title: "معدات خدمة البطاريات",
          body: "اختبار الإحكام، موازنة البطارية، صيانة الشحن والتفريغ، وصيانة الخلايا."
        },
        {
          icon: "remote",
          title: "تشخيص وبرمجة عن بعد",
          body: "دعم عابر للحدود للتشخيص والبرمجة عن بعد لفرق الخدمة الخارجية."
        },
        {
          icon: "training",
          title: "نظام التدريب",
          body: "دورات عبر الإنترنت بترجمة إنجليزية وتدريب عملي حضوري لبناء قدرات الصيانة المحلية."
        }
      ],
      platform: {
        title: "منصة متكاملة لخدمات ما بعد البيع",
        sideTitle: "ست خدمات خارجية",
        targetTitle: "شبكة مراكز صيانة متكاملة",
        targetMeta: "أكثر من 1,000 شريك خدمة خفيف",
        painTitle: "ثلاث نقاط ألم",
        pains: ["نقص القطع", "تشخيص الأعطال", "قدرة الإصلاح"],
        services: [
          ["قطع الغيار", "قطع أصلية وعلامات وقطع مفككة مع مطابقة EPC", "شبكة قطع سحابية", "مستودعات حدودية ومحلية وخارجية", "نقص القطع"],
          ["البرمجيات", "إدخال بحث EPC في أجهزة التشخيص العامة", "مدخل التشخيص", "ربط بحث القطع بسير عمل الورشة", "تشخيص الأعطال"],
          ["المعدات", "تشخيص عام ومخصص", "مصفوفة أجهزة التشخيص", "تحديد أعطال الأنظمة", "تشخيص الأعطال"],
          ["البطارية", "حل إصلاح البطاريات وإعادة التدوير", "خدمة البطارية", "اختبار وموازنة وصيانة وإعادة استخدام", "قدرة الإصلاح"],
          ["عن بعد", "تشخيص وبرمجة عن بعد", "دعم خبراء عن بعد", "حل المشكلات العابرة للحدود", "قدرة الإصلاح"],
          ["التدريب", "تدريب فني عبر الإنترنت وحضوريا", "نظام التدريب", "بناء مهارات الصيانة المحلية", "قدرة الإصلاح"]
        ]
      },
      partsSupply: {
        eyebrow: "قدرة توريد القطع",
        title: "توريد قطع غيار مركبات الطاقة الجديدة",
        intro: "تجمع Carmind بين موقع مستقل وبحث EPC وشبكة مستودعات عابرة للحدود لمساعدة فرق الخدمة الخارجية على تحديد قطع NEV واستلامها بسرعة.",
        tabs: ["كلمات مفتاحية", "رمز VIN", "رقم القطعة", "طراز السيارة"],
        nav: ["الرئيسية", "السيارات", "ما بعد البيع", "من نحن", "اتصل بنا"],
        search: "بحث",
        catalog: "دليل العلامات",
        cart: "قائمة الاستفسار",
        brands: ["BYD", "Li Auto", "NIO", "XPeng", "AITO", "Avatr", "Geely", "Changan", "Zeekr", "Great Wall", "Toyota", "BMW"],
        capabilities: [
          ["تغطية الطرازات", "يغطي الطرازات الصينية الرئيسية لمركبات الطاقة الجديدة."],
          ["بحث دقيق", "بحث حسب VIN ورمز OE والطراز، مع تكامل EPC يغطي 95% من الطرازات الرئيسية."],
          ["لوجستيات سريعة", "مخزون محلي في تيانجين وخورغوس ومستودعات خارجية في دبي وجيبوتي والأردن."]
        ],
        metrics: ["VIN", "OE", "95%+", "5 مستودعات"]
      },
      batteryKit: {
        eyebrow: "معدات صيانة البطاريات",
        title: "مجموعة من أربع معدات لاختبار وصيانة البطارية",
        intro: "معدات محمولة لاختبار إحكام البطارية، موازنة حزمة البطارية، صيانة الشحن والتفريغ، وصيانة الخلايا المفردة لبناء قدرة الخدمة الخارجية.",
        labels: ["الوظيفة", "القيمة"],
        items: [
          ["جهاز اختبار تسرب الإحكام المحمول", "يختبر إحكام نظام بطارية الطاقة في السيارة.", "يساعد على منع دخول البخار والغبار والماء وتقليل مخاطر الرطوبة والقصر والحرارة الزائدة."],
          ["جهاز موازنة حزمة البطارية المحمول", "يوازن جهد وسعة البطارية.", "يطيل عمر البطارية ويستعيد مدى القيادة ويحسن كفاءة الشحن والتفريغ."],
          ["جهاز صيانة الشحن والتفريغ لحزمة البطارية", "ينفذ الشحن والتفريغ واختبار السعة لحزمة البطارية.", "يحسن الأداء والسلامة ودقة تقييم صحة البطارية."],
          ["جهاز صيانة الخلية المفردة المحمول", "ينفذ الشحن والتفريغ وضبط الجهد واختبار السعة للخلية.", "يطيل عمر الخلية ويحسن الأداء والسلامة ويدعم تقييم الصحة بدقة."]
        ]
      },
      cta: "بناء قدرة خدمة الطاقة الجديدة في الخارج"
    },
    productGalleryTitle: "منتجات التعديل",
    productGalleryBody: "",
    products: {
      goldenOasis: ["Golden Oasis", "طقم تعديل Li Auto"],
      falconMecha: ["Falcon Mecha", "طقم تعديل Jetour Traveller"]
    },
    mapTitle: "الانتشار العالمي",
    mapBody: "تظهر المكاتب ونقاط الخدمة حسب خطوط الطول والعرض الحقيقية. الخطوط تمثل علاقات الخدمة ولا تغير مواقع المدن.",
    cultureTitle: "الثقافة",
    culture: [
      ["الرؤية", "جعل شركاء السيارات العالميين أفضل من خلال جهودنا."],
      ["الرسالة", "تحسين سلسلة عولمة السيارات بالتكنولوجيا والتعاون المربح."],
      ["الموقع", "شريك تعاوني لتصدير السيارات."],
      ["الوعد", "كفاءة وبساطة وموثوقية."],
      ["القيم", "النزاهة واللطف وروح التجربة والصلابة."]
    ],
    aboutTitle: "فريقنا",
    aboutBody: "Carmind هي العلامة الدولية للأعمال، مدعومة بقدرات UnityAuto / Huayi Chelian في الصين. تأسست المجموعة في تيانجين عام 2002 وطورت قدرات في التصدير والتخزين والتجهيز والتعديل والتشغيل الرقمي وخدمات ما بعد البيع للطاقة الجديدة.",
    partnersTitle: "فريق الشركاء",
    portraitSlot: "مساحة صورة تجارية",
    orgTitle: "الهيكل التنظيمي",
    org: {
      company: "UnityAuto / Huayi Chelian",
      ceoRole: "الرئيس التنفيذي",
      ceo: "Wayne",
      presidentRole: "الرئيس",
      president: "Nico",
      ownerLabel: "المسؤول",
      centers: [
        {
          title: "مركز نمو العملاء",
          owner: "Nico",
          tone: "green",
          groups: [
            ["منطقة شرق أفريقيا", ["إثيوبيا", "جيبوتي"]],
            ["منطقة الشرق الأوسط", ["الإمارات", "الأردن"]],
            ["منطقة آسيا الوسطى", ["تطوير آسيا الوسطى"]],
            ["منطقة الصين", ["فريق تيانجين", "فريق غوانغدونغ"]]
          ]
        },
        {
          title: "مركز سلسلة التوريد",
          owner: "Ryan",
          tone: "cyan",
          groups: [
            ["سلسلة توريد المركبات", ["فريق التوريد 1", "فريق التوريد 2", "فريق التوريد 3"]],
            ["سلسلة توريد ما بعد البيع", ["مشروع دبي لما بعد البيع", "مشروع الابتكار", "فريق البرمجيات والقطع", "فريق القطع والمعدات"]]
          ]
        },
        {
          title: "مركز المالية المشترك",
          owner: "Ryan",
          tone: "blue",
          groups: []
        },
        {
          title: "مركز الإدارة والموارد البشرية",
          owner: "Wayne",
          tone: "slate",
          groups: []
        }
      ]
    },
    partners: {
      ceo: ["Wayne", "الرئيس التنفيذي"],
      president: ["Nico", "الرئيس"],
      africa: ["Alan", "مدير أفريقيا"],
      centralAsia: ["Christ", "مدير آسيا الوسطى"],
      supply: ["Ryan", "المدير المالي"]
    },
    contactTitle: "اتصل بنا",
    contactBody: "استخدم البريد الإلكتروني أو الهاتف أدناه، أو أرسل استفسارا عبر النموذج.",
    email: "البريد الإلكتروني",
    phone: "الهاتف / WhatsApp",
    website: "الموقع",
    officesTitle: "عناوين المكاتب",
    form: {
      name: "الاسم",
      company: "الشركة",
      country: "الدولة / المنطقة",
      email: "البريد الإلكتروني",
      phone: "WhatsApp / الهاتف",
      service: "الخدمة المطلوبة",
      message: "الرسالة",
      send: "إرسال الاستفسار",
      options: ["تصدير السيارات", "ما بعد البيع للطاقة الجديدة", "قطع الغيار", "التشخيص عن بعد", "التدريب", "أخرى"]
    },
    officeNames: {
      tianjin: "تيانجين، الصين",
      shanghai: "شنغهاي، الصين",
      guangzhou: "غوانزو، الصين",
      horgos: "خورغوس، الصين",
      dubai: "دبي، الإمارات",
      tashkent: "طشقند، أوزبكستان",
      djibouti: "جيبوتي",
      jordan: "الأردن",
      iquique: "إكيكي، تشيلي",
      chancay: "ميناء تشانكاي، بيرو",
      dominican: "جمهورية الدومينيكان",
      ethiopia: "إثيوبيا",
      algeria: "الجزائر",
      lagos: "لاغوس، نيجيريا"
    }
  },
  ru: {
    code: "Русский",
    label: "Русский",
    dir: "ltr",
    nav: ["Главная", "Культура", "Услуги", "Глобальная сеть", "О нас", "Контакты"],
    contactCta: "Связаться",
    heroTitle: "Ваш партнер по экспорту автомобилей",
    heroBody: "Carmind объединяет автомобильную цепочку поставок Китая, зарубежную доставку, цифровые торговые операции и сервисные возможности для рынков роста.",
    powered: "При поддержке китайской цепочки поставок UnityAuto",
    explore: "Изучить услуги",
    statsTitle: "Экспортные операции в масштабе",
    stats: [
      ["23+", "лет отраслевого опыта"],
      ["15,000+", "автомобилей экспортировано в 2025"],
      ["20+", "стран в деловой сети"],
      ["200+", "зарубежных партнеров"]
    ],
    servicesTitle: "Две связанные бизнес-системы",
    servicesBody: "От закупки автомобилей до зарубежной сервисной инфраструктуры Carmind строит единую цепочку глобализации авто.",
    expandText: "Подробнее",
    collapseText: "Свернуть",
    exportTitle: "Решения для экспорта автомобилей",
    exportItems: [
      "Закупка: оптовая и агентская закупка в Китае",
      "Хранение: пограничные и зарубежные склады",
      "Логистика: отслеживание перевозок по суше и морю",
      "Подготовка: стандартизированная проверка, ремонт и предпродажная подготовка",
      "Модификация: переоборудование и кастомизация автомобилей",
      "Расчеты: гибкие платежные и финансовые решения",
      "Налоговый возврат: сервис экспортного возврата налогов",
      "Валюта и страхование: расчеты, L/C, кредитное страхование, финансирование заказов"
    ],
    exportVisuals: ["Закупка", "Склад", "Логистика", "Подготовка", "Модификация", "Расчеты", "Возврат налога", "Валюта / страхование"],
    exportShowcase: {
      title: "Возможности экспорта автомобилей",
      body: "Carmind поддерживает экспорт новых и подержанных автомобилей: закупка, склады, подготовка, логистика, расчеты, возврат налогов, валютные операции, страхование и цифровая координация.",
      newTitle: "Экспорт новых автомобилей",
      newBody: "Выбор в шоуруме, авторизованная поставка новых авто, подтверждение комплектации и координация зарубежной доставки.",
      usedTitle: "Экспорт подержанных автомобилей",
      usedBody: "Закупка подержанных авто, комплаенс-подготовка, проверка, переоформление, складирование и мультимаршрутная доставка.",
      flowTitle: "Единая платформа экспорта новых автомобилей",
      flowSide: "Восемь сервисов",
      exportModes: ["Новые авто напрямую от производителя", "Модифицированные авто", "Автомобили с нулевым пробегом"],
      serviceFlow: [
        ["Закупка", "Централизованная и агентская закупка"],
        ["Склад", "Зарубежные и пограничные склады"],
        ["Логистика", "Внутренняя, морская, сухопутная и ж/д"],
        ["Налог", "Экспортный возврат и налоговая поддержка"],
        ["Подготовка", "Проверка, ремонт и дооснащение"],
        ["Модификация", "Кастомные комплекты и аксессуары"],
        ["Расчеты", "Получение платежей, расчеты и финансирование"],
        ["Страхование", "Валюта и экспортное кредитное страхование"]
      ],
      outputs: ["Китайские малые и микропредприятия по экспорту автомобилей", "Зарубежные автотрейдеры"],
      outputTitle: "Клиенты",
      itSupport: "IT-поддержка: клиентское облако + складское облако + легкий workflow + многомерные операции",
      usedDiagram: {
        imageSrc: "/media/export/used-car-procurement-platform-ru.svg",
        title: "Ваш прозрачный доступ к подержанным автомобилям из Китая",
        customerTitle: "Зарубежные клиенты / дилеры",
        customerNeeds: "Запрос: модель / год / бюджет / количество / другие требования",
        leftSteps: ["Подтверждение запроса", "Сервисное соглашение"],
        benefits: ["Оптимальный план закупки", "Полное сопровождение"],
        promiseTitle: "Сервис без ценовой наценки",
        promises: ["Без маржи на цене авто", "Только фиксированная сервисная плата"],
        fee: "Фиксированная плата: 200 USD / заказ",
        centerTitle: "CARMIND",
        centerSub: "Прозрачная платформа закупки",
        sourceTitle: "Многоканальные источники авто",
        sourceSub: "Поиск более выгодных источников для клиентов",
        supplier: "Поставщики / каналы авто",
        sourceGroups: [
          {
            title: "Дилерские группы",
            subtitle: "Брендовые 4S-салоны / авторизованные группы",
            logos: ["Mercedes-Benz", "BMW", "Audi", "..."],
            points: ["Премиальные б/у", "Полные документы", "Хорошее состояние", "Прозрачная цена"]
          },
          {
            title: "Платформы авто",
            subtitle: "Основные и вертикальные платформы б/у авто",
            logos: ["Dongchedi", "Autohome", "Guazi", "..."],
            points: ["Много моделей", "AI-сравнение цен", "Актуальные авто", "Точный подбор"]
          },
          {
            title: "Такси / флит",
            subtitle: "Платформы такси / лизинг / операционные парки",
            logos: ["DiDi", "T3 Mobility", "Caocao", "..."],
            points: ["Партии авто", "Прозрачный пробег", "Высокая ценность", "Готово к экспорту"]
          }
        ]
      },
      brandWallTitle: "Мультибрендовая сеть поставок",
      brandWallBody: "Carmind работает с основными китайскими и мировыми брендами для потребностей зарубежных рынков.",
      brandNames: ["Hyundai", "Kia", "Toyota", "Honda", "BYD", "MG", "Jetour", "Li Auto", "Volkswagen", "Mercedes-Benz", "Nissan", "Mazda", "Hongqi", "NIO", "Leapmotor", "AITO", "Haval", "Geely", "Lynk & Co", "GAC", "Changan", "Avatr", "XPeng", "Tesla", "Great Wall", "Smart"]
    },
    afterTitle: "Сервисные решения для автомобилей новой энергии",
    afterItems: [
      "Поставка запчастей по VIN, OE-коду и модели",
      "Универсальная диагностика для основных NEV-систем",
      "Специализированное диагностическое оборудование для ключевых брендов",
      "Оборудование для проверки и обслуживания батарей",
      "Удаленная диагностика и программирование",
      "Онлайн- и офлайн-техническое обучение"
    ],
    afterVisuals: ["Запчасти", "Общая диагностика", "Бренд-диагностика", "Батареи", "Удаленная диагностика", "Обучение"],
    afterSystem: {
      title: "Система сервиса для автомобилей новой энергии",
      body: "Комплексная система для зарубежных сервисных партнеров: запчасти, диагностика, батареи, удаленная поддержка и обучение техников.",
      highlights: ["Подбор по VIN, OE-коду и модели", "Диагностика 95%+ основных NEV", "Удаленное программирование и практическое обучение"],
      solutionTitle: "Единые сервисные возможности",
      solutions: [
        {
          icon: "parts",
          title: "Система запчастей",
          body: "Поиск и подбор запчастей по VIN, OE-коду и модели для основных китайских NEV."
        },
        {
          icon: "diagnostic",
          title: "Общая диагностика",
          body: "Полносистемная диагностика для 95%+ основных моделей NEV с онлайн-обновлением."
        },
        {
          icon: "brandDiagnostic",
          title: "Брендовая диагностика",
          body: "Оборудование для BYD, Changan, Neta, Volkswagen, Honda, Toyota, BMW, Mercedes и других брендов."
        },
        {
          icon: "battery",
          title: "Оборудование для батарей",
          body: "Проверка герметичности, балансировка, заряд-разрядное обслуживание и сервис ячеек."
        },
        {
          icon: "remote",
          title: "Удаленная диагностика и программирование",
          body: "Трансграничная удаленная диагностика и программирование для зарубежных сервисных команд."
        },
        {
          icon: "training",
          title: "Система обучения",
          body: "Онлайн-курсы с английскими субтитрами и офлайн-практика для локальных техников."
        }
      ],
      platform: {
        title: "Единая платформа послепродажного сервиса",
        sideTitle: "Шесть зарубежных сервисных направлений",
        targetTitle: "Зарубежная сеть комплексных сервисов",
        targetMeta: "1,000+ легких сетевых партнеров",
        painTitle: "Три ключевые проблемы",
        pains: ["Нет запчастей", "Диагностика неисправностей", "Навык ремонта"],
        services: [
          ["Запчасти", "OEM, брендовые и разборные запчасти, подбор через EPC", "Облачная сеть запчастей", "Пограничные и зарубежные склады", "Нет запчастей"],
          ["ПО", "Поиск EPC встроен в общие диагностические устройства", "Диагностический вход", "Связь поиска запчастей с процессом сервиса", "Диагностика неисправностей"],
          ["Оборудование", "Общая и специализированная диагностика", "Матрица диагностических устройств", "Поиск системных неисправностей", "Диагностика неисправностей"],
          ["Батарея", "Полное решение ремонта батарей и повторного использования", "Сервис батарей", "Тест, балансировка, обслуживание, повторное использование", "Навык ремонта"],
          ["Удаленно", "Удаленная диагностика и программирование", "Экспертная поддержка", "Трансграничное решение сложных случаев", "Навык ремонта"],
          ["Обучение", "Онлайн- и офлайн-техническое обучение", "Система обучения", "Формирование локальных сервисных навыков", "Навык ремонта"]
        ]
      },
      partsSupply: {
        eyebrow: "Возможности поставки запчастей",
        title: "Поставка запчастей для автомобилей новой энергии",
        intro: "Carmind объединяет независимый сайт, EPC-поиск и трансграничные склады, чтобы зарубежные сервисные команды быстрее находили и получали запчасти NEV.",
        tabs: ["Ключевые слова", "VIN-код", "Номер детали", "Модель авто"],
        nav: ["Главная", "Авто", "Сервис", "О нас", "Контакты"],
        search: "Поиск",
        catalog: "Каталог брендов",
        cart: "Лист запроса",
        brands: ["BYD", "Li Auto", "NIO", "XPeng", "AITO", "Avatr", "Geely", "Changan", "Zeekr", "Great Wall", "Toyota", "BMW"],
        capabilities: [
          ["Покрытие моделей", "Поставка охватывает основные китайские модели NEV."],
          ["Точный поиск", "Поиск по VIN, OE-коду и модели; интеграция EPC покрывает 95% основных моделей."],
          ["Быстрая логистика", "Склады в Тяньцзине и Хоргосе, зарубежные склады в Дубае, Джибути и Иордании."]
        ],
        metrics: ["VIN", "OE", "95%+", "5 складов"]
      },
      batteryKit: {
        eyebrow: "Оборудование для батарей",
        title: "Комплект из четырех устройств для проверки и ремонта батарей",
        intro: "Портативное оборудование для проверки герметичности, балансировки батарейного блока, заряд-разрядного обслуживания и сервиса отдельных ячеек.",
        labels: ["Функция", "Ценность"],
        items: [
          ["Портативный тестер герметичности", "Проверяет герметичность силовой батарейной системы автомобиля.", "Предотвращает попадание пара, пыли и воды, снижая риски влаги, короткого замыкания и перегрева."],
          ["Портативный балансировщик батарейного блока", "Выравнивает напряжение и емкость батареи.", "Продлевает срок службы батареи, восстанавливает запас хода и повышает эффективность заряда-разряда."],
          ["Портативный заряд-разрядный обслуживатель блока", "Выполняет заряд, разряд и тест емкости батарейного блока.", "Повышает производительность, безопасность и точность оценки здоровья батареи."],
          ["Портативный обслуживатель отдельной ячейки", "Выполняет заряд-разряд, регулировку напряжения и тест емкости отдельной ячейки.", "Продлевает срок службы ячейки, повышает производительность и безопасность."]
        ]
      },
      cta: "Создать зарубежную сервисную способность NEV"
    },
    productGalleryTitle: "Продукты для модификации",
    productGalleryBody: "",
    products: {
      goldenOasis: ["Golden Oasis", "Комплект модификации Li Auto"],
      falconMecha: ["Falcon Mecha", "Комплект модификации Jetour Traveller"]
    },
    mapTitle: "Глобальная структура",
    mapBody: "Офисы и сервисные узлы нанесены по реальным широте и долготе. Линии показывают связи сервиса и не сдвигают города.",
    cultureTitle: "Культура",
    culture: [
      ["Видение", "Делать глобальных автомобильных партнеров лучше благодаря нашим усилиям."],
      ["Миссия", "Совершенствовать цепочку глобализации авто через технологии и взаимовыгодное сотрудничество."],
      ["Позиция", "Партнер по совместному экспорту автомобилей."],
      ["Обещание", "Эффективно, просто и надежно."],
      ["Ценности", "Честность, доброта, готовность экспериментировать и стойкость."]
    ],
    aboutTitle: "Наша команда",
    aboutBody: "Carmind — международный бизнес-бренд, основанный на возможностях UnityAuto / Huayi Chelian в Китае. Группа создана в Тяньцзине в 2002 году и развивает экспорт, склады, подготовку, модификацию, цифровые операции и сервис NEV.",
    partnersTitle: "Команда партнеров",
    portraitSlot: "Деловой портрет",
    orgTitle: "Организационная структура",
    org: {
      company: "UnityAuto / Huayi Chelian",
      ceoRole: "CEO",
      ceo: "Wayne",
      presidentRole: "Президент",
      president: "Nico",
      ownerLabel: "Ответственный",
      centers: [
        {
          title: "Центр роста клиентов",
          owner: "Nico",
          tone: "green",
          groups: [
            ["Восточная Африка", ["Эфиопия", "Джибути"]],
            ["Ближний Восток", ["ОАЭ", "Иордания"]],
            ["Центральная Азия", ["Развитие Центральной Азии"]],
            ["Китай", ["Команда Тяньцзиня", "Команда Гуандуна"]]
          ]
        },
        {
          title: "Центр цепочки поставок",
          owner: "Ryan",
          tone: "cyan",
          groups: [
            ["Поставка автомобилей", ["Команда поставок 1", "Команда поставок 2", "Команда поставок 3"]],
            ["Поставка для сервиса", ["Проект сервиса в Дубае", "Инновационный проект", "ПО и запчасти", "Запчасти и оборудование"]]
          ]
        },
        {
          title: "Финансовый shared center",
          owner: "Ryan",
          tone: "blue",
          groups: []
        },
        {
          title: "Администрация и HR",
          owner: "Wayne",
          tone: "slate",
          groups: []
        }
      ]
    },
    partners: {
      ceo: ["Wayne", "CEO"],
      president: ["Nico", "Президент"],
      africa: ["Alan", "Руководитель Африки"],
      centralAsia: ["Christ", "Руководитель Центральной Азии"],
      supply: ["Ryan", "Финансовый директор"]
    },
    contactTitle: "Контакты",
    contactBody: "Используйте email или телефон ниже, либо отправьте запрос через форму.",
    email: "Email",
    phone: "Телефон / WhatsApp",
    website: "Сайт",
    officesTitle: "Адреса офисов",
    form: {
      name: "Имя",
      company: "Компания",
      country: "Страна / Регион",
      email: "Email",
      phone: "WhatsApp / Телефон",
      service: "Интересующая услуга",
      message: "Сообщение",
      send: "Отправить запрос",
      options: ["Экспорт автомобилей", "Сервис NEV", "Запчасти", "Удаленная диагностика", "Обучение", "Другое"]
    },
    officeNames: {
      tianjin: "Тяньцзинь, Китай",
      shanghai: "Шанхай, Китай",
      guangzhou: "Гуанчжоу, Китай",
      horgos: "Хоргос, Китай",
      dubai: "Дубай, ОАЭ",
      tashkent: "Ташкент, Узбекистан",
      djibouti: "Джибути",
      jordan: "Иордания",
      iquique: "Икике, Чили",
      chancay: "Порт Чанкай, Перу",
      dominican: "Доминиканская Республика",
      ethiopia: "Эфиопия",
      algeria: "Алжир",
      lagos: "Лагос, Нигерия"
    }
  }
};

const afterDeepContent = {
  EN: {
    diagnostics: {
      eyebrow: "Diagnostics equipment",
      title: "General diagnostics + brand-specific diagnostics",
      intro:
        "A two-layer equipment matrix: one universal NEV diagnostic platform for broad coverage, plus dedicated OEM-level tools for key brands.",
      generalTitle: "General diagnostic platform",
      generalBadge: "E2S",
      generalPoints: ["95%+ mainstream NEV full-system coverage", "Online upgrades and battery fault data reading", "17 special functions including matching, reset, calibration, learning, and coding"],
      dedicatedTitle: "Dedicated diagnostic equipment",
      dedicatedIntro: "Brand tools for deeper service scenarios across Chinese, Japanese, German, and global brands.",
      products: ["BYD VDS2100", "Changan dedicated tool", "Neta dedicated tool", "Volkswagen VAS 6154A", "Honda HDS", "Toyota GTS+", "BMW ISTA", "Mercedes dedicated tool"]
    },
    dms: {
      eyebrow: "Software service",
      title: "Workshop DMS: online, data-driven, intelligent",
      intro:
        "A digital operating layer for overseas service centers, connecting reception, inspection, inventory, technicians, finance, training, and management reports.",
      pillars: [["HR", "Performance, attendance, recruiting"], ["Office automation", "Workflows, supplies, attendance"], ["Training", "Courses, scoring, certification"], ["Finance", "Payment, reimbursement, approval"]],
      flow: ["Vehicle recognition", "Walk-around inspection", "Mobile reception", "Warehouse scan", "Technician assistant", "Customer display", "Smart cashier", "Manager reports"]
    },
    remote: {
      eyebrow: "Remote service",
      title: "Remote diagnosis and programming",
      intro:
        "Overseas workshops connect vehicles through a remote diagnostic box, while Carmind engineers support diagnosis, programming, and difficult cases across borders.",
      nodes: ["Vehicle", "SmartLink box", "Secure cloud", "Engineer team", "OEM / dedicated tools"],
      diagnosisTitle: "Remote diagnosis",
      diagnosisBody: "Technicians use the remote box to access vehicle data and diagnose faults without waiting for on-site experts.",
      programTitle: "Remote programming",
      programBody: "The engineering team uses secure remote tunneling and local OEM tools to support programming and calibration."
    },
    training: {
      eyebrow: "Training system",
      title: "Online + offline NEV technical training",
      intro:
        "A training system designed for overseas teams: self-paced online courses with English subtitles plus offline practical sessions with customized curriculum.",
      onlineTitle: "Online training",
      offlineTitle: "Offline training",
      online: ["No on-site travel required", "English subtitle courses", "High-voltage battery and NEV repair modules"],
      offline: ["Customized practical training", "Practice with domestic NEV training institutions", "Assessment and completion ceremony"],
      curriculum: [["Day 1-3", "High-voltage safety and battery structure"], ["Day 4-7", "Battery fault analysis and replacement practice"], ["Day 8-11", "Balancing, charging, testing equipment"], ["Day 12-15", "Motor control, troubleshooting, final assessment"]]
    },
    workshop: {
      eyebrow: "Integrated workshop solution",
      title: "NEV repair station one-stop setup",
      intro:
        "A practical layout and equipment package for building local NEV repair capability, from reception to battery, electric drive, compressor, and safety operations.",
      zones: ["Reception", "Battery disassembly", "Battery maintenance", "Electric drive repair", "Compressor & motor repair", "Warehouse", "Insulated worktop"],
      equipment: [
        "Two-post lift",
        "Battery replacement moving lift",
        "Wrench",
        "Diagnostic instrument",
        "Battery cell charger and discharger",
        "Portable lithium battery balancer",
        "Battery module charger and discharger",
        "Battery charger / discharger and balancer all in one",
        "Battery pack charger and discharger",
        "Portable air leakage tester",
        "Garage cabinet",
        "Insulating tools",
        "Insulating mat",
        "Safety protection sets",
        "Test equipment",
        "Air conditioning compressor testing equipment",
        "Power drive motor test platform",
        "Explosion-proof container"
      ]
    }
  },
  中文: {
    diagnostics: {
      eyebrow: "检测设备能力",
      title: "通用检测设备 + 专用检测设备",
      intro: "用一套通用新能源诊断平台覆盖主流车型，再用品牌专检设备处理更深入的原厂级诊断和维修场景。",
      generalTitle: "通用检测设备",
      generalBadge: "E2S",
      generalPoints: ["覆盖 95%+ 主流新能源车型全系统", "支持在线升级，读取电池故障码、数据流和动态数据", "支持防盗匹配、ECU 复位、节气门匹配、旋变标定、齿讯学习、喷油嘴编码等特殊功能"],
      dedicatedTitle: "专用检测设备",
      dedicatedIntro: "覆盖大众、比亚迪、长安、哪吒、本田、丰田、宝马、奔驰等品牌原厂 / 专检设备。",
      products: ["比亚迪 VDS2100", "长安专检", "哪吒专检", "大众 VAS 6154A", "本田 HDS", "丰田 GTS+", "宝马 ISTA", "奔驰专检"]
    },
    dms: {
      eyebrow: "软件服务",
      title: "售后 DMS：维修厂管理在线化、数据化、智能化",
      intro: "把接车、环检、维修、仓储、收银、报表、培训、财务和人事流程连接起来，让海外维修站从工具能力升级为可运营的服务体系。",
      pillars: [["人事", "流程对接、绩效、考核、招聘"], ["办公自动化", "流程、办公用品、考勤"], ["培训", "课程、评分、认证"], ["财务", "报销、费用审批、结算"]],
      flow: ["车辆自动识别", "环车检查", "移动接车", "仓管扫码出入库", "维修技师助手", "客户休息区看板", "智能收银", "老板智能报表"]
    },
    remote: {
      eyebrow: "远程服务",
      title: "远程诊断 & 编程",
      intro: "海外维修站通过超级远程诊断盒连接车辆，Carmind 技师团队跨国提供诊断、远程编程和疑难问题支持。",
      nodes: ["任意车型", "SmartLink 远程诊断盒", "安全云连接", "技师团队", "原厂 / 专检仪"],
      diagnosisTitle: "远程诊断",
      diagnosisBody: "依托超级远程诊断盒，技师可跨国对客户车辆进行远程诊断，读取故障信息并判断维修方向。",
      programTitle: "远程编程",
      programBody: "技师团队通过远程网络连接，使用本地原厂 / 专检仪对客户车辆进行编程和标定支持。"
    },
    training: {
      eyebrow: "培训体系",
      title: "线上课程 + 线下实战培训",
      intro: "面向海外客户建立新能源维修能力：线上课程降低学习门槛，线下训练强化实操、排故和设备使用能力。",
      onlineTitle: "线上培训",
      offlineTitle: "线下培训",
      online: ["客户无需到现场即可学习新能源维修课程", "课程采用英文字幕教学，降低语言负担", "覆盖高压电池、驱动电机、整车系统等模块"],
      offline: ["与国内新能源维修培训机构合作", "专属定制新能源维修课程", "学员通过线下学习与实践完成考核"],
      curriculum: [["第 1-3 天", "高压安全、电池结构与基础拆装"], ["第 4-7 天", "电池故障分析、线束与电池包更换"], ["第 8-11 天", "均衡、充放电、检测设备实操"], ["第 12-15 天", "电机控制、故障检测、结业考核"]]
    },
    workshop: {
      eyebrow: "一体化方案",
      title: "新能源维修站一体化方案",
      intro: "从场地功能区规划到核心设备配置，帮助海外客户快速建立新能源维修、检测、培训和安全作业能力。",
      zones: ["接待区", "电池拆解区", "电池维护区", "电驱维修区", "压缩机与电机维修区", "仓储区", "绝缘工作台"],
      equipment: [
        "双柱举升机",
        "电池更换移动举升机",
        "扳手",
        "诊断仪",
        "单体电池充放电仪",
        "便携式锂电池均衡仪",
        "电池模组充放电仪",
        "充放电均衡一体机",
        "电池包充放电仪",
        "便携式气密性检测仪",
        "维修柜",
        "绝缘工具",
        "绝缘垫",
        "安全防护套装",
        "测试设备",
        "空调压缩机测试设备",
        "驱动电机测试平台",
        "防爆箱"
      ]
    }
  },
  العربية: {
    diagnostics: {
      eyebrow: "معدات التشخيص",
      title: "تشخيص عام + تشخيص مخصص للعلامات",
      intro: "طبقة عامة لتغطية أغلب مركبات الطاقة الجديدة، مع أدوات مخصصة للعلامات للحالات العميقة.",
      generalTitle: "منصة التشخيص العامة",
      generalBadge: "E2S",
      generalPoints: ["تغطية أكثر من 95% من الأنظمة الرئيسية", "تحديثات عبر الإنترنت وقراءة بيانات البطارية", "وظائف خاصة مثل المطابقة وإعادة الضبط والمعايرة"],
      dedicatedTitle: "معدات مخصصة للعلامات",
      dedicatedIntro: "أدوات مخصصة للعلامات الرئيسية وخدمات التشخيص المتقدمة.",
      products: ["BYD VDS2100", "Changan", "Neta", "Volkswagen VAS 6154A", "Honda HDS", "Toyota GTS+", "BMW ISTA", "Mercedes"]
    },
    dms: {
      eyebrow: "خدمة برمجية",
      title: "نظام DMS للورش: رقمي وذكي",
      intro: "طبقة تشغيلية تربط الاستقبال والفحص والمخزون والفنيين والمالية والتدريب والتقارير.",
      pillars: [["الموارد البشرية", "أداء وحضور وتوظيف"], ["الأتمتة المكتبية", "إجراءات ومستلزمات وحضور"], ["التدريب", "دورات وتقييم وشهادات"], ["المالية", "مدفوعات وموافقات"]],
      flow: ["تعرف المركبة", "فحص محيط السيارة", "استقبال متنقل", "مسح المخزون", "مساعد الفني", "شاشة العميل", "تحصيل ذكي", "تقارير الإدارة"]
    },
    remote: {
      eyebrow: "خدمة عن بعد",
      title: "تشخيص وبرمجة عن بعد",
      intro: "تتصل الورش الخارجية بالمركبات عبر صندوق تشخيص عن بعد، ويدعم مهندسو Carmind التشخيص والبرمجة.",
      nodes: ["مركبة", "SmartLink", "سحابة آمنة", "فريق هندسي", "أدوات OEM"],
      diagnosisTitle: "تشخيص عن بعد",
      diagnosisBody: "الوصول إلى بيانات السيارة وتشخيص الأعطال دون انتظار خبير في الموقع.",
      programTitle: "برمجة عن بعد",
      programBody: "استخدام اتصال آمن وأدوات محلية مخصصة لدعم البرمجة والمعايرة."
    },
    training: {
      eyebrow: "نظام التدريب",
      title: "تدريب إلكتروني وحضوري",
      intro: "نظام يبني مهارات فرق الخدمة الخارجية من خلال دورات مترجمة وتدريب عملي.",
      onlineTitle: "تدريب إلكتروني",
      offlineTitle: "تدريب حضوري",
      online: ["تعلم دون حضور للموقع", "دورات بترجمة إنجليزية", "وحدات بطارية عالية الجهد وأنظمة NEV"],
      offline: ["تدريب عملي مخصص", "تعاون مع مؤسسات تدريب صينية", "تقييم وشهادة إكمال"],
      curriculum: [["اليوم 1-3", "سلامة الجهد العالي وبنية البطارية"], ["اليوم 4-7", "تحليل الأعطال واستبدال البطارية"], ["اليوم 8-11", "الموازنة والشحن والاختبار"], ["اليوم 12-15", "تحكم المحرك والتقييم النهائي"]]
    },
    workshop: {
      eyebrow: "حل متكامل",
      title: "إعداد محطة صيانة NEV",
      intro: "تخطيط مناطق العمل وحزمة معدات لبناء قدرة صيانة محلية آمنة.",
      zones: ["الاستقبال", "تفكيك البطارية", "صيانة البطارية", "إصلاح المحرك الكهربائي", "ضاغط ومحرك", "المستودع", "منضدة معزولة"],
      equipment: [
        "رافعة عمودين",
        "رافعة نقل البطارية",
        "مفتاح ربط",
        "جهاز تشخيص",
        "شاحن ومفرغ خلية",
        "موازن بطارية ليثيوم محمول",
        "شاحن ومفرغ وحدة بطارية",
        "شاحن ومفرغ وموازن متكامل",
        "شاحن ومفرغ حزمة بطارية",
        "اختبار تسرب الهواء المحمول",
        "خزانة ورشة",
        "أدوات عزل",
        "حصيرة عزل",
        "معدات حماية السلامة",
        "معدات اختبار",
        "اختبار ضاغط التكييف",
        "منصة اختبار محرك الدفع",
        "حاوية مقاومة للانفجار"
      ]
    }
  },
  Русский: {
    diagnostics: {
      eyebrow: "Диагностическое оборудование",
      title: "Общая диагностика + брендовая диагностика",
      intro: "Двухуровневая матрица: универсальная NEV-платформа для широкого покрытия и OEM-инструменты для ключевых брендов.",
      generalTitle: "Общая диагностическая платформа",
      generalBadge: "E2S",
      generalPoints: ["95%+ покрытия основных NEV-систем", "Онлайн-обновления и чтение данных батареи", "17 спецфункций: адаптация, сброс, калибровка, обучение и кодирование"],
      dedicatedTitle: "Брендовая диагностика",
      dedicatedIntro: "Инструменты для глубоких сервисных сценариев по ключевым брендам.",
      products: ["BYD VDS2100", "Changan", "Neta", "Volkswagen VAS 6154A", "Honda HDS", "Toyota GTS+", "BMW ISTA", "Mercedes"]
    },
    dms: {
      eyebrow: "ПО для сервиса",
      title: "DMS для мастерской: онлайн, данные, интеллект",
      intro: "Операционный слой для зарубежных сервисов: приемка, осмотр, склад, техники, финансы, обучение и отчеты.",
      pillars: [["Кадры", "KPI, учет, найм"], ["Офис", "Процессы, снабжение, учет"], ["Обучение", "Курсы, оценка, сертификаты"], ["Финансы", "Оплата, компенсации, согласование"]],
      flow: ["Распознавание авто", "Осмотр", "Мобильная приемка", "Складской скан", "Помощник техника", "Экран клиента", "Умная касса", "Отчеты руководителя"]
    },
    remote: {
      eyebrow: "Удаленный сервис",
      title: "Удаленная диагностика и программирование",
      intro: "Зарубежные мастерские подключают автомобиль через удаленный диагностический блок, а инженеры Carmind помогают с диагностикой и программированием.",
      nodes: ["Автомобиль", "SmartLink", "Безопасное облако", "Инженеры", "OEM-инструменты"],
      diagnosisTitle: "Удаленная диагностика",
      diagnosisBody: "Доступ к данным автомобиля и диагностике без ожидания эксперта на месте.",
      programTitle: "Удаленное программирование",
      programBody: "Защищенный удаленный туннель и локальные OEM-инструменты для программирования и калибровки."
    },
    training: {
      eyebrow: "Система обучения",
      title: "Онлайн + офлайн обучение NEV",
      intro: "Система для зарубежных команд: онлайн-курсы с английскими субтитрами и практические занятия.",
      onlineTitle: "Онлайн обучение",
      offlineTitle: "Офлайн практика",
      online: ["Не требуется поездка на площадку", "Курсы с английскими субтитрами", "Модули по высоковольтной батарее и NEV"],
      offline: ["Индивидуальная практика", "Партнерство с китайскими учебными центрами", "Оценка и сертификат"],
      curriculum: [["День 1-3", "Высоковольтная безопасность и батарея"], ["День 4-7", "Анализ отказов и замена"], ["День 8-11", "Балансировка, заряд, тест"], ["День 12-15", "Управление мотором и финальная оценка"]]
    },
    workshop: {
      eyebrow: "Комплексное решение",
      title: "Комплексная станция ремонта NEV",
      intro: "Планировка зон и пакет оборудования для быстрой организации безопасного NEV-сервиса.",
      zones: ["Приемка", "Разбор батареи", "Обслуживание батареи", "Ремонт электропривода", "Компрессор и мотор", "Склад", "Изолированный стол"],
      equipment: [
        "Двухстоечный подъемник",
        "Передвижной подъемник батареи",
        "Гайковерт",
        "Диагностический прибор",
        "Заряд-разряд ячейки",
        "Портативный балансир литиевых батарей",
        "Заряд-разряд батарейного модуля",
        "Заряд-разряд и балансир 3-в-1",
        "Заряд-разряд батарейного блока",
        "Портативный тестер утечек",
        "Шкаф для мастерской",
        "Изолирующие инструменты",
        "Изолирующий коврик",
        "Комплект защиты",
        "Испытательное оборудование",
        "Тестер компрессора кондиционера",
        "Стенд испытания привода",
        "Взрывозащитный контейнер"
      ]
    }
  }
};

const languageKeys = Object.keys(translations);

function App() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === "en" ? "Carmind | Global Automotive Export" : `Carmind | ${t.heroTitle}`;
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
      { threshold: 0.16 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell" dir={t.dir}>
      <Header t={t} lang={lang} setLang={setLang} />
      <main>
        <Hero t={t} />
        <Culture t={t} />
        <Stats t={t} />
        <Services t={t} />
        <GlobalNetwork t={t} />
        <About t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}

function Header({ t, lang, setLang }) {
  const ids = ["home", "culture", "services", "network", "about", "contact"];
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Carmind home">
        <img className="brand-logo" src="/media/brand/carmind-logo.png" alt="Carmind" />
        <span className="brand-line">GLOBAL AUTOMOTIVE EXPORT</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {t.nav.map((item, index) => (
          <a key={item} href={`#${ids[index]}`}>
            {item}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Language switcher">
          {languageKeys.map((key) => (
            <button
              key={key}
              className={key === lang ? "active" : ""}
              type="button"
              onClick={() => setLang(key)}
            >
              {translations[key].code}
            </button>
          ))}
        </div>
        <a className="small-cta" href="#contact">
          {t.contactCta}
        </a>
      </div>
    </header>
  );
}

function Hero({ t }) {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy reveal">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
        <div className="powered-line">{t.powered}</div>
        <div className="hero-actions">
          <a className="primary-button" href="#services">
            {t.explore}
          </a>
          <a className="secondary-button" href="#contact">
            {t.contactCta}
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-label="Carmind modification product visual">
        <img src="/media/products/falcon-mecha-jetour-kit-optimized.jpg" alt="Carmind Falcon Mecha modification kit" />
      </div>
    </section>
  );
}

function Stats({ t }) {
  return (
    <section className="stats section">
      <div className="section-heading">
        <h2>{t.statsTitle}</h2>
      </div>
      <div className="stats-grid">
        {t.stats.map(([value, label]) => (
          <div className="stat-card reveal" key={label}>
            <AnimatedStatValue value={value} />
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimatedStatValue({ value }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const rawValue = String(value);
    const target = Number(rawValue.replace(/[^\d]/g, ""));
    const hasPlus = rawValue.includes("+");
    let frameId = 0;
    let startedAt = 0;
    let hasAnimated = false;
    const duration = 1400;
    const formatValue = (nextValue) => `${Math.round(nextValue).toLocaleString("en-US")}${hasPlus ? "+" : ""}`;

    const run = (timestamp) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(formatValue(target * eased));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(run);
      }
    };

    const start = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      frameId = window.requestAnimationFrame(run);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(formatValue(target));
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span ref={ref} className="stat-value animated-stat" aria-label={String(value)}>
      {displayValue}
    </span>
  );
}

function Services({ t }) {
  const exportIcons = ["sourcing", "storage", "transport", "preparation", "modification", "settlement", "tax", "insurance"];
  const afterIcons = ["parts", "diagnostic", "brandDiagnostic", "battery", "remote", "training"];

  return (
    <section className="services section" id="services">
      <div className="section-heading wide">
        <h2>{t.servicesTitle}</h2>
        <p>{t.servicesBody}</p>
      </div>
      <div className="service-columns">
        <ServicePanel
          title={t.exportTitle}
          number="01"
          visuals={t.exportVisuals.map((label, index) => ({ label, icon: exportIcons[index] }))}
        />
        <ServicePanel
          title={t.afterTitle}
          number="02"
          visuals={t.afterVisuals.map((label, index) => ({ label, icon: afterIcons[index] }))}
        />
      </div>
      <AutomotiveExportShowcase t={t} />
      <AfterSalesSystem t={t} />
      <ProductShowcase t={t} />
    </section>
  );
}

function ServicePanel({ title, number, visuals }) {
  return (
    <article className={`service-panel interactive reveal ${visuals.length === 6 ? "six" : ""}`}>
      <div className="panel-head">
        <span>{number}</span>
        <h3>{title}</h3>
      </div>
      <div className="service-visual-grid">
        {visuals.map((item) => (
          <div className="service-visual-card" key={item.label}>
            <ServiceIcon name={item.icon} />
            <strong>{item.label}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function AutomotiveExportShowcase({ t }) {
  const showcase = t.exportShowcase;
  const modeTags = showcase.exportModes.slice(0, 5);

  return (
    <section className="auto-export-showcase reveal" aria-labelledby="auto-export-title">
      <div className="export-showcase-head">
        <span>Automotive Export</span>
        <h3 id="auto-export-title">{showcase.title}</h3>
        <p>{showcase.body}</p>
      </div>

      <div className="export-segment-grid">
        <article className="export-segment-card">
          <div className="export-segment-media showroom">
            <img src="/media/export/dubai-showroom.jpg" alt={showcase.newTitle} loading="lazy" />
          </div>
          <div className="export-segment-copy">
            <span>01</span>
            <h4>{showcase.newTitle}</h4>
            <p>{showcase.newBody}</p>
          </div>
        </article>

        <article className="export-segment-card">
          <div className="export-segment-media port">
            <img src="/media/export/used-car-export-port-clean.png" alt={showcase.usedTitle} loading="lazy" />
          </div>
          <div className="export-segment-copy">
            <span>02</span>
            <h4>{showcase.usedTitle}</h4>
            <p>{showcase.usedBody}</p>
          </div>
        </article>
      </div>

      <UsedCarProcurementDiagram data={showcase.usedDiagram} dir={t.dir} />

      <div className="export-process-board" dir={t.dir}>
        <div className="export-process-title">{showcase.flowTitle}</div>
        <div className="export-process-body">
          <aside className="export-process-side">
            <span>08</span>
            <strong>{showcase.flowSide}</strong>
          </aside>
          <div className="export-process-services">
            <div className="export-mode-strip">
              {modeTags.map((mode) => (
                <span key={mode}>{mode}</span>
              ))}
            </div>
            {showcase.serviceFlow.map(([name, detail], index) => (
              <div className="export-process-row" key={`${name}-${detail}`}>
                <span className="export-row-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <div className="export-process-connector" aria-hidden="true">
            {showcase.outputs.map((output) => (
              <span key={output} />
            ))}
          </div>
          <div className="export-output-stack" aria-label={showcase.outputTitle}>
            <strong className="export-output-title">{showcase.outputTitle}</strong>
            {showcase.outputs.map((output, index) => (
              <span className="export-output-item" key={output}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{output}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

function UsedCarProcurementDiagram({ data, dir = "ltr" }) {
  return (
    <figure className="used-car-diagram used-car-procurement-board" aria-label={data.title} dir={dir}>
      <figcaption>{data.title}</figcaption>
      <div className="used-diagram-top">
        <div className="used-customer-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <h4>{data.customerTitle}</h4>
          <p>{data.customerNeeds}</p>
        </div>
      </div>
      <div className="used-diagram-main">
        <div className="used-side-notes">
          {data.leftSteps.map((step, index) => (
            <span key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              {step}
            </span>
          ))}
        </div>
        <div className="used-platform-stage">
          <div className="used-platform-core">
            <span className="used-core-arrow top" />
            <span className="used-core-arrow right" />
            <span className="used-core-arrow bottom" />
            <strong>{data.centerTitle}</strong>
            <small>{data.centerSub}</small>
          </div>
          <div className="used-benefits">
            {data.benefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
        </div>
        <aside className="used-promise">
          <h5>{data.promiseTitle}</h5>
          {data.promises.map((promise) => (
            <span key={promise}>{promise}</span>
          ))}
          <strong>{data.fee}</strong>
        </aside>
      </div>
      <div className="used-source-title">
        <strong>{data.sourceTitle}</strong>
        <span>{data.sourceSub}</span>
      </div>
      <div className="used-source-grid">
        {data.sourceGroups.map((group, index) => (
          <article className="used-source-card" key={group.title}>
            <div className="used-source-index">{index + 1}</div>
            <h5>{group.title}</h5>
            <p>{group.subtitle}</p>
            <div className="used-logo-row">
              {group.logos.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
            <div className="used-point-grid">
              {group.points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="used-supplier-strip">{data.supplier}</div>
    </figure>
  );
}

function ServiceIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.1",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const icons = {
    sourcing: (
      <>
        <path {...common} d="M7 10h10l2 4v6H5v-6l2-4Z" />
        <path {...common} d="M8 10V7h8v3" />
        <path {...common} d="M9 17h.01M15 17h.01" />
      </>
    ),
    storage: (
      <>
        <path {...common} d="M4 10 12 6l8 4v10H4V10Z" />
        <path {...common} d="M7 13h10M7 16h10" />
      </>
    ),
    transport: (
      <>
        <path {...common} d="M4 15h11l3-4h2v7H4v-3Z" />
        <circle {...common} cx="8" cy="19" r="1.7" />
        <circle {...common} cx="17" cy="19" r="1.7" />
        <path {...common} d="M7 11h5" />
      </>
    ),
    preparation: (
      <>
        <path {...common} d="m6 15 4 4L20 8" />
        <path {...common} d="M5 7h8M5 11h6" />
      </>
    ),
    modification: (
      <>
        <path {...common} d="M14 5 5 14v5h5l9-9-5-5Z" />
        <path {...common} d="m12 7 5 5" />
      </>
    ),
    settlement: (
      <>
        <rect {...common} x="4" y="7" width="16" height="12" rx="2" />
        <path {...common} d="M4 11h16M8 15h3" />
      </>
    ),
    tax: (
      <>
        <path {...common} d="M7 5h10v14H7z" />
        <path {...common} d="M9 9h6M9 13h6M9 17h3" />
      </>
    ),
    insurance: (
      <>
        <path {...common} d="M12 4 19 7v5c0 4-2.8 6.5-7 8-4.2-1.5-7-4-7-8V7l7-3Z" />
        <path {...common} d="m9 12 2 2 4-5" />
      </>
    ),
    parts: (
      <>
        <path {...common} d="M8 7h8v10H8z" />
        <path {...common} d="M5 10h3M16 10h3M5 14h3M16 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
      </>
    ),
    diagnostic: (
      <>
        <rect {...common} x="5" y="6" width="14" height="12" rx="2" />
        <path {...common} d="M8 14h3l2-4 2 4h1" />
      </>
    ),
    brandDiagnostic: (
      <>
        <circle {...common} cx="12" cy="12" r="6" />
        <path {...common} d="M12 8v4l3 2" />
        <path {...common} d="M4 20h16" />
      </>
    ),
    battery: (
      <>
        <rect {...common} x="4" y="8" width="15" height="8" rx="2" />
        <path {...common} d="M19 11h1v2h-1M9 10l-2 3h3l-2 3" />
      </>
    ),
    remote: (
      <>
        <path {...common} d="M7 17h10V7H7v10Z" />
        <path {...common} d="M10 20h4M9 4c2-1.3 4.7-1.3 6 0M6 2c3.5-2 8.5-2 12 0" />
      </>
    ),
    training: (
      <>
        <path {...common} d="M4 8h16v10H4z" />
        <path {...common} d="m8 12 3 2 5-4M8 21h8" />
      </>
    ),
    scanner: (
      <>
        <rect {...common} x="6" y="4" width="12" height="16" rx="3" />
        <path {...common} d="M9 8h6M9 12h6M10 16h4" />
        <path {...common} d="M4 7v3M20 7v3M4 14v3M20 14v3" />
      </>
    ),
    software: (
      <>
        <rect {...common} x="4" y="5" width="16" height="12" rx="2" />
        <path {...common} d="M8 21h8M12 17v4M8 9h3M8 13h8" />
      </>
    ),
    team: (
      <>
        <circle {...common} cx="12" cy="8" r="3" />
        <path {...common} d="M6 20c.8-3 3-5 6-5s5.2 2 6 5" />
        <path {...common} d="M5 12a2.2 2.2 0 1 0 0-4M19 8a2.2 2.2 0 1 1 0 4" />
      </>
    ),
    finance: (
      <>
        <path {...common} d="M12 4v16M8 8.5c0-1.4 1.5-2.5 4-2.5s4 1.1 4 2.5-1 2-4 2.5-4 1.1-4 2.5 1.5 2.5 4 2.5 4-1.1 4-2.5" />
        <path {...common} d="M5 20h14" />
      </>
    ),
    cloud: (
      <>
        <path {...common} d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.3 8.2 4.8 4.8 0 0 0 7 18Z" />
        <path {...common} d="m9 13 3-3 3 3M12 10v6" />
      </>
    ),
    garage: (
      <>
        <path {...common} d="M4 11 12 5l8 6v9H4v-9Z" />
        <path {...common} d="M8 20v-6h8v6M8 16h8" />
      </>
    )
  };

  return (
    <svg className="service-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.sourcing}
    </svg>
  );
}

function AfterSalesSystem({ t }) {
  const system = t.afterSystem;
  const deep = afterDeepContent[t.code] || afterDeepContent.EN;

  return (
    <section className="after-system reveal" aria-labelledby="after-system-title">
      <div className="after-system-hero">
        <div>
          <h3 id="after-system-title">{system.title}</h3>
          <p>{system.body}</p>
          <div className="after-highlights">
            {system.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="after-hero-panel" aria-hidden="true">
          <div className="after-hero-visual-art">
            <div className="after-art-grid" />
            <div className="after-art-car">
              <span />
              <span />
            </div>
            <div className="after-art-device">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="after-art-battery">
              <i />
              <i />
              <i />
            </div>
            <div className="after-art-cloud">
              <ServiceIcon name="cloud" />
            </div>
            <div className="after-art-route route-one" />
            <div className="after-art-route route-two" />
          </div>
          <div className="after-hero-caption">
            <ServiceIcon name="diagnostic" />
            <strong>NEV</strong>
            <span>{system.cta}</span>
          </div>
        </div>
      </div>

      <AfterServicePlatform platform={system.platform} />
      <PartsSupplyShowcase parts={system.partsSupply} />
      <DmsSoftwareShowcase dms={deep.dms} />
      <DiagnosticEquipmentShowcase diagnostics={deep.diagnostics} />
      <BatteryEquipmentShowcase kit={system.batteryKit} />
      <RemoteProgrammingShowcase remote={deep.remote} />
      <TrainingSystemShowcase training={deep.training} />
      <WorkshopSolutionShowcase workshop={deep.workshop} />

      <div className="after-section-title">
        <h4>{system.solutionTitle}</h4>
      </div>
      <div className="after-solutions-grid">
        {system.solutions.map((item) => (
          <article className="after-solution-card" key={item.title}>
            <ServiceIcon name={item.icon} />
            <h5>{item.title}</h5>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

    </section>
  );
}

function DiagnosticEquipmentShowcase({ diagnostics }) {
  return (
    <section className="diagnostic-showcase capability-module" aria-labelledby="diagnostic-showcase-title">
      <div className="capability-copy">
        <span className="parts-eyebrow">{diagnostics.eyebrow}</span>
        <h4 id="diagnostic-showcase-title">{diagnostics.title}</h4>
        <p>{diagnostics.intro}</p>
      </div>
      <div className="diagnostic-layout">
        <article className="general-diagnostic-card">
          <div>
            <span className="module-badge">{diagnostics.generalBadge}</span>
            <h5>{diagnostics.generalTitle}</h5>
          </div>
          <div className="diagnostic-device" aria-hidden="true">
            <div className="device-screen">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="device-dongle" />
          </div>
          <ul>
            {diagnostics.generalPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
        <article className="dedicated-diagnostic-card">
          <h5>{diagnostics.dedicatedTitle}</h5>
          <p>{diagnostics.dedicatedIntro}</p>
          <div className="dedicated-product-grid">
            {diagnostics.products.map((product) => (
              <div className="dedicated-product" key={product}>
                <ServiceIcon name="scanner" />
                <strong>{product}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function DmsSoftwareShowcase({ dms }) {
  return (
    <section className="dms-showcase capability-module" aria-labelledby="dms-showcase-title">
      <div className="capability-copy">
        <span className="parts-eyebrow">{dms.eyebrow}</span>
        <h4 id="dms-showcase-title">{dms.title}</h4>
        <p>{dms.intro}</p>
      </div>
      <div className="dms-pillar-grid">
        {dms.pillars.map(([title, body], index) => (
          <article className="dms-pillar" key={title}>
            <ServiceIcon name={["team", "software", "training", "finance"][index]} />
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </div>
      <div className="dms-flow">
        {dms.flow.map((step, index) => (
          <div className="dms-flow-step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function RemoteProgrammingShowcase({ remote }) {
  return (
    <section className="remote-showcase capability-module" aria-labelledby="remote-showcase-title">
      <div className="capability-copy">
        <span className="parts-eyebrow">{remote.eyebrow}</span>
        <h4 id="remote-showcase-title">{remote.title}</h4>
        <p>{remote.intro}</p>
      </div>
      <div className="remote-diagram">
        {remote.nodes.map((node, index) => (
          <div className="remote-node" key={node}>
            <ServiceIcon name={["sourcing", "scanner", "cloud", "team", "diagnostic"][index]} />
            <strong>{node}</strong>
          </div>
        ))}
      </div>
      <div className="remote-copy-grid">
        <article>
          <h5>{remote.diagnosisTitle}</h5>
          <p>{remote.diagnosisBody}</p>
        </article>
        <article>
          <h5>{remote.programTitle}</h5>
          <p>{remote.programBody}</p>
        </article>
      </div>
    </section>
  );
}

function TrainingSystemShowcase({ training }) {
  const trainingMedia = [
    {
      src: "/media/training/training-platform.jpg",
      title: training.onlineTitle,
      body: training.online.join(" · ")
    },
    {
      src: "/media/training/training-curriculum-table.jpg",
      title: training.offlineTitle,
      body: training.offline.join(" · ")
    }
  ];
  const practicePhotos = [
    "/media/training/training-practice-vehicle.jpg",
    "/media/training/training-practice-motor.jpg",
    "/media/training/training-practice-battery.jpg",
    "/media/training/training-practice-equalizer.jpg",
    "/media/training/training-practice-operation.jpg",
    "/media/training/training-practice-summary.jpg"
  ];

  return (
    <section className="training-showcase capability-module" aria-labelledby="training-showcase-title">
      <div className="capability-copy">
        <span className="parts-eyebrow">{training.eyebrow}</span>
        <h4 id="training-showcase-title">{training.title}</h4>
        <p>{training.intro}</p>
      </div>
      <div className="training-layout">
        {trainingMedia.map((media, index) => (
          <figure className={`training-media-card training-media-${index + 1}`} key={media.src}>
            <img src={media.src} alt={media.title} loading="lazy" />
            <figcaption>
              <ServiceIcon name={index === 0 ? "software" : "training"} />
              <strong>{media.title}</strong>
              <span>{media.body}</span>
            </figcaption>
          </figure>
        ))}
        <div className="training-photo-wall" aria-label={training.offlineTitle}>
          {practicePhotos.map((src, index) => (
            <figure className="training-photo" key={src}>
              <img src={src} alt={`${training.offlineTitle} ${index + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopSolutionShowcase({ workshop }) {
  return (
    <section className="workshop-showcase capability-module" aria-labelledby="workshop-showcase-title">
      <div className="capability-copy">
        <span className="parts-eyebrow">{workshop.eyebrow}</span>
        <h4 id="workshop-showcase-title">{workshop.title}</h4>
        <p>{workshop.intro}</p>
      </div>
      <figure className="workshop-original-figure" aria-label={workshop.title}>
        <img src="/media/pdf-assets/nev-workshop-solution-no-title.png" alt={workshop.title} loading="lazy" />
      </figure>
    </section>
  );
}

function BatteryEquipmentShowcase({ kit }) {
  const deviceImages = [
    "/media/equipment/battery-air-tightness-tester.jpg",
    "/media/equipment/battery-pack-balancer.jpg",
    "/media/equipment/battery-pack-charger-discharger.jpg",
    "/media/equipment/single-cell-battery-maintainer.jpg"
  ];

  return (
    <section className="battery-kit-showcase" aria-labelledby="battery-kit-title">
      <div className="battery-kit-copy">
        <span className="parts-eyebrow">{kit.eyebrow}</span>
        <h4 id="battery-kit-title">{kit.title}</h4>
        <p>{kit.intro}</p>
      </div>
      <div className="battery-kit-visual" aria-label={kit.title}>
        <div className="battery-device-board">
          {kit.items.map(([name], index) => (
            <div className={`battery-device-tile device-type-${index + 1}`} key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="battery-device-media">
                <img src={deviceImages[index]} alt={name} loading="lazy" />
              </div>
              <strong>{name}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="battery-kit-grid">
        {kit.items.map(([name, functionText, valueText], index) => (
          <article className="battery-kit-card" key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <ServiceIcon name={index === 0 ? "insurance" : "battery"} />
            <h5>{name}</h5>
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

function PartsSupplyShowcase({ parts }) {
  return (
    <section className="parts-supply-showcase" aria-labelledby="parts-supply-title">
      <div className="parts-site-visual" aria-label={parts.title}>
        <div className="browser-ghost ghost-one" />
        <div className="browser-ghost ghost-two" />
        <div className="parts-browser">
          <div className="browser-bar">
            <strong>CARMIND</strong>
            <nav>
              {parts.nav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </nav>
          </div>
          <div className="parts-search">
            <div className="parts-tabs">
              {parts.tabs.map((tab, index) => (
                <span className={index === 1 ? "active" : ""} key={tab}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="search-row">
              <span>LVVDB21B7ND******</span>
              <button type="button">{parts.search}</button>
            </div>
          </div>
          <div className="parts-catalog">
            <div className="catalog-head">
              <strong>{parts.catalog}</strong>
              <span>{parts.cart}</span>
            </div>
            <div className="brand-grid">
              {parts.brands.map((brand) => (
                <span key={brand}>{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="parts-copy">
        <span className="parts-eyebrow">{parts.eyebrow}</span>
        <h4 id="parts-supply-title">{parts.title}</h4>
        <p>{parts.intro}</p>
        <div className="parts-metrics">
          {parts.metrics.map((metric) => (
            <strong key={metric}>{metric}</strong>
          ))}
        </div>
        <div className="parts-capability-list">
          {parts.capabilities.map(([title, body]) => (
            <article key={title}>
              <ServiceIcon name={title.includes("物流") || title.toLowerCase().includes("logistics") || title.includes("لوجستيات") || title.toLowerCase().includes("логистика") ? "transport" : "parts"} />
              <div>
                <h5>{title}</h5>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AfterServicePlatform({ platform }) {
  const iconNames = ["parts", "remote", "diagnostic", "battery", "brandDiagnostic", "training"];

  return (
    <section className="after-platform" aria-labelledby="after-platform-title">
      <div className="after-platform-title">
        <h4 id="after-platform-title">{platform.title}</h4>
      </div>
      <div className="after-platform-grid">
        <aside className="platform-side">
          <span>{platform.sideTitle}</span>
          <strong>6</strong>
        </aside>
        <div className="platform-service-stack">
          {platform.services.map(([name, detail, engine, flow, pain], index) => (
            <article className="platform-service-row" key={name}>
              <div className="platform-service-name">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ServiceIcon name={iconNames[index]} />
                <strong>{name}</strong>
              </div>
              <div className="platform-service-flow">
                <p>{detail}</p>
                <div className="platform-engine">{engine}</div>
                <p>{flow}</p>
              </div>
              <div className="platform-pain-chip">{pain}</div>
            </article>
          ))}
        </div>
        <aside className="platform-outcome">
          <span>{platform.painTitle}</span>
          <div className="platform-pain-list">
            {platform.pains.map((pain) => (
              <strong key={pain}>{pain}</strong>
            ))}
          </div>
          <div className="platform-repair-node">
            <b>{platform.targetTitle}</b>
            <small>{platform.targetMeta}</small>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProductShowcase({ t }) {
  return (
    <section className="product-showcase reveal" aria-labelledby="product-showcase-title">
      <div className="product-intro">
        <h3 id="product-showcase-title">{t.productGalleryTitle}</h3>
        {t.productGalleryBody ? <p>{t.productGalleryBody}</p> : null}
      </div>
      <div className="product-grid">
        {productProducts.map((product) => (
          <article className="product-card" key={product.key}>
            <img src={product.image} alt={t.products[product.key][0]} loading="lazy" />
            <div>
              <strong>{t.products[product.key][0]}</strong>
              <span>{t.products[product.key][1]}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GlobalNetwork({ t }) {
  const width = 980;
  const height = 460;
  const land = useMemo(() => feature(worldData, worldData.objects.land), []);
  const mapLocations = useMemo(() => [...offices, ...tradeNodes], []);
  const projection = useMemo(
    () => geoNaturalEarth1().fitExtent([[20, 20], [width - 20, height - 20]], land),
    [land]
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const projected = mapLocations.map((location) => ({
    ...location,
    point: projection([location.lon, location.lat])
  }));
  const projectedByKey = Object.fromEntries(projected.map((location) => [location.key, location]));
  const hubs = ["tianjin", "shanghai", "guangzhou", "horgos"];
  const serviceRoutes = projected
    .filter((location) => !hubs.includes(location.key) && !location.routeType)
    .flatMap((target) =>
      projected
        .filter((location) => location.key === "shanghai" || location.key === "guangzhou")
        .map((origin) => ({ from: origin, to: target, type: "service" }))
    );
  const seaRoutes = tradeNodes
    .map((node) => projectedByKey[node.key])
    .filter(Boolean)
    .map((target) => ({ from: projectedByKey.guangzhou, to: target, type: "sea" }));
  const routes = [...serviceRoutes, ...seaRoutes];

  const makeArc = (from, to, lift = 44) =>
    `M ${from.point[0]} ${from.point[1]} Q ${(from.point[0] + to.point[0]) / 2} ${Math.min(from.point[1], to.point[1]) - lift} ${to.point[0]} ${to.point[1]}`;
  const routePaths = routes.flatMap((route) => {
    const crossesPacific = route.type === "sea" && route.from.lon > 90 && route.to.lon < -50;
    if (!crossesPacific) {
      return [{ ...route, key: `${route.from.key}-${route.to.key}`, d: makeArc(route.from, route.to, route.type === "sea" ? 58 : 44) }];
    }

    const sharedLat = (route.from.lat + route.to.lat) / 2;
    const eastEdge = {
      ...route.to,
      key: `${route.to.key}-east-edge`,
      point: projection([178, sharedLat])
    };
    const westEdge = {
      ...route.to,
      key: `${route.to.key}-west-edge`,
      point: projection([-178, sharedLat])
    };

    return [
      { ...route, key: `${route.from.key}-${route.to.key}-pacific-a`, d: makeArc(route.from, eastEdge, 62) },
      { ...route, from: westEdge, key: `${route.from.key}-${route.to.key}-pacific-b`, d: makeArc(westEdge, route.to, 34) }
    ];
  });

  return (
    <section className="network section" id="network">
      <div className="section-heading wide">
        <h2>{t.mapTitle}</h2>
        <p>{t.mapBody}</p>
      </div>
      <div className="map-shell reveal">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.mapTitle}>
          <path className="land" d={path(land)} />
          {routePaths.map((route) => (
            <path
              className={`route ${route.type === "sea" ? "sea-route" : ""}`}
              key={route.key}
              d={route.d}
            />
          ))}
          {projected.map((office) => (
            <g
              key={office.key}
              className={`node ${office.routeType === "sea" ? "trade-node" : ""}`}
              transform={`translate(${office.point[0]},${office.point[1]})`}
            >
              <circle className="pulse" r="12" />
              <circle r="4.8" />
              <text x={office.label[0]} y={office.label[1]} textAnchor={office.label[2]}>
                {t.officeNames[office.key]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function Culture({ t }) {
  return (
    <section className="culture section" id="culture">
      <div className="section-heading">
        <h2>{t.cultureTitle}</h2>
      </div>
      <div className="culture-grid">
        {t.culture.map(([name, body]) => (
          <article className="culture-item reveal" key={name}>
            <h3>{name}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section className="about section" id="about">
      <div className="about-copy reveal">
        <h2>{t.aboutTitle}</h2>
        <p>{t.aboutBody}</p>
      </div>
      <OrgChart t={t} />
      <div className="partners">
        <h3>{t.partnersTitle}</h3>
        <div className="partner-grid">
          {partners.map((partner) => (
            <article className="partner-card reveal" key={partner.key}>
              <div className="partner-photo">
                <img src={partner.image} alt="" onError={(event) => event.currentTarget.remove()} />
                <span>{t.portraitSlot}</span>
              </div>
              <div className="partner-meta">
                <strong>{t.partners[partner.key][0]}</strong>
                <span>{t.partners[partner.key][1]}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrgChart({ t }) {
  const org = t.org;

  return (
    <section className="org-chart reveal" aria-labelledby="org-chart-title">
      <h3 id="org-chart-title">{t.orgTitle}</h3>
      <div className="org-leadership">
        <div className="org-node org-company">
          <span>{org.company}</span>
          <strong>{org.ceoRole}: {org.ceo}</strong>
        </div>
        <div className="org-connector" aria-hidden="true" />
        <div className="org-node org-president">
          <span>{org.presidentRole}</span>
          <strong>{org.president}</strong>
        </div>
      </div>
      <div className="org-centers">
        {org.centers.map((center) => (
          <article className={`org-center ${center.tone}`} key={center.title}>
            <div className="org-center-head">
              <h4>{center.title}</h4>
            </div>
            <div className="org-group-grid">
              {center.groups.map(([group, units]) => (
                <div className="org-group" key={group}>
                  <strong>{group}</strong>
                  <ul>
                    {units.map((unit) => (
                      <li key={unit}>{unit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact({ t }) {
  return (
    <section className="contact section" id="contact">
      <div className="section-heading wide">
        <h2>{t.contactTitle}</h2>
        <p>{t.contactBody}</p>
      </div>
      <div className="contact-layout">
      <div className="contact-panel reveal">
        <ContactLine label={t.email} value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
        <ContactLine label={t.phone} value={CONTACT.phone} href={`https://wa.me/${CONTACT.whatsapp}`} />
        <ContactLine label={t.website} value={CONTACT.website} href="https://www.carmindglobal.com" />
      </div>
        <form className="inquiry-form reveal" name="carmind-inquiry" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="carmind-inquiry" />
          <label>
            {t.form.name}
            <input name="name" type="text" required />
          </label>
          <label>
            {t.form.company}
            <input name="company" type="text" />
          </label>
          <label>
            {t.form.country}
            <input name="country" type="text" />
          </label>
          <label>
            {t.form.email}
            <input name="email" type="email" required />
          </label>
          <label>
            {t.form.phone}
            <input name="phone" type="text" />
          </label>
          <label>
            {t.form.service}
            <select name="service">
              {t.form.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="full">
            {t.form.message}
            <textarea name="message" rows="4" />
          </label>
          <button className="primary-button full" type="submit">
            {t.form.send}
          </button>
        </form>
      </div>
      <div className="office-section">
        <h3>{t.officesTitle}</h3>
        <div className="office-grid">
          {offices.map((office) => (
            <article className="office-card" key={office.key}>
              <h4>{t.officeNames[office.key]}</h4>
              <p>{t.officeAddresses?.[office.key] ?? office.address}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactLine({ label, value, href }) {
  return (
    <a className="contact-line" href={href}>
      <span>{label}</span>
      <strong>{value}</strong>
    </a>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <img src="/media/brand/carmind-logo.png" alt="Carmind" />
      <span>{t.powered}</span>
      <span>{CONTACT.website}</span>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(
  <SiteApp
    data={{
      translations,
      offices,
      tradeNodes,
      partners,
      productProducts,
      afterDeepContent,
      CONTACT
    }}
  />
);
