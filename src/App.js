import { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_IHXMikJViY1nKa03zSFffmzFVer2ZIc",
  authDomain: "droplite-e1132.firebaseapp.com",
  projectId: "droplite-e1132",
  storageBucket: "droplite-e1132.firebasestorage.app",
  messagingSenderId: "892399912731",
  appId: "1:892399912731:web:56ce4752e20472dfd4b5be",
};
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);

/* ═══════════════════ DESIGN TOKENS ═══════════════════ */
const T = {
  bg: "#08090E",
  sidebar: "#0C0D14",
  surface: "#0F1019",
  card: "#12131F",
  elevated: "#1A1B2A",
  border: "rgba(255,255,255,0.06)",
  gold: "#CFAB3B",
  goldLight: "#F2D978",
  green: "#2DD4A0",
  red: "#EF6461",
  blue: "#5BA4F5",
  cyan: "#22D3EE",
  txt: "#EEEAE0",
  sub: "rgba(238,234,224,0.55)",
  dim: "rgba(238,234,224,0.22)",
  ff: "'Sora', sans-serif",
  fm: "'JetBrains Mono', monospace",
  fd: "'Playfair Display', serif",
};

const GOLD_GRADIENT = "linear-gradient(135deg, #CFAB3B, #F2D978 50%, #CFAB3B)";

/* ═══════════════════ PLATFORMS ═══════════════════ */
const PLATFORMS = ["TikTok", "Instagram", "Facebook", "Pinterest", "Snapchat", "YouTube", "X"];

const PLATFORM_COLORS = {
  TikTok: "#FF0050", Instagram: "#E1306C", Facebook: "#1877F2",
  Pinterest: "#E60023", Snapchat: "#FFFC00", YouTube: "#FF0000", X: "#1DA1F2",
};

const PLATFORM_ICONS = {
  TikTok: "♪", Instagram: "◐", Facebook: "f",
  Pinterest: "◉", Snapchat: "◇", YouTube: "▶", X: "✕",
};

/* ═══════════════════ i18n ═══════════════════ */
const TRANSLATIONS = {
  en: {
    name: "English", flag: "🇬🇧",
    dashboard: "Dashboard", productSpy: "Product Spy", winners: "Winners",
    aiLab: "AI Lab", pricing: "Pricing", search: "Search products, niches...",
    all: "All", score: "Score", profit: "Profit", trend: "Trend", orders: "Orders",
    eliteOnly: "Elite Only", viralOnly: "Viral", results: "results",
    loadMore: "Load more", noResults: "No products found",
    buy: "Buy", sell: "Sell", margin: "Margin", engagement: "Engagement",
    competition: "Competition", saturation: "Saturation",
    cpc: "CPC", ctr: "CTR", convRate: "Conv.", adBudget: "Ad budget",
    supplier: "Supplier", shipping: "Shipping", rating: "Rating", added: "Added",
    details: "Product Analysis", close: "Close",
    orders30: "Orders/30d", ordersDay: "Orders/day", roas: "ROAS", monthRev: "Monthly Rev.",
    analyzed: "Products analyzed", eliteWinners: "Elite Winners",
    newToday: "New today", avgMargin: "Avg margin", totalOrders: "Total orders",
    platformBreak: "Platform Breakdown", topWinners: "Top Winners",
    aiTitle: "AI Product Discovery", aiDesc: "Our AI finds winners automatically",
    aiGenerate: "Generate Winners", aiAnalyzing: "Analyzing...",
    aiNiche: "Enter a niche or leave empty",
    autoPilot: "Auto-Pilot", autoPilotDesc: "AI adds winners & removes underperformers daily",
    autoPilotOn: "Auto-Pilot ON", autoPilotOff: "Enable Auto-Pilot",
    lastScan: "Last scan", nextScan: "Next scan", addedToday: "Added today",
    removedToday: "Removed today", aiAccuracy: "AI Accuracy",
    popular: "Most Popular", getStarted: "Get Started", contactUs: "Contact Us",
    language: "Language", free: "Free", mo: "/mo",
  },
  fr: {
    name: "Français", flag: "🇫🇷",
    dashboard: "Tableau de bord", productSpy: "Product Spy", winners: "Winners",
    aiLab: "Labo IA", pricing: "Tarifs", search: "Rechercher produits, niches...",
    all: "Tous", score: "Score", profit: "Profit", trend: "Tendance", orders: "Commandes",
    eliteOnly: "Elite", viralOnly: "Viral", results: "résultats",
    loadMore: "Charger plus", noResults: "Aucun produit trouvé",
    buy: "Achat", sell: "Vente", margin: "Marge", engagement: "Engagement",
    competition: "Concurrence", saturation: "Saturation",
    cpc: "CPC", ctr: "CTR", convRate: "Conv.", adBudget: "Budget pub",
    supplier: "Fournisseur", shipping: "Livraison", rating: "Note", added: "Ajouté",
    details: "Analyse Produit", close: "Fermer",
    orders30: "Commandes/30j", ordersDay: "Commandes/jour", roas: "ROAS", monthRev: "Rev. mensuel",
    analyzed: "Produits analysés", eliteWinners: "Elite Winners",
    newToday: "Nouveaux aujourd'hui", avgMargin: "Marge moyenne", totalOrders: "Commandes totales",
    platformBreak: "Par Plateforme", topWinners: "Top Winners",
    aiTitle: "Découverte IA", aiDesc: "Notre IA trouve les winners automatiquement",
    aiGenerate: "Générer des Winners", aiAnalyzing: "Analyse en cours...",
    aiNiche: "Entrer une niche ou laisser vide",
    autoPilot: "Auto-Pilote", autoPilotDesc: "L'IA ajoute les winners et retire les sous-performeurs",
    autoPilotOn: "Auto-Pilote ACTIF", autoPilotOff: "Activer l'Auto-Pilote",
    lastScan: "Dernier scan", nextScan: "Prochain scan", addedToday: "Ajoutés aujourd'hui",
    removedToday: "Retirés aujourd'hui", aiAccuracy: "Précision IA",
    popular: "Le Plus Populaire", getStarted: "Commencer", contactUs: "Nous Contacter",
    language: "Langue", free: "Gratuit", mo: "/mois",
  },
  es: {
    name: "Español", flag: "🇪🇸",
    dashboard: "Panel", productSpy: "Product Spy", winners: "Winners",
    aiLab: "Lab IA", pricing: "Precios", search: "Buscar productos...",
    all: "Todos", score: "Puntuación", profit: "Beneficio", trend: "Tendencia", orders: "Pedidos",
    eliteOnly: "Elite", viralOnly: "Viral", results: "resultados",
    loadMore: "Cargar más", noResults: "Sin resultados",
    buy: "Compra", sell: "Venta", margin: "Margen", engagement: "Engagement",
    competition: "Competencia", saturation: "Saturación",
    cpc: "CPC", ctr: "CTR", convRate: "Conv.", adBudget: "Budget ads",
    supplier: "Proveedor", shipping: "Envío", rating: "Valoración", added: "Añadido",
    details: "Análisis", close: "Cerrar",
    orders30: "Pedidos/30d", ordersDay: "Pedidos/día", roas: "ROAS", monthRev: "Rev. mensual",
    analyzed: "Productos analizados", eliteWinners: "Elite Winners",
    newToday: "Nuevos hoy", avgMargin: "Margen medio", totalOrders: "Pedidos totales",
    platformBreak: "Por Plataforma", topWinners: "Top Winners",
    aiTitle: "Descubrimiento IA", aiDesc: "Nuestra IA encuentra ganadores automáticamente",
    aiGenerate: "Generar Winners", aiAnalyzing: "Analizando...",
    aiNiche: "Escribe un nicho o deja vacío",
    autoPilot: "Auto-Piloto", autoPilotDesc: "La IA añade ganadores y elimina bajo rendimiento",
    autoPilotOn: "Auto-Piloto ACTIVO", autoPilotOff: "Activar Auto-Piloto",
    lastScan: "Último scan", nextScan: "Próximo scan", addedToday: "Añadidos hoy",
    removedToday: "Eliminados hoy", aiAccuracy: "Precisión IA",
    popular: "Más Popular", getStarted: "Empezar", contactUs: "Contactar",
    language: "Idioma", free: "Gratis", mo: "/mes",
  },
  de: {
    name: "Deutsch", flag: "🇩🇪",
    dashboard: "Dashboard", productSpy: "Product Spy", winners: "Winners",
    aiLab: "KI-Labor", pricing: "Preise", search: "Produkte suchen...",
    all: "Alle", score: "Score", profit: "Gewinn", trend: "Trend", orders: "Bestellungen",
    eliteOnly: "Elite", viralOnly: "Viral", results: "Ergebnisse",
    loadMore: "Mehr laden", noResults: "Keine Ergebnisse",
    buy: "Einkauf", sell: "Verkauf", margin: "Marge", engagement: "Engagement",
    competition: "Wettbewerb", saturation: "Sättigung",
    cpc: "CPC", ctr: "CTR", convRate: "Conv.", adBudget: "Ad-Budget",
    supplier: "Lieferant", shipping: "Versand", rating: "Bewertung", added: "Hinzugefügt",
    details: "Analyse", close: "Schließen",
    orders30: "Bestellungen/30T", ordersDay: "Bestellungen/Tag", roas: "ROAS", monthRev: "Monatsumsatz",
    analyzed: "Analysiert", eliteWinners: "Elite Winners",
    newToday: "Neu heute", avgMargin: "Durchschn. Marge", totalOrders: "Gesamt",
    platformBreak: "Nach Plattform", topWinners: "Top Winners",
    aiTitle: "KI-Entdeckung", aiDesc: "KI findet Winners automatisch",
    aiGenerate: "Winners generieren", aiAnalyzing: "Analysiert...",
    aiNiche: "Nische eingeben",
    autoPilot: "Auto-Pilot", autoPilotDesc: "KI fügt Winners hinzu und entfernt Unterperformer",
    autoPilotOn: "Auto-Pilot AN", autoPilotOff: "Aktivieren",
    lastScan: "Letzter Scan", nextScan: "Nächster Scan", addedToday: "Heute hinzugefügt",
    removedToday: "Heute entfernt", aiAccuracy: "KI-Genauigkeit",
    popular: "Am Beliebtesten", getStarted: "Loslegen", contactUs: "Kontakt",
    language: "Sprache", free: "Kostenlos", mo: "/Mo",
  },
  pt: {
    name: "Português", flag: "🇧🇷",
    dashboard: "Painel", productSpy: "Product Spy", winners: "Winners",
    aiLab: "Lab IA", pricing: "Preços", search: "Buscar produtos...",
    all: "Todos", score: "Score", profit: "Lucro", trend: "Tendência", orders: "Pedidos",
    eliteOnly: "Elite", viralOnly: "Viral", results: "resultados",
    loadMore: "Carregar mais", noResults: "Nenhum resultado",
    buy: "Compra", sell: "Venda", margin: "Margem", engagement: "Engajamento",
    competition: "Concorrência", saturation: "Saturação",
    cpc: "CPC", ctr: "CTR", convRate: "Conv.", adBudget: "Budget ads",
    supplier: "Fornecedor", shipping: "Envio", rating: "Avaliação", added: "Adicionado",
    details: "Análise", close: "Fechar",
    orders30: "Pedidos/30d", ordersDay: "Pedidos/dia", roas: "ROAS", monthRev: "Rev. mensal",
    analyzed: "Analisados", eliteWinners: "Elite Winners",
    newToday: "Novos hoje", avgMargin: "Margem média", totalOrders: "Total pedidos",
    platformBreak: "Por Plataforma", topWinners: "Top Winners",
    aiTitle: "Descoberta IA", aiDesc: "IA encontra winners automaticamente",
    aiGenerate: "Gerar Winners", aiAnalyzing: "Analisando...",
    aiNiche: "Digite um nicho",
    autoPilot: "Auto-Piloto", autoPilotDesc: "IA adiciona winners e remove underperformers",
    autoPilotOn: "Auto-Piloto ATIVO", autoPilotOff: "Ativar",
    lastScan: "Último scan", nextScan: "Próximo scan", addedToday: "Adicionados hoje",
    removedToday: "Removidos hoje", aiAccuracy: "Precisão IA",
    popular: "Mais Popular", getStarted: "Começar", contactUs: "Contato",
    language: "Idioma", free: "Grátis", mo: "/mês",
  },
  ja: {
    name: "日本語", flag: "🇯🇵",
    dashboard: "ダッシュボード", productSpy: "商品スパイ", winners: "ウィナー",
    aiLab: "AIラボ", pricing: "料金", search: "商品を検索...",
    all: "すべて", score: "スコア", profit: "利益", trend: "トレンド", orders: "注文",
    eliteOnly: "エリート", viralOnly: "バイラル", results: "件",
    loadMore: "もっと見る", noResults: "該当なし",
    buy: "仕入", sell: "販売", margin: "マージン", engagement: "エンゲージメント",
    competition: "競合", saturation: "飽和度",
    cpc: "CPC", ctr: "CTR", convRate: "CVR", adBudget: "広告予算",
    supplier: "サプライヤー", shipping: "配送", rating: "評価", added: "追加日",
    details: "分析", close: "閉じる",
    orders30: "注文/30日", ordersDay: "注文/日", roas: "ROAS", monthRev: "月間売上",
    analyzed: "分析済み", eliteWinners: "エリート",
    newToday: "本日新着", avgMargin: "平均マージン", totalOrders: "総注文",
    platformBreak: "プラットフォーム別", topWinners: "トップ",
    aiTitle: "AI発見", aiDesc: "AIが自動でWinnerを発見",
    aiGenerate: "Winner生成", aiAnalyzing: "分析中...",
    aiNiche: "ニッチを入力",
    autoPilot: "オートパイロット", autoPilotDesc: "AIが毎日自動でWinnerを追加・削除",
    autoPilotOn: "ON", autoPilotOff: "有効化",
    lastScan: "最終スキャン", nextScan: "次回", addedToday: "今日追加",
    removedToday: "今日削除", aiAccuracy: "AI精度",
    popular: "人気No.1", getStarted: "始める", contactUs: "お問合せ",
    language: "言語", free: "無料", mo: "/月",
  },
  zh: {
    name: "中文", flag: "🇨🇳",
    dashboard: "仪表板", productSpy: "商品间谍", winners: "爆品",
    aiLab: "AI实验室", pricing: "价格", search: "搜索商品...",
    all: "全部", score: "评分", profit: "利润", trend: "趋势", orders: "订单",
    eliteOnly: "精英", viralOnly: "爆款", results: "个结果",
    loadMore: "加载更多", noResults: "无结果",
    buy: "采购", sell: "售价", margin: "利润率", engagement: "互动",
    competition: "竞争", saturation: "饱和度",
    cpc: "CPC", ctr: "CTR", convRate: "转化率", adBudget: "广告预算",
    supplier: "供应商", shipping: "物流", rating: "评分", added: "添加",
    details: "分析", close: "关闭",
    orders30: "30天订单", ordersDay: "日订单", roas: "ROAS", monthRev: "月收入",
    analyzed: "已分析", eliteWinners: "精英爆品",
    newToday: "今日新增", avgMargin: "平均利润率", totalOrders: "总订单",
    platformBreak: "平台分布", topWinners: "顶级爆品",
    aiTitle: "AI发现", aiDesc: "AI自动寻找爆品",
    aiGenerate: "生成爆品", aiAnalyzing: "分析中...",
    aiNiche: "输入品类",
    autoPilot: "自动驾驶", autoPilotDesc: "AI每天自动添加爆品并移除低效商品",
    autoPilotOn: "已开启", autoPilotOff: "启用",
    lastScan: "上次扫描", nextScan: "下次扫描", addedToday: "今日新增",
    removedToday: "今日移除", aiAccuracy: "AI准确率",
    popular: "最受欢迎", getStarted: "开始", contactUs: "联系我们",
    language: "语言", free: "免费", mo: "/月",
  },
};

const LangCtx = createContext(null);
const useLang = () => useContext(LangCtx);

/* ═══════════════════ PRODUCT DATA GENERATOR ═══════════════════ */
const NICHES = [
  { n: "Home & Decor", e: "🏠", p: ["LED Galaxy Projector", "Magnetic Levitation Lamp", "Sunset Projector Lamp", "Crystal Night Light", "Cloud LED Light", "Smart Aroma Diffuser", "3D Moon Lamp XL", "RGB Corner Floor Lamp", "Neon Sign Custom", "Smart Curtain Motor", "Desk Organizer Bamboo", "Floating Plant Pot", "LED Strip Controller", "Aromatherapy Set"] },
  { n: "Tech & Gadgets", e: "⚡", p: ["Bone Conduction Earbuds", "Mini Spy Camera WiFi", "MagSafe Power Bank", "Smart Ring Health", "Wireless Charger 3in1", "Bluetooth Tracker Tag", "Smart Pen Scanner", "Cable Organizer Magnetic", "Projector Mini Portable", "Foldable Keyboard BT", "UV Sanitizer Box", "Solar Power Bank"] },
  { n: "Beauty & Care", e: "✨", p: ["Ultrasonic Face Brush", "UV Nail Dryer Pro", "LED Makeup Mirror", "Ice Roller Face", "Scalp Massager Electric", "Teeth Whitening Kit", "Hair Removal IPL", "Jade Roller Gua Sha", "Lip Plumper Device", "Microcurrent Face Lift", "Steam Face Spa", "Hair Curler Auto"] },
  { n: "Sport & Wellness", e: "💪", p: ["Mini Fascia Gun Pro", "EMS Neck Massager", "Smart Jump Rope", "Bike Laser Light", "Posture Corrector Pro", "Massage Gun Mini", "Resistance Band Set", "Ab Roller Wheel", "Smart Water Bottle", "Wrist Trainer Gyro", "Foam Roller Vibrating", "Grip Strength Trainer"] },
  { n: "Fashion", e: "👗", p: ["Anti-Theft USB Backpack", "Heated Blanket USB", "Smart Sunglasses Audio", "Magnetic Shoe Laces", "Heated Vest USB", "Crossbody Sling Bag", "Minimalist Wallet RFID", "Ring Light Selfie", "Travel Organizer Set", "Belt Bag Luxury"] },
  { n: "Pets", e: "🐾", p: ["GPS Tracker Mini Pet", "Auto Pet Feeder WiFi", "Pet Hair Remover", "Cat Water Fountain", "Pet Camera Interactive", "Dog Paw Cleaner", "Cat Laser Toy Auto", "Pet Carrier Expandable", "Pet Nail Grinder", "Dog Raincoat Pro"] },
  { n: "Auto & Moto", e: "🚗", p: ["Cyclone Car Vacuum", "Car Phone Mount", "Dash Cam 4K Mini", "Tire Inflator Portable", "LED Interior Lights", "Car Air Purifier", "Jump Starter Portable", "Trunk Organizer Pro", "HUD Display OBD2", "Car Fridge Mini"] },
  { n: "Garden", e: "🌿", p: ["Smart WiFi Sprinkler", "Solar Garden Lights", "Seed Starter Kit", "Plant Self-Watering", "Herb Garden Indoor", "Bird Bath Solar", "Pruning Shears Pro", "Insect Trap Solar", "Soil Moisture Sensor"] },
  { n: "Kids & Baby", e: "👶", p: ["3D Crystal Dino Light", "Montessori Busy Board", "Baby Monitor WiFi", "Kids Drawing Tablet", "Night Light Star", "Kids Camera Instant", "Bath Toy Organizer", "Growth Chart Wall", "Musical Crib Mobile"] },
  { n: "Kitchen", e: "🍳", p: ["Air Fryer Mini", "Milk Frother Electric", "Vegetable Chopper Pro", "Coffee Scale Timer", "Knife Sharpener Pro", "Vacuum Sealer Mini", "Egg Cooker Smart", "Tea Infuser Smart", "Pasta Maker Manual"] },
  { n: "Health", e: "🏥", p: ["Sleep Tracker Ring", "Acupressure Mat Set", "Blue Light Therapy", "Knee Brace Support", "Eye Massager Heat", "Back Stretcher", "Foot Massager Shiatsu", "TENS Unit Wireless", "Red Light Panel"] },
  { n: "Office", e: "💼", p: ["Standing Desk Pad", "Desk Mat Leather XXL", "Blue Light Glasses", "Monitor Light Bar", "Ergonomic Mouse Vertical", "Laptop Stand Aluminum", "Noise Machine White", "Pomodoro Timer Cube", "Webcam 4K Pro"] },
];

function makeRng(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateProducts(count) {
  const rng = makeRng(12345);
  const products = [];
  const dates = ["2026-03-05", "2026-03-05", "2026-03-04", "2026-03-04", "2026-03-03", "2026-03-02", "2026-03-01", "2026-02-28"];
  const tagPool = ["Mega Winner", "Viral 🔥", "High Margin", "Wow Effect", "Evergreen", "Recurring", "Scaling", "Low Saturation", "Premium", "Gift Idea", "High AOV", "Volume", "Problem Solver", "Trending", "Low CPC", "Bundle"];

  for (let i = 0; i < count; i++) {
    const nicheIdx = Math.floor(rng() * NICHES.length);
    const niche = NICHES[nicheIdx];
    const prodIdx = Math.floor(rng() * niche.p.length);
    const suffix = i >= 150 ? ` V${Math.floor(rng() * 8) + 2}` : "";

    const aliPrice = Math.round((2 + rng() * 28) * 100) / 100;
    const sellPrice = Math.round(aliPrice * (2.2 + rng() * 3.5) * 100) / 100;
    const isWinner = rng() > 0.48;
    const isViral = rng() > 0.72;

    const numPl = 1 + Math.floor(rng() * 4);
    const shuffled = [...PLATFORMS].sort(() => rng() - 0.5);
    const platforms = shuffled.slice(0, numPl);

    const tags = [];
    if (isWinner) tags.push(tagPool[Math.floor(rng() * 6)]);
    if (isViral) tags.push("Viral 🔥");
    tags.push(tagPool[Math.floor(rng() * tagPool.length)]);
    const uniqueTags = [...new Set(tags)].slice(0, 3);

    products.push({
      id: i + 1,
      name: niche.p[prodIdx] + suffix,
      niche: niche.n,
      emoji: niche.e,
      img: `https://picsum.photos/seed/${i + 100}/400/400`,
      imgAlt: `https://picsum.photos/seed/${i + 500}/400/400`,
      imgLife: `https://picsum.photos/seed/${i + 900}/400/400`,
      aliPrice,
      sellPrice,
      orders30d: Math.round(300 + rng() * 22000),
      trend: isWinner ? Math.round(72 + rng() * 28) : Math.round(25 + rng() * 52),
      engagement: isWinner ? Math.round(68 + rng() * 32) : Math.round(20 + rng() * 55),
      competition: isWinner ? Math.round(5 + rng() * 30) : Math.round(25 + rng() * 65),
      saturation: isWinner ? Math.round(3 + rng() * 28) : Math.round(20 + rng() * 70),
      viral: isViral,
      cpc: Math.round((0.12 + rng() * 0.7) * 100) / 100,
      ctr: Math.round((1.2 + rng() * 5.8) * 10) / 10,
      convRate: Math.round((1.2 + rng() * 5.2) * 10) / 10,
      reviews: Math.round((3.6 + rng() * 1.4) * 10) / 10,
      adSpend: Math.round(2 + rng() * 22),
      shipping: rng() > 0.5 ? "ePacket 7-14d" : "Standard 15-25d",
      supplier: ["ShenZhen Co.", "GuangZhou Tech", "YiWu Supply", "FoShan Ltd", "DongGuan Pro"][Math.floor(rng() * 5)],
      platforms,
      tags: uniqueTags,
      dateAdded: dates[Math.floor(rng() * dates.length)],
      premium: rng() > 0.6,
    });
  }
  return products;
}

function calcScore(p) {
  const m = ((p.sellPrice - p.aliPrice) / p.sellPrice) * 100;
  return Math.round(
    Math.min(m / 80 * 25, 25) +
    (p.trend / 100) * 20 +
    (p.engagement / 100) * 15 +
    ((100 - p.competition) / 100) * 15 +
    ((100 - p.saturation) / 100) * 15 +
    (p.convRate / 6) * 10
  );
}

function scoreColor(s) {
  if (s >= 85) return T.gold;
  if (s >= 72) return T.green;
  if (s >= 55) return T.blue;
  return T.red;
}

/* ═══════════════════ SHARED UI COMPONENTS ═══════════════════ */

/* Inline SVG product illustrations - native DOM, guaranteed to render, always sharp */
const NICHE_THEME = {
  "Home & Decor":     { bg: "#0F1120", c1: "#CFAB3B", c2: "#8B7420" },
  "Tech & Gadgets":   { bg: "#0C1220", c1: "#5BA4F5", c2: "#3670B0" },
  "Beauty & Care":    { bg: "#160E1A", c1: "#F472B6", c2: "#A84D7E" },
  "Sport & Wellness": { bg: "#0C1410", c1: "#2DD4A0", c2: "#1E8D6B" },
  "Fashion":          { bg: "#140E18", c1: "#A78BFA", c2: "#7460B0" },
  "Pets":             { bg: "#12100C", c1: "#FB923C", c2: "#A86028" },
  "Auto & Moto":      { bg: "#0E0E14", c1: "#EF6461", c2: "#A04442" },
  "Garden":           { bg: "#0C120E", c1: "#34D399", c2: "#238D66" },
  "Kids & Baby":      { bg: "#100E1A", c1: "#22D3EE", c2: "#1890A3" },
  "Kitchen":          { bg: "#14100C", c1: "#CFAB3B", c2: "#8B7420" },
  "Health":           { bg: "#0E1014", c1: "#60A5FA", c2: "#4070B0" },
  "Office":           { bg: "#0E0E12", c1: "#A78BFA", c2: "#7460B0" },
};

function ProductSVG({ niche, seed }) {
  const type = seed % 12;
  switch(type) {
    case 0: return (
      <g><rect x="42" y="55" width="16" height="40" rx="2" fill="currentColor" opacity="0.3"/><ellipse cx="50" cy="40" rx="22" ry="18" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/><rect x="46" y="95" width="8" height="4" rx="1" fill="currentColor" opacity="0.4"/><circle cx="50" cy="38" r="4" fill="currentColor" opacity="0.5"/></g>
    );
    case 1: return (
      <g><rect x="32" y="20" width="36" height="62" rx="6" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/><rect x="36" y="26" width="28" height="44" rx="2" fill="currentColor" opacity="0.08"/><circle cx="50" cy="76" r="3" fill="currentColor" opacity="0.3"/><rect x="44" y="22" width="12" height="2" rx="1" fill="currentColor" opacity="0.2"/></g>
    );
    case 2: return (
      <g><rect x="38" y="30" width="24" height="52" rx="8" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/><rect x="43" y="20" width="14" height="14" rx="3" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1"/><rect x="42" y="50" width="16" height="12" rx="2" fill="currentColor" opacity="0.08"/><line x1="44" y1="56" x2="56" y2="56" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/></g>
    );
    case 3: return (
      <g><path d="M30 50 Q30 28 50 28 Q70 28 70 50" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/><rect x="25" y="48" width="12" height="20" rx="6" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2"/><rect x="63" y="48" width="12" height="20" rx="6" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2"/><rect x="28" y="52" width="6" height="10" rx="2" fill="currentColor" opacity="0.15"/><rect x="66" y="52" width="6" height="10" rx="2" fill="currentColor" opacity="0.15"/></g>
    );
    case 4: return (
      <g><circle cx="50" cy="46" r="18" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8"/><circle cx="50" cy="46" r="14" fill="currentColor" opacity="0.06"/><rect x="47" y="22" width="6" height="10" rx="2" fill="currentColor" opacity="0.25"/><rect x="47" y="60" width="6" height="10" rx="2" fill="currentColor" opacity="0.25"/><line x1="50" y1="46" x2="50" y2="36" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/><line x1="50" y1="46" x2="58" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.4"/><circle cx="50" cy="46" r="2" fill="currentColor" opacity="0.5"/></g>
    );
    case 5: return (
      <g><path d="M30 40 L28 80 L72 80 L70 40 Z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/><path d="M36 40 Q36 26 50 26 Q64 26 64 40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/><line x1="28" y1="52" x2="72" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/><circle cx="50" cy="46" r="3" fill="currentColor" opacity="0.3"/></g>
    );
    case 6: return (
      <g><circle cx="50" cy="46" r="24" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/><circle cx="50" cy="46" r="16" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="1"/><circle cx="50" cy="46" r="8" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.8"/><circle cx="50" cy="46" r="3" fill="currentColor" opacity="0.35"/></g>
    );
    case 7: return (
      <g><rect x="36" y="28" width="28" height="48" rx="10" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/><rect x="42" y="18" width="16" height="14" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1"/><rect x="40" y="45" width="20" height="14" rx="3" fill="currentColor" opacity="0.06"/><line x1="42" y1="52" x2="58" y2="52" stroke="currentColor" strokeWidth="0.6" opacity="0.25"/><line x1="44" y1="56" x2="56" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.15"/></g>
    );
    case 8: return (
      <g><rect x="40" y="20" width="20" height="42" rx="8" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/><rect x="34" y="52" width="14" height="24" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1"/><circle cx="50" cy="28" r="6" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1"/><rect x="44" y="42" width="12" height="4" rx="1" fill="currentColor" opacity="0.1"/></g>
    );
    case 9: return (
      <g><ellipse cx="50" cy="60" rx="28" ry="12" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="50" cy="52" rx="22" ry="9" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.2"/><ellipse cx="50" cy="52" rx="14" ry="5" fill="currentColor" opacity="0.06"/><path d="M38 34 Q42 28 46 34 L44 40 L40 40 Z" fill="currentColor" opacity="0.25"/><path d="M54 34 Q58 28 62 34 L60 40 L56 40 Z" fill="currentColor" opacity="0.25"/></g>
    );
    case 10: return (
      <g><rect x="30" y="32" width="40" height="38" rx="6" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/><circle cx="50" cy="48" r="10" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="1"/><rect x="34" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.2"/><rect x="34" y="62" width="32" height="6" rx="2" fill="currentColor" opacity="0.08"/><circle cx="62" cy="65" r="2" fill="currentColor" opacity="0.3"/></g>
    );
    default: return (
      <g><rect x="30" y="28" width="40" height="44" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/><line x1="30" y1="42" x2="70" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.3"/><rect x="44" y="34" width="12" height="6" rx="1" fill="currentColor" opacity="0.15"/><rect x="36" y="50" width="28" height="3" rx="1" fill="currentColor" opacity="0.08"/><rect x="40" y="56" width="20" height="3" rx="1" fill="currentColor" opacity="0.06"/></g>
    );
  }
}

/* ═══════════════════ IMAGE MAPPING PER NICHE ═══════════════════ */
// Using Lorem Picsum with curated seeds that give relevant-looking product photos
const NICHE_IMAGE_SEEDS = {
  "Home & Decor":     [20, 96, 119, 145, 160, 180, 200, 235, 240, 250],
  "Tech & Gadgets":   [0, 1, 60, 180, 201, 250, 260, 270, 280, 290],
  "Beauty & Care":    [64, 65, 124, 169, 176, 177, 178, 179, 326, 334],
  "Sport & Wellness": [28, 42, 110, 141, 142, 158, 212, 217, 227, 232],
  "Fashion":          [21, 22, 23, 24, 25, 26, 44, 45, 46, 47],
  "Pets":             [200, 237, 247, 264, 272, 294, 307, 339, 360, 374],
  "Auto & Moto":      [111, 133, 134, 135, 163, 164, 165, 166, 167, 168],
  "Garden":           [15, 56, 57, 58, 59, 75, 76, 77, 78, 79],
  "Kids & Baby":      [217, 218, 219, 220, 221, 222, 223, 224, 225, 226],
  "Kitchen":          [292, 293, 294, 295, 296, 297, 298, 299, 300, 301],
  "Health":           [305, 306, 307, 308, 309, 310, 311, 312, 313, 314],
  "Office":           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

function ProductImage({ product, height = 130, style = {} }) {
  const theme = NICHE_THEME[product.niche] || NICHE_THEME["Tech & Gadgets"];
  const seeds = NICHE_IMAGE_SEEDS[product.niche] || NICHE_IMAGE_SEEDS["Tech & Gadgets"];
  const seed = seeds[product.id % seeds.length];
  const imgUrl = `https://picsum.photos/seed/${seed}/400/300`;

  return (
    <div style={{ height, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.c1}22 100%)`, ...style }}>
      <img
        src={imgUrl}
        alt={product.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)" }} />
      <div style={{
        position: "absolute", bottom: 6, right: 6,
        width: 26, height: 26, borderRadius: 7,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
      }}>
        {product.emoji}
      </div>
    </div>
  );
}

function GoldText({ children, style = {} }) {
  return (
    <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...style }}>
      {children}
    </span>
  );
}

function ScoreRing({ score, size = 44 }) {
  const color = scoreColor(score);
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={2.5} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={2.5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease", filter: `drop-shadow(0 0 3px ${color}40)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.27, fontWeight: 700, color, fontFamily: T.fm }}>{score}</span>
      </div>
    </div>
  );
}

function MiniBar({ value, color, showVal }) {
  return (
    <div style={{ position: "relative", width: "100%", height: showVal ? 14 : 3, background: "rgba(255,255,255,0.04)", borderRadius: showVal ? 7 : 2, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color || T.gold, borderRadius: showVal ? 7 : 2, transition: "width 0.6s ease", minWidth: showVal ? 28 : 0 }} />
      {showVal && (
        <span style={{
          position: "absolute", left: Math.min(value, 100) > 15 ? 0 : "auto",
          right: Math.min(value, 100) > 15 ? "auto" : 0,
          top: 0, bottom: 0, display: "flex", alignItems: "center",
          paddingLeft: Math.min(value, 100) > 15 ? 6 : 0,
          paddingRight: Math.min(value, 100) > 15 ? 0 : 6,
          fontSize: 8, fontWeight: 700, fontFamily: T.fm,
          color: Math.min(value, 100) > 15 ? "#fff" : (color || T.gold),
        }}>
          {value}%
        </span>
      )}
    </div>
  );
}

function Badge({ children, color }) {
  const c = color || T.gold;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", fontSize: 9, fontWeight: 700,
      padding: "2px 7px", borderRadius: 4, background: `${c}14`, color: c,
      border: `1px solid ${c}20`, fontFamily: T.fm, letterSpacing: 0.5,
    }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, letterSpacing: 1 }}>{label}</span>
        {icon && <span style={{ fontSize: 12, color: T.gold, opacity: 0.3 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || T.txt, fontFamily: T.fm }}>{value}</div>
    </div>
  );
}

function SmallStat({ label, value, color }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 11px", flex: 1, minWidth: 80 }}>
      <div style={{ fontSize: 8, color: T.dim, fontFamily: T.fm, letterSpacing: 1, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || T.txt, fontFamily: T.fm }}>{value}</div>
    </div>
  );
}

/* ═══════════════════ PRODUCT CARD (Minea-style) ═══════════════════ */
function ProductCard({ product, onClick, delay = 0, locked, onPaywall }) {
  const score = calcScore(product);
  const color = scoreColor(score);
  const margin = ((product.sellPrice - product.aliPrice) / product.sellPrice * 100).toFixed(0);
  const isNew = product.dateAdded === "2026-03-05";

  return (
    <div
      onClick={() => { if (locked && onPaywall) { onPaywall(); } else if (onClick) { onClick(); } }}
      style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
        cursor: "pointer", overflow: "hidden", position: "relative",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${T.gold}25`;
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(207,171,59,0.04)`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {locked && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(8,9,14,0.82)",
          backdropFilter: "blur(6px)", zIndex: 5, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", borderRadius: 14, gap: 6,
        }}>
          <div style={{ fontSize: 24, marginBottom: 2 }}>🔒</div>
          <div style={{ fontSize: 11, color: T.gold, fontWeight: 700, fontFamily: T.fm }}>PRO</div>
          <div style={{
            marginTop: 4, padding: "6px 16px", borderRadius: 8,
            background: GOLD_GRADIENT, color: "#060710",
            fontSize: 10, fontWeight: 800, fontFamily: T.ff,
            cursor: "pointer",
          }}>
            Unlock Now →
          </div>
        </div>
      )}

      {/* Preview area with generated thumbnail */}
      <div style={{ position: "relative", borderBottom: `1px solid ${T.border}` }}>
        <ProductImage product={product} height={130} />

        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 3 }}>
          {product.platforms.slice(0, 3).map((pl, i) => (
            <span key={i} style={{
              width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 800, fontFamily: T.fm,
              background: `${PLATFORM_COLORS[pl]}35`, color: PLATFORM_COLORS[pl],
              border: `1px solid ${PLATFORM_COLORS[pl]}40`, backdropFilter: "blur(4px)",
            }}>
              {PLATFORM_ICONS[pl]}
            </span>
          ))}
        </div>

        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <ScoreRing score={score} size={36} />
        </div>

        <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 3 }}>
          {score >= 85 && <Badge color={T.gold}>ELITE</Badge>}
          {product.viral && <Badge color={T.red}>VIRAL</Badge>}
          {isNew && <Badge color={T.cyan}>NEW</Badge>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 10, color: T.dim, fontFamily: T.fm, marginBottom: 10 }}>
          {product.niche} · {product.orders30d.toLocaleString()} orders
        </div>

        {/* Metric bars with values */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            { label: "Trend", value: product.trend, color: product.trend >= 80 ? T.green : T.blue },
            { label: "Margin", value: parseInt(margin), color: T.gold },
            { label: "Sat.", value: product.saturation, color: product.saturation <= 25 ? T.green : T.red },
          ].map((m, i) => (
            <div key={i}>
              <span style={{ fontSize: 8, color: T.dim, marginBottom: 2, display: "block" }}>{m.label}</span>
              <MiniBar value={m.value} color={m.color} showVal />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ DETAIL PANEL (ENHANCED) ═══════════════════ */
function DetailPanel({ product, onClose, plan = "free", onPaywall, aliLinks = {} }) {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveTab("overview");
      setAiData(null);
    }
  }, [product]);

  if (!product) return null;

  const score = calcScore(product);
  const color = scoreColor(score);
  const productBaseName = product.name.replace(/ V\d+$/, "");

  // 1. Admin-defined link takes priority (set via Admin Panel)
  const adminLink = aliLinks[productBaseName] || aliLinks[product.name];

  // 2. Fallback: realistic price estimates per product type
  const PRODUCT_PRICES = {
    "LED Galaxy Projector": { ali: 11.99, sell: 44.99 }, "Sunset Projector": { ali: 8.99, sell: 32.99 },
    "Moon Lamp": { ali: 6.49, sell: 24.99 }, "Aroma Diffuser": { ali: 9.49, sell: 34.99 },
    "Corner Floor Lamp": { ali: 21.99, sell: 74.99 }, "Levitation Lamp": { ali: 17.99, sell: 64.99 },
    "Bone Conduction": { ali: 13.99, sell: 54.99 }, "Power Bank": { ali: 10.99, sell: 39.99 },
    "Tracker Tag": { ali: 3.99, sell: 17.99 }, "Spy Camera": { ali: 8.99, sell: 34.99 },
    "Wireless Charger": { ali: 12.99, sell: 44.99 }, "Smart Ring": { ali: 18.99, sell: 69.99 },
    "Face Brush": { ali: 7.49, sell: 29.99 }, "Makeup Mirror": { ali: 15.99, sell: 54.99 },
    "Hair Removal": { ali: 23.99, sell: 89.99 }, "Whitening Kit": { ali: 5.49, sell: 24.99 },
    "Ice Roller": { ali: 2.99, sell: 14.99 }, "Scalp Massager": { ali: 7.99, sell: 29.99 },
    "Fascia Gun": { ali: 16.99, sell: 59.99 }, "Neck Massager": { ali: 11.99, sell: 44.99 },
    "Jump Rope": { ali: 5.99, sell: 22.99 }, "Posture Corrector": { ali: 5.49, sell: 19.99 },
    "GPS Tracker": { ali: 13.99, sell: 44.99 }, "Pet Feeder": { ali: 21.99, sell: 74.99 },
    "Water Fountain": { ali: 11.99, sell: 39.99 }, "Dash Cam": { ali: 18.99, sell: 64.99 },
    "Tire Inflator": { ali: 15.99, sell: 54.99 }, "Baby Monitor": { ali: 23.99, sell: 84.99 },
    "Air Fryer": { ali: 27.99, sell: 94.99 }, "Milk Frother": { ali: 4.99, sell: 19.99 },
    "Sleep Tracker": { ali: 21.99, sell: 79.99 }, "Eye Massager": { ali: 13.99, sell: 49.99 },
    "Backpack": { ali: 18.99, sell: 64.99 }, "RFID Wallet": { ali: 3.99, sell: 17.99 },
    "Desk Mat": { ali: 8.99, sell: 34.99 }, "Monitor Light": { ali: 11.99, sell: 39.99 },
    "Laptop Stand": { ali: 13.99, sell: 49.99 }, "Timer Cube": { ali: 7.99, sell: 29.99 },
    "Vacuum Sealer": { ali: 15.99, sell: 54.99 }, "Nail Dryer": { ali: 9.99, sell: 34.99 },
    "Massage Gun": { ali: 15.99, sell: 54.99 }, "Jump Starter": { ali: 22.99, sell: 79.99 },
    "Dog Paw Cleaner": { ali: 6.99, sell: 24.99 }, "Resistance Band": { ali: 4.99, sell: 19.99 },
    "Foam Roller": { ali: 9.99, sell: 34.99 }, "Vegetable Chopper": { ali: 8.99, sell: 29.99 },
    "Coffee Scale": { ali: 10.99, sell: 39.99 }, "Acupressure Mat": { ali: 12.99, sell: 44.99 },
    "Red Light Panel": { ali: 29.99, sell: 99.99 }, "TENS Unit": { ali: 14.99, sell: 49.99 },
  };
  const priceKey = Object.keys(PRODUCT_PRICES).find(k =>
    productBaseName.toLowerCase().includes(k.toLowerCase().split(" ")[0].toLowerCase()) &&
    (k.split(" ").length === 1 || productBaseName.toLowerCase().includes(k.toLowerCase().split(" ").slice(-1)[0].toLowerCase()))
  );
  const fallbackPrices = priceKey ? PRODUCT_PRICES[priceKey] : null;

  const displayAliPrice  = adminLink ? adminLink.aliPrice  : (fallbackPrices ? fallbackPrices.ali  : parseFloat(product.aliPrice.toFixed(2)));
  const displaySellPrice = adminLink ? adminLink.sellPrice : (fallbackPrices ? fallbackPrices.sell : parseFloat(product.sellPrice.toFixed(2)));
  const displayProfit = (displaySellPrice - displayAliPrice).toFixed(2);
  const displayMargin = ((displaySellPrice - displayAliPrice) / displaySellPrice * 100).toFixed(1);
  const aliWinner = adminLink || fallbackPrices;

  // URL: admin direct link > filtered search
  const aliSearchUrl = adminLink
    ? adminLink.url
    : `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(productBaseName)}&SortType=total_transSold_desc&minPrice=${Math.max(1, Math.floor(displayAliPrice * 0.6))}&maxPrice=${Math.ceil(displayAliPrice * 1.8)}`;

  const profit = displayProfit;
  const margin = displayMargin;
  const roas = ((displaySellPrice * product.convRate / 100) / (product.cpc / (product.ctr / 100))).toFixed(1);
  const estMonthly = Math.round(parseFloat(displayProfit) * product.orders30d * (product.convRate / 100));

  // Generate trend data
  const rng2 = makeRng(product.id * 137);
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const base = product.trend * 0.6;
    const growth = (product.trend - base) * (i / 29);
    const noise = (rng2() - 0.5) * 15;
    return { day: i + 1, value: Math.max(5, Math.round(base + growth + noise)), label: `Feb ${i + 1}` };
  });
  const trendDirection = trendData[29].value > trendData[15].value ? "up" : "down";

  // Generate country breakdown
  const countries = [
    { name: "🇺🇸 United States", pct: Math.round(20 + rng2() * 25) },
    { name: "🇬🇧 United Kingdom", pct: Math.round(8 + rng2() * 12) },
    { name: "🇫🇷 France", pct: Math.round(6 + rng2() * 10) },
    { name: "🇩🇪 Germany", pct: Math.round(5 + rng2() * 10) },
    { name: "🇨🇦 Canada", pct: Math.round(4 + rng2() * 8) },
    { name: "🇦🇺 Australia", pct: Math.round(3 + rng2() * 7) },
  ];
  const totalPct = countries.reduce((s, c) => s + c.pct, 0);
  countries.push({ name: "🌍 Others", pct: 100 - totalPct });

  // Generate competitor stores
  const storeNames = ["TrendyDrop.com", "WinnerStore.co", "DropShipKing.io", "ViraShop.com", "FastSell.store", "NicheDrop.co"];
  const competitors = storeNames.slice(0, 3 + Math.floor(rng2() * 3)).map((name) => ({
    name,
    price: (product.sellPrice * (0.8 + rng2() * 0.5)).toFixed(2),
    rating: (3.5 + rng2() * 1.5).toFixed(1),
    orders: Math.round(100 + rng2() * 5000),
  }));

  // Fetch real AI data
  const fetchAIData = async () => {
    if (aiData || aiLoading) return;
    setAiLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Find real information about the product "${product.name.replace(/ V\d+/, "")}" for dropshipping. I need: 1) A real AliExpress supplier link or search URL, 2) The current trend status (growing/declining), 3) Estimated market size, 4) Top 3 competitor stores selling this, 5) Best target countries. Respond concisely.` }],
        }),
      });
      const data = await resp.json();
      const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
      setAiData(text);
    } catch (e) {
      setAiData("Could not fetch live data. Please try again.");
    }
    setAiLoading(false);
  };

  const Section = ({ icon, title, children, extra }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, fontFamily: T.fm, letterSpacing: 1.2 }}>{icon} {title}</div>
        {extra}
      </div>
      {children}
    </div>
  );

  const isFree = plan === "free";
  const tabs = [
    { id: "overview", label: "Overview", locked: false },
    { id: "trend", label: "Trend", locked: isFree },
    { id: "media", label: "Media", locked: false },
    { id: "competitors", label: "Competitors", locked: isFree },
    { id: "ai", label: "AI Intel", locked: isFree },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 998, backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(520px, 95vw)",
        zIndex: 999, background: T.bg, borderLeft: `1px solid ${T.border}`,
        overflowY: "auto", padding: "22px 22px 34px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, letterSpacing: 2 }}>{t.details}</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.sub, width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>

        {/* Product header */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, flexShrink: 0 }}>
            <ProductImage product={product} height={62} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.txt }}>{product.name}</div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{product.niche} · {product.dateAdded}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {product.platforms.map((pl, i) => <Badge key={i} color={PLATFORM_COLORS[pl]}>{pl}</Badge>)}
            </div>
          </div>
        </div>

        {/* Score + AliExpress link */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "center", background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 12, padding: "12px 14px" }}>
            <ScoreRing score={score} size={58} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color, fontFamily: T.fm }}>
                {score >= 85 ? "ELITE WINNER" : score >= 72 ? "WINNER" : score >= 55 ? "POTENTIAL" : "AVOID"}
              </div>
              <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>
                {trendDirection === "up" ? "📈 Trending Up" : "📉 Trending Down"}
              </div>
            </div>
          </div>
          {isFree ? (
            <div onClick={() => { if (onPaywall) onPaywall(); }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
              cursor: "pointer", minWidth: 80,
            }}>
              <span style={{ fontSize: 16, marginBottom: 4 }}>🔒</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: T.gold, fontFamily: T.fm, textAlign: "center" }}>PRO</span>
              <span style={{ fontSize: 7, color: T.dim, marginTop: 1 }}>Supplier link</span>
            </div>
          ) : (
            <a href={aliSearchUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "12px 16px", borderRadius: 12, textDecoration: "none",
              background: aliWinner ? "rgba(255,87,34,0.12)" : "rgba(255,87,34,0.08)",
              border: aliWinner ? "1px solid rgba(255,87,34,0.4)" : "1px solid rgba(255,87,34,0.2)",
              cursor: "pointer", minWidth: 80, transition: "all 0.2s",
              position: "relative",
            }}>
              {aliWinner && (
                <div style={{
                  position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                  background: "#FF5722", color: "#fff", fontSize: 7, fontWeight: 800,
                  padding: "2px 8px", borderRadius: 4, fontFamily: T.fm, whiteSpace: "nowrap",
                }}>✓ WINNER</div>
              )}
              <span style={{ fontSize: 20, marginBottom: 4 }}>🛒</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#FF5722", fontFamily: T.fm, textAlign: "center" }}>AliExpress</span>
              <span style={{ fontSize: 8, color: T.sub, marginTop: 1 }}>{adminLink ? "Lien direct" : "Trouver fournisseur"}</span>
            </a>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 3, border: `1px solid ${T.border}`, marginBottom: 18 }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => {
              if (tab.locked) { if (onPaywall) onPaywall(); return; }
              setActiveTab(tab.id); if (tab.id === "ai") fetchAIData();
            }} style={{
              flex: 1, padding: "7px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 10, fontWeight: 600, fontFamily: T.ff, textAlign: "center",
              background: activeTab === tab.id && !tab.locked ? "rgba(207,171,59,0.1)" : "transparent",
              color: tab.locked ? T.dim : activeTab === tab.id ? T.gold : T.sub,
              transition: "all 0.2s", opacity: tab.locked ? 0.5 : 1,
            }}>
              {tab.locked ? "🔒 " : ""}{tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <>
            <Section icon="◆" title="PERFORMANCE">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                <SmallStat label={t.margin} value={isFree ? "🔒" : `${displayMargin}%`} color={isFree ? T.dim : T.green} />
                <SmallStat label={t.roas} value={isFree ? "🔒" : `${roas}x`} color={isFree ? T.dim : (parseFloat(roas) >= 2.5 ? T.green : T.blue)} />
                <SmallStat label={t.monthRev} value={isFree ? "🔒" : `${estMonthly.toLocaleString()}€`} color={isFree ? T.dim : T.gold} />
              </div>
            </Section>

            {isFree ? (
              <div style={{
                background: "rgba(207,171,59,0.04)", border: `1px solid ${T.gold}20`,
                borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.txt, marginBottom: 4 }}>Upgrade to see full data</div>
                <div style={{ fontSize: 11, color: T.sub, marginBottom: 14, lineHeight: 1.5 }}>
                  Ad performance, supplier details, AliExpress links, competitor analysis, trend charts, and country breakdown are available with Pro.
                </div>
                <button onClick={() => { if (onPaywall) onPaywall(); }} style={{
                  padding: "10px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: GOLD_GRADIENT, color: "#060710", fontSize: 13, fontWeight: 800, fontFamily: T.ff,
                }}>
                  Upgrade to Pro — $49/mo
                </button>
              </div>
            ) : (
              <>
                <Section icon="◎" title="AD PERFORMANCE">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    <SmallStat label={t.cpc} value={`${product.cpc}€`} color={product.cpc <= 0.4 ? T.green : T.blue} />
                    <SmallStat label={t.ctr} value={`${product.ctr}%`} color={product.ctr >= 4 ? T.green : T.blue} />
                    <SmallStat label={t.convRate} value={`${product.convRate}%`} color={product.convRate >= 4 ? T.green : T.blue} />
                    <SmallStat label={t.engagement} value={`${product.engagement}%`} color={product.engagement >= 70 ? T.green : T.blue} />
                  </div>
                </Section>

                <Section icon="◫" title="SUPPLIER & LOGISTICS">
                  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    {[
                      [t.supplier, product.supplier],
                      [t.shipping, product.shipping],
                      [t.rating, `⭐ ${product.reviews}`],
                    ].map(([key, val], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                        <span style={{ fontSize: 11, color: T.sub }}>{key}</span>
                        <span style={{ fontSize: 11, color: T.txt, fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <a href={aliSearchUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px", borderRadius: 10, textDecoration: "none",
                    background: "rgba(255,87,34,0.06)", border: "1px solid rgba(255,87,34,0.15)",
                    cursor: "pointer",
                  }}>
                    <span style={{ fontSize: 14 }}>🔗</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#FF5722" }}>Search on AliExpress</span>
                  </a>
                </Section>
              </>
            )}

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {product.tags.map((tag, i) => <Badge key={i} color={color}>{tag}</Badge>)}
            </div>
          </>
        )}

        {/* TAB: Trend */}
        {activeTab === "trend" && (
          <>
            <Section icon="📈" title="30-DAY TREND">
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 12px" }}>
                {/* Mini chart using SVG */}
                <svg viewBox="0 0 400 120" style={{ width: "100%", height: 120 }}>
                  <defs>
                    <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendDirection === "up" ? T.green : T.red} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={trendDirection === "up" ? T.green : T.red} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d={`M0,${120 - trendData[0].value} ${trendData.map((d, i) => `L${(i / 29) * 400},${120 - d.value}`).join(" ")} L400,120 L0,120 Z`}
                    fill={`url(#grad-${product.id})`}
                  />
                  {/* Line */}
                  <polyline
                    points={trendData.map((d, i) => `${(i / 29) * 400},${120 - d.value}`).join(" ")}
                    fill="none" stroke={trendDirection === "up" ? T.green : T.red}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm }}>30 days ago</span>
                  <span style={{ fontSize: 9, color: trendDirection === "up" ? T.green : T.red, fontWeight: 700, fontFamily: T.fm }}>
                    {trendDirection === "up" ? "↑ Growing" : "↓ Declining"}
                  </span>
                  <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm }}>Today</span>
                </div>
              </div>
            </Section>

            <Section icon="📊" title="MARKET METRICS">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                <SmallStat label={t.orders30} value={product.orders30d.toLocaleString()} />
                <SmallStat label={t.ordersDay} value={Math.round(product.orders30d / 30)} />
                <SmallStat label={t.trend} value={`${product.trend}%`} color={product.trend >= 80 ? T.green : T.blue} />
                <SmallStat label={t.engagement} value={`${product.engagement}%`} color={product.engagement >= 80 ? T.green : T.blue} />
                <SmallStat label={t.competition} value={`${product.competition}%`} color={product.competition <= 25 ? T.green : T.red} />
                <SmallStat label={t.saturation} value={`${product.saturation}%`} color={product.saturation <= 25 ? T.green : T.red} />
              </div>
            </Section>

            <Section icon="🌍" title="TOP COUNTRIES">
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                {countries.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < countries.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: 12, width: 130 }}>{c.name}</span>
                    <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${c.pct}%`, height: "100%", background: i === 0 ? T.gold : i < 3 ? T.green : T.blue, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, color: T.sub, fontFamily: T.fm, width: 30, textAlign: "right" }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* TAB: Media */}
        {activeTab === "media" && (
          <>
            <Section icon="📸" title="PRODUCT IMAGES">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Product", idOffset: 0 },
                  { label: "Alternate", idOffset: 200 },
                  { label: "Lifestyle", idOffset: 400 },
                  { label: "Package", idOffset: 600 },
                ].map((img, i) => (
                  <div key={i} style={{
                    height: 140, borderRadius: 12, overflow: "hidden", position: "relative",
                    border: `1px solid ${T.border}`,
                  }}>
                    <ProductImage product={{ ...product, id: product.id + img.idOffset }} height={140} />
                    <span style={{
                      position: "absolute", bottom: 8, left: 8, fontSize: 9, fontWeight: 700,
                      color: "#fff", fontFamily: T.fm, background: "rgba(0,0,0,0.5)",
                      padding: "3px 10px", borderRadius: 5, backdropFilter: "blur(4px)",
                    }}>
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* AliExpress images link */}
              <a href={aliSearchUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px", borderRadius: 10, marginTop: 12, textDecoration: "none",
                background: "rgba(255,87,34,0.06)", border: "1px solid rgba(255,87,34,0.15)",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 14 }}>🛒</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#FF5722" }}>View all images on AliExpress</span>
              </a>
            </Section>

            <Section icon="🎬" title="VIDEO ADS">
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>▶️</div>
                <div style={{ fontSize: 12, color: T.sub, marginBottom: 4 }}>Ad creatives found on {product.platforms[0]}</div>
                <div style={{ fontSize: 10, color: T.dim, fontFamily: T.fm }}>
                  {Math.round(2 + product.id % 8)} video ads detected
                </div>
                {product.platforms.map((pl, i) => (
                  <a key={i} href={`https://www.${pl.toLowerCase()}.com/search?q=${encodeURIComponent(product.name.replace(/ V\d+/, ""))}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "6px 14px", borderRadius: 8, margin: "8px 4px 0",
                      background: `${PLATFORM_COLORS[pl]}12`, border: `1px solid ${PLATFORM_COLORS[pl]}25`,
                      textDecoration: "none", cursor: "pointer",
                    }}>
                    <span style={{ fontSize: 10, color: PLATFORM_COLORS[pl], fontWeight: 700, fontFamily: T.fm }}>{PLATFORM_ICONS[pl]} {pl}</span>
                  </a>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* TAB: Competitors */}
        {activeTab === "competitors" && (
          <>
            <Section icon="🏪" title="COMPETITOR STORES">
              {competitors.map((comp, i) => (
                <div key={i} style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
                  padding: "12px 14px", marginBottom: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 2 }}>{comp.name}</div>
                    <div style={{ fontSize: 10, color: T.dim, fontFamily: T.fm }}>{comp.orders.toLocaleString()} orders · ⭐ {comp.rating}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.txt, fontFamily: T.fm }}>{comp.price}€</div>
                    <div style={{ fontSize: 9, color: parseFloat(comp.price) > product.sellPrice ? T.green : T.red, fontFamily: T.fm }}>
                      {parseFloat(comp.price) > product.sellPrice ? "Higher ↑" : "Lower ↓"}
                    </div>
                  </div>
                </div>
              ))}
            </Section>

            <Section icon="⚔️" title="COMPETITION ANALYSIS">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                <SmallStat label="Active sellers" value={Math.round(5 + product.competition * 0.4)} color={product.competition <= 25 ? T.green : T.red} />
                <SmallStat label="Avg price" value={`${(product.sellPrice * (0.85 + rng2() * 0.3)).toFixed(2)}€`} />
                <SmallStat label="Market saturation" value={`${product.saturation}%`} color={product.saturation <= 25 ? T.green : T.red} />
                <SmallStat label="Entry difficulty" value={product.competition <= 20 ? "Easy" : product.competition <= 40 ? "Medium" : "Hard"} color={product.competition <= 20 ? T.green : product.competition <= 40 ? T.gold : T.red} />
              </div>
            </Section>
          </>
        )}

        {/* TAB: AI Intel */}
        {activeTab === "ai" && (
          <Section icon="◈" title="AI INTELLIGENCE (LIVE)">
            {aiLoading && (
              <div style={{ textAlign: "center", padding: 30 }}>
                <div style={{ fontSize: 24, marginBottom: 10, animation: "spin 2s linear infinite" }}>◈</div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                <div style={{ fontSize: 12, color: T.gold }}>AI is searching the web for real-time data...</div>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>Analyzing suppliers, trends & competitors</div>
              </div>
            )}
            {aiData && (
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
                padding: 16, whiteSpace: "pre-wrap", fontSize: 12, color: T.sub,
                lineHeight: 1.7, fontFamily: T.ff,
              }}>
                {aiData}
              </div>
            )}
            {!aiLoading && !aiData && (
              <div style={{ textAlign: "center", padding: 20 }}>
                <button onClick={fetchAIData} style={{
                  padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: GOLD_GRADIENT, color: "#060710", fontSize: 13, fontWeight: 800,
                }}>
                  ◈ Fetch Live AI Intelligence
                </button>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 8 }}>Uses web search to find real-time data</div>
              </div>
            )}
          </Section>
        )}
      </div>
    </>
  );
}

/* ═══════════════════ AI LAB ═══════════════════ */
function AILab() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [nicheInput, setNicheInput] = useState("");
  const [error, setError] = useState("");
  const [autoPilot, setAutoPilot] = useState(false);

  const discover = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an expert dropshipping product researcher. Generate exactly 6 winning product ideas${nicheInput ? ` for the "${nicheInput}" niche` : ""} for March 2026. Respond ONLY in valid JSON (no backticks, no markdown). Array of objects with: name (string), niche (string), aliPrice (number), sellPrice (number), margin (string like "72%"), whyWinner (1 sentence), trendScore (number 75-99), tags (array of 3 strings), viral (boolean), platform (string: TikTok or Instagram or Facebook), emoji (single emoji)`
          }],
        }),
      });
      const data = await resp.json();
      const text = (data.content || []).map((item) => item.text || "").join("");
      const cleaned = text.replace(/```json|```/g, "").trim();
      setAiResults(JSON.parse(cleaned));
    } catch (e) {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Auto-Pilot Banner */}
      <div style={{
        background: autoPilot ? "rgba(45,212,160,0.06)" : "rgba(207,171,59,0.04)",
        border: `1px solid ${autoPilot ? "rgba(45,212,160,0.2)" : T.gold + "20"}`,
        borderRadius: 16, padding: 24, marginBottom: 28,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: T.txt }}>{t.autoPilot}</span>
              {autoPilot && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
              )}
            </div>
            <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.6 }}>{t.autoPilotDesc}</div>
          </div>
          <button
            onClick={() => setAutoPilot(!autoPilot)}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: autoPilot ? T.green : GOLD_GRADIENT,
              color: "#060710", fontSize: 12, fontWeight: 800, fontFamily: T.ff,
            }}
          >
            {autoPilot ? t.autoPilotOn : t.autoPilotOff}
          </button>
        </div>

        {autoPilot && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 18 }}>
            {[
              [t.addedToday, "+7", T.green],
              [t.removedToday, "-3", T.red],
              [t.aiAccuracy, "94.2%", T.gold],
              [t.nextScan, "2h 14m", T.cyan],
            ].map(([label, value, color], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 8, color: T.dim, fontFamily: T.fm, letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: T.fm }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Discovery */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 6 }}>{t.aiTitle}</div>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 16 }}>{t.aiDesc}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            placeholder={t.aiNiche}
            style={{
              flex: "1 1 250px", padding: "11px 16px", borderRadius: 10,
              border: `1px solid ${T.border}`, background: T.surface,
              color: T.txt, fontSize: 13, outline: "none", fontFamily: T.ff,
            }}
            onFocus={(e) => { e.target.style.borderColor = `${T.gold}40`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; }}
          />
          <button
            onClick={discover}
            disabled={loading}
            style={{
              padding: "11px 28px", borderRadius: 10, border: "none",
              cursor: loading ? "wait" : "pointer",
              background: loading ? "rgba(207,171,59,0.15)" : GOLD_GRADIENT,
              color: loading ? T.gold : "#060710",
              fontSize: 13, fontWeight: 800, fontFamily: T.ff,
            }}
          >
            {loading ? `◈ ${t.aiAnalyzing}` : `◈ ${t.aiGenerate}`}
          </button>
        </div>
      </div>

      {error && <div style={{ color: T.red, marginBottom: 16, fontSize: 12 }}>{error}</div>}

      {/* AI Results */}
      {aiResults.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {aiResults.map((p, i) => (
            <div key={i} style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
              overflow: "hidden", animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
            }}>
              <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div style={{
                height: 72, background: `linear-gradient(135deg, ${T.elevated}, ${T.surface})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", borderBottom: `1px solid ${T.border}`,
              }}>
                <span style={{ fontSize: 32 }}>{p.emoji || "🎯"}</span>
                <div style={{ position: "absolute", top: 8, left: 8 }}>
                  <Badge color={PLATFORM_COLORS[p.platform] || T.gold}>{p.platform || "Multi"}</Badge>
                </div>
                {p.viral && (
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <Badge color={T.red}>VIRAL 🔥</Badge>
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.txt, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: T.dim, fontFamily: T.fm, marginBottom: 10 }}>{p.niche}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {[
                    ["BUY", `${p.aliPrice?.toFixed(2)}€`, T.sub],
                    ["SELL", `${p.sellPrice?.toFixed(2)}€`, T.txt],
                    ["MARGIN", p.margin, null],
                  ].map(([label, val, col], j) => (
                    <div key={j} style={{ flex: 1, background: j === 2 ? "rgba(207,171,59,0.04)" : "rgba(255,255,255,0.02)", borderRadius: 7, padding: "7px 9px" }}>
                      <div style={{ fontSize: 7, color: T.dim, fontFamily: T.fm }}>{label}</div>
                      {col ? (
                        <div style={{ fontSize: 12, fontWeight: 700, color: col, fontFamily: T.fm }}>{val}</div>
                      ) : (
                        <div style={{ fontSize: 12, fontWeight: 800, fontFamily: T.fm }}><GoldText>{val}</GoldText></div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 8, color: T.dim }}>Trend Score</span>
                    <span style={{ fontSize: 8, color: T.gold, fontFamily: T.fm }}>{p.trendScore}/100</span>
                  </div>
                  <MiniBar value={p.trendScore || 70} color={T.gold} />
                </div>
                <div style={{ fontSize: 11, color: T.sub, fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>
                  &ldquo;{p.whyWinner}&rdquo;
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {(p.tags || []).map((tag, j) => <Badge key={j}>{tag}</Badge>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && aiResults.length === 0 && (
        <div style={{ textAlign: "center", padding: 50 }}>
          <div style={{ fontSize: 40, opacity: 0.15, marginBottom: 8 }}>◈</div>
          <div style={{ color: T.sub, fontSize: 13 }}>{t.aiDesc}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ PRICING ═══════════════════ */
function PricingView() {
  const { t } = useLang();

  const plans = [
    { name: "Starter", price: "$0", per: "", features: ["100 products/day", "Basic Winner Score", "3 platforms", "7-day history"], popular: false, gold: false, cta: t.free },
    { name: "Pro", price: "$49", per: t.mo, features: ["Unlimited products", "Winner Score™ Advanced", "All 7 platforms", "30-day data + trends", "AI Auto-Pilot", "Export CSV & API", "Priority support"], popular: true, gold: true, cta: t.getStarted },
    { name: "Business", price: "$149", per: t.mo, features: ["Everything in Pro", "Team (5 seats)", "Custom alerts", "Account manager", "White-label reports", "60-day history"], popular: false, gold: false, cta: t.getStarted },
    { name: "Enterprise", price: "Custom", per: "", features: ["Everything in Business", "Unlimited seats", "Custom integrations", "SLA guarantee", "On-premise", "24/7 support"], popular: false, gold: false, cta: t.contactUs },
  ];

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 3, marginBottom: 8 }}>◆ PRICING</div>
        <h2 style={{ fontSize: 30, fontWeight: 300, fontFamily: T.fd, margin: 0, color: T.txt }}>
          Choose your <GoldText style={{ fontWeight: 700 }}>plan</GoldText>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))", gap: 14, alignItems: "start" }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            background: T.card, borderRadius: 16, padding: "24px 18px", position: "relative",
            border: `1px solid ${plan.gold ? T.gold + "40" : T.border}`,
            boxShadow: plan.gold ? "0 0 30px rgba(207,171,59,0.06)" : "none",
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
                background: GOLD_GRADIENT, color: "#060710", fontSize: 9, fontWeight: 800,
                padding: "3px 12px", borderRadius: 5, fontFamily: T.fm,
              }}>
                {t.popular}
              </div>
            )}
            <div style={{ fontSize: 12, fontWeight: 700, color: plan.gold ? T.gold : T.sub, marginBottom: 6, fontFamily: T.fm }}>{plan.name}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: T.txt, fontFamily: T.fm, marginBottom: 2 }}>
              {plan.price}<span style={{ fontSize: 12, color: T.dim, fontWeight: 400 }}>{plan.per}</span>
            </div>
            <div style={{ height: 1, background: T.border, margin: "14px 0" }} />
            {plan.features.map((feat, j) => (
              <div key={j} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: T.gold, fontSize: 10, marginTop: 1 }}>◆</span>
                <span style={{ fontSize: 11, color: T.sub, lineHeight: 1.3 }}>{feat}</span>
              </div>
            ))}
            <button style={{
              width: "100%", padding: "10px", borderRadius: 9, marginTop: 12, cursor: "pointer",
              border: plan.gold ? "none" : `1px solid ${T.border}`,
              background: plan.gold ? GOLD_GRADIENT : "rgba(255,255,255,0.03)",
              color: plan.gold ? "#060710" : T.sub, fontSize: 12, fontWeight: 700, fontFamily: T.ff,
            }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ PRODUCTS VIEW ═══════════════════ */
function ProductsListView({ products, onSelect, platformFilter, onPaywall, isUnlocked }) {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("All");
  const [sort, setSort] = useState("score");
  const [elite, setElite] = useState(false);
  const [viral, setViral] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;
  const nicheList = ["All", ...NICHES.map((n) => n.n)];

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.niche.toLowerCase().includes(q) && !p.tags.some((tg) => tg.toLowerCase().includes(q))) return false;
      }
      if (niche !== "All" && p.niche !== niche) return false;
      if (platformFilter && !p.platforms.includes(platformFilter)) return false;
      if (elite && calcScore(p) < 85) return false;
      if (viral && !p.viral) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sort === "score") return calcScore(b) - calcScore(a);
      if (sort === "profit") return (b.sellPrice - b.aliPrice) - (a.sellPrice - a.aliPrice);
      if (sort === "trend") return b.trend - a.trend;
      if (sort === "orders") return b.orders30d - a.orders30d;
      return 0;
    });

    return result;
  }, [products, search, niche, sort, elite, viral, platformFilter]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = paged.length < filtered.length;

  useEffect(() => { setPage(1); }, [search, niche, sort, elite, viral, platformFilter]);

  const filterBtn = (active, onClick, label) => (
    <button onClick={onClick} style={{
      padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 10, fontWeight: 700,
      fontFamily: T.fm, background: active ? "rgba(207,171,59,0.1)" : "rgba(255,255,255,0.02)",
      color: active ? T.gold : T.sub, border: `1px solid ${active ? T.gold + "30" : T.border}`,
      transition: "all 0.15s",
    }}>
      {label}
    </button>
  );

  return (
    <div>
      {platformFilter && (
        <div style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 8, background: `${PLATFORM_COLORS[platformFilter]}10`, border: `1px solid ${PLATFORM_COLORS[platformFilter]}20` }}>
          <span style={{ color: PLATFORM_COLORS[platformFilter], fontSize: 14 }}>{PLATFORM_ICONS[platformFilter]}</span>
          <span style={{ color: PLATFORM_COLORS[platformFilter], fontSize: 13, fontWeight: 700 }}>{platformFilter}</span>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            style={{
              width: "100%", padding: "8px 12px 8px 30px", borderRadius: 8,
              border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)",
              color: T.txt, fontSize: 12, outline: "none", fontFamily: T.ff, boxSizing: "border-box",
            }}
            onFocus={(e) => { e.target.style.borderColor = `${T.gold}40`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; }}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, opacity: 0.2 }}>⌕</span>
        </div>

        <select value={niche} onChange={(e) => setNiche(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.txt, fontSize: 11, fontFamily: T.ff, cursor: "pointer" }}>
          {nicheList.map((n) => <option key={n} value={n} style={{ background: T.card }}>{n === "All" ? t.all : n}</option>)}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.txt, fontSize: 11, fontFamily: T.ff, cursor: "pointer" }}>
          {[["score", t.score], ["profit", t.profit], ["trend", t.trend], ["orders", t.orders]].map(([val, label]) => (
            <option key={val} value={val} style={{ background: T.card }}>{label} ↓</option>
          ))}
        </select>

        {filterBtn(elite, () => setElite(!elite), "◆ " + t.eliteOnly)}
        {filterBtn(viral, () => setViral(!viral), "🔥 " + t.viralOnly)}
      </div>

      <div style={{ fontSize: 10, color: T.dim, fontFamily: T.fm, marginBottom: 10 }}>
        {filtered.length.toLocaleString()} {t.results}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {paged.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => onSelect(p)}
            delay={Math.min(i, 16) * 30}
            locked={!isUnlocked && i >= 5}
            onPaywall={onPaywall}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setPage(page + 1)}
            style={{
              padding: "10px 28px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)",
              color: T.sub, fontFamily: T.ff,
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = `${T.gold}40`; }}
            onMouseLeave={(e) => { e.target.style.borderColor = T.border; }}
          >
            {t.loadMore} ({(filtered.length - paged.length).toLocaleString()})
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 50 }}>
          <div style={{ fontSize: 32, opacity: 0.12, marginBottom: 6 }}>⌕</div>
          <div style={{ color: T.sub, fontSize: 12 }}>{t.noResults}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ LANGUAGE SELECTOR ═══════════════════ */
function LangSelector({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
        borderRadius: 7, padding: "5px 10px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 5, color: T.sub, fontSize: 11, width: "100%",
      }}>
        <span>{TRANSLATIONS[lang].flag}</span>
        <span style={{ fontSize: 9 }}>{TRANSLATIONS[lang].name}</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", bottom: "100%", left: 0, marginBottom: 6,
          background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10,
          padding: 4, zIndex: 300, width: 170, maxHeight: 280, overflowY: "auto",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}>
          {Object.entries(TRANSLATIONS).map(([code, data]) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              style={{
                width: "100%", padding: "6px 10px", borderRadius: 6, border: "none",
                background: lang === code ? "rgba(207,171,59,0.1)" : "transparent",
                color: lang === code ? T.gold : T.sub, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7, fontSize: 11,
                fontFamily: T.ff, textAlign: "left",
              }}
            >
              <span style={{ fontSize: 14 }}>{data.flag}</span>
              {data.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ PAYWALL MODAL ═══════════════════ */
function PaywallModal({ onClose, onNavigatePricing, onUpgrade, currentPlan, credits }) {
  const { t } = useLang();

  const plans = [
    {
      name: "Pro",
      key: "pro",
      price: "$49",
      per: t.mo || "/mo",
      badge: t.popular || "Most Popular",
      credits: "100 credits / day",
      features: [
        "100 product views per day",
        "Winner Score™ Advanced",
        "All 7 platforms",
        "30-day data + trends",
        "AI Auto-Pilot",
        "Export CSV & API",
        "Priority support",
      ],
      gold: true,
    },
    {
      name: "Business",
      key: "business",
      price: "$149",
      per: t.mo || "/mo",
      badge: null,
      credits: "∞ Unlimited credits",
      features: [
        "Unlimited product views",
        "Everything in Pro",
        "Team collaboration (5 seats)",
        "Custom alerts & webhooks",
        "Dedicated account manager",
        "White-label reports",
        "60-day data history",
      ],
      gold: false,
    },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 1100, backdropFilter: "blur(8px)",
        }}
      />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 1101, width: "min(680px, 94vw)", maxHeight: "90vh", overflowY: "auto",
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: 24,
        padding: "0", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "modalIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: "32px 32px 0", textAlign: "center",
          background: `linear-gradient(180deg, rgba(207,171,59,0.06) 0%, transparent 100%)`,
          borderRadius: "24px 24px 0 0",
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16, width: 32, height: 32,
              borderRadius: 8, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.04)",
              color: T.sub, cursor: "pointer", fontSize: 14, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: 40, marginBottom: 12 }}>🔓</div>
          <h2 style={{
            fontSize: 26, fontWeight: 300, color: T.txt, fontFamily: T.fd, margin: "0 0 8px",
          }}>
            Unlock <GoldText style={{ fontWeight: 700 }}>Premium</GoldText> Access
          </h2>
          {credits !== undefined && credits !== Infinity && credits <= 0 ? (
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: 8,
              background: "rgba(239,100,97,0.08)", border: "1px solid rgba(239,100,97,0.2)",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 12, color: T.red, fontWeight: 700, fontFamily: T.fm }}>
                ⚠ You've used all your credits for today
              </span>
            </div>
          ) : credits !== undefined && credits !== Infinity ? (
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: 8,
              background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 12, color: "#FB923C", fontWeight: 700, fontFamily: T.fm }}>
                Only {credits} credits remaining today
              </span>
            </div>
          ) : null}
          <p style={{ fontSize: 13, color: T.sub, marginBottom: 24, lineHeight: 1.6 }}>
            Upgrade to get more daily credits, advanced analytics, AI Auto-Pilot, and full platform access.
          </p>

          {/* Trust bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 20, marginBottom: 24, flexWrap: "wrap",
          }}>
            {[
              ["50,000+", "Dropshippers"],
              ["94.2%", "Accuracy"],
              ["250K+", "Products"],
              ["190+", "Countries"],
            ].map(([val, label], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.gold, fontFamily: T.fm }}>{val}</div>
                <div style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, letterSpacing: 0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div style={{ padding: "0 32px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: T.card, borderRadius: 16, padding: "22px 18px", position: "relative",
              border: `1px solid ${plan.gold ? T.gold + "40" : T.border}`,
              boxShadow: plan.gold ? "0 0 30px rgba(207,171,59,0.06)" : "none",
            }}>
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
                  background: GOLD_GRADIENT, color: "#060710", fontSize: 9, fontWeight: 800,
                  padding: "3px 12px", borderRadius: 5, fontFamily: T.fm, whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: 12, fontWeight: 700, color: plan.gold ? T.gold : T.sub, marginBottom: 6, fontFamily: T.fm }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.txt, fontFamily: T.fm, marginBottom: 2 }}>
                {plan.price}
                <span style={{ fontSize: 12, color: T.dim, fontWeight: 400 }}>{plan.per}</span>
              </div>
              <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 6, marginBottom: 4,
                background: plan.key === "business" ? "rgba(167,139,250,0.08)" : "rgba(45,212,160,0.08)",
                border: `1px solid ${plan.key === "business" ? "rgba(167,139,250,0.2)" : "rgba(45,212,160,0.2)"}`,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, fontFamily: T.fm,
                  color: plan.key === "business" ? "#A78BFA" : T.green,
                }}>
                  {plan.credits}
                </span>
              </div>
              <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
              {plan.features.map((feat, j) => (
                <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 7 }}>
                  <span style={{ color: T.gold, fontSize: 9, marginTop: 2 }}>◆</span>
                  <span style={{ fontSize: 11, color: T.sub, lineHeight: 1.3 }}>{feat}</span>
                </div>
              ))}
              <button
                onClick={() => { if (onUpgrade) onUpgrade(plan.key); }}
                style={{
                  width: "100%", padding: "11px", borderRadius: 10, marginTop: 10, cursor: "pointer",
                  border: plan.gold ? "none" : `1px solid ${T.border}`,
                  background: plan.gold ? GOLD_GRADIENT : "rgba(255,255,255,0.04)",
                  color: plan.gold ? "#060710" : T.sub,
                  fontSize: 13, fontWeight: 800, fontFamily: T.ff,
                  transition: "all 0.2s",
                }}>
                {currentPlan === plan.key ? "Current Plan" : (t.getStarted || "Get Started")}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 32px 24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
            {["🔒 Secure Payment", "↩ 14-day Refund", "⚡ Instant Access", "💬 24/7 Support"].map((item, i) => (
              <span key={i} style={{ fontSize: 10, color: T.sub, fontFamily: T.fm }}>{item}</span>
            ))}
          </div>
          <button
            onClick={() => { onClose(); if (onNavigatePricing) onNavigatePricing(); }}
            style={{
              background: "none", border: "none", color: T.gold, cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: T.ff, textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Compare all plans →
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ CREDIT SYSTEM ═══════════════════ */
const PLANS = {
  free: { name: "Starter", maxCredits: 3, dailyCredits: 3, canAI: false, canExport: false, platformLimit: 1, historyDays: 3, maxProducts: 20, canSeeCompetitors: false, canSeeTrend: false, canSeeCountries: false },
  pro: { name: "Pro", maxCredits: 100, dailyCredits: 100, canAI: true, canExport: true, platformLimit: 7, historyDays: 30, maxProducts: Infinity, canSeeCompetitors: true, canSeeTrend: true, canSeeCountries: true },
  business: { name: "Business", maxCredits: Infinity, dailyCredits: Infinity, canAI: true, canExport: true, platformLimit: 7, historyDays: 60, maxProducts: Infinity, canSeeCompetitors: true, canSeeTrend: true, canSeeCountries: true },
  admin: { name: "Admin ∞", maxCredits: Infinity, dailyCredits: Infinity, canAI: true, canExport: true, platformLimit: 7, historyDays: 999, maxProducts: Infinity, canSeeCompetitors: true, canSeeTrend: true, canSeeCountries: true },
};

const ADMIN_CODE = "DROPELITE2026";

/* ═══════════════════ CREDIT BAR COMPONENT ═══════════════════ */
function CreditBar({ credits, maxCredits, plan, onUpgrade, collapsed }) {
  const pct = maxCredits === Infinity ? 100 : Math.round((credits / maxCredits) * 100);
  const isLow = maxCredits !== Infinity && credits <= 3;
  const barColor = maxCredits === Infinity ? T.gold : isLow ? T.red : credits <= maxCredits * 0.3 ? T.orange || "#FB923C" : T.green;

  if (collapsed) {
    return (
      <div style={{ textAlign: "center", padding: "6px 4px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, margin: "0 auto",
          background: `${barColor}15`, border: `1px solid ${barColor}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: barColor, fontFamily: T.fm,
        }}>
          {maxCredits === Infinity ? "∞" : credits}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: "12px 10px", borderRadius: 10,
      background: isLow ? "rgba(239,100,97,0.06)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isLow ? "rgba(239,100,97,0.15)" : T.border}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, letterSpacing: 1 }}>CREDITS</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: barColor, fontFamily: T.fm }}>
          {maxCredits === Infinity ? "∞ Unlimited" : `${credits} / ${maxCredits}`}
        </span>
      </div>
      {maxCredits !== Infinity && (
        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 2,
            background: barColor, transition: "width 0.4s ease, background 0.3s ease",
          }} />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 9, fontWeight: 700, fontFamily: T.fm, letterSpacing: 0.5,
          padding: "2px 8px", borderRadius: 4,
          background: plan === "admin" ? "rgba(207,171,59,0.15)" : plan === "business" ? "rgba(167,139,250,0.12)" : plan === "pro" ? "rgba(45,212,160,0.1)" : "rgba(255,255,255,0.04)",
          color: plan === "admin" ? T.gold : plan === "business" ? "#A78BFA" : plan === "pro" ? T.green : T.sub,
        }}>
          {PLANS[plan].name}
        </span>
        {plan !== "admin" && plan !== "business" && (
          <button onClick={onUpgrade} style={{
            fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
            background: isLow ? GOLD_GRADIENT : "rgba(207,171,59,0.1)",
            color: isLow ? "#060710" : T.gold,
            border: "none", cursor: "pointer", fontFamily: T.fm,
          }}>
            Upgrade
          </button>
        )}
      </div>
      {isLow && maxCredits !== Infinity && (
        <div style={{ fontSize: 9, color: T.red, marginTop: 6, textAlign: "center", fontFamily: T.fm }}>
          ⚠ Low credits — Upgrade for more
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ ADMIN LOGIN MODAL ═══════════════════ */
function AdminModal({ onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code === ADMIN_CODE) {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1100, backdropFilter: "blur(6px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 1101, width: "min(400px, 90vw)", background: T.bg,
        border: `1px solid ${T.border}`, borderRadius: 20, padding: "32px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔐</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.txt, fontFamily: T.fd }}>Admin Access</div>
          <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>Enter your admin code</div>
        </div>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Admin code..."
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, marginBottom: 12,
            border: `1px solid ${error ? T.red : T.border}`,
            background: T.surface, color: T.txt, fontSize: 14, outline: "none",
            fontFamily: T.fm, textAlign: "center", letterSpacing: 3, boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
        {error && <div style={{ fontSize: 11, color: T.red, textAlign: "center", marginBottom: 8, fontFamily: T.fm }}>Invalid code</div>}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "12px", borderRadius: 10, border: "none",
          background: GOLD_GRADIENT, color: "#060710", fontSize: 14,
          fontWeight: 800, cursor: "pointer", fontFamily: T.ff,
        }}>
          Unlock Admin
        </button>
        <button onClick={onClose} style={{
          width: "100%", padding: "10px", borderRadius: 10, marginTop: 8,
          border: `1px solid ${T.border}`, background: "transparent",
          color: T.sub, fontSize: 12, cursor: "pointer", fontFamily: T.ff,
        }}>
          Cancel
        </button>
      </div>
    </>
  );
}

/* ═══════════════════ ACCOUNT VIEW ═══════════════════ */
function AccountView({ plan, credits, onUpgrade, onLogout }) {
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const currentPlan = PLANS[plan];

  const handleCancel = () => {
    setCancelled(true);
    setTimeout(() => { onUpgrade("free"); setShowCancel(false); setCancelled(false); }, 1500);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.txt, fontFamily: T.fd, marginBottom: 4 }}>Mon Compte</div>
        <div style={{ fontSize: 12, color: T.sub }}>Gérez votre abonnement, vos informations et vos préférences</div>
      </div>

      {/* Profile card */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ PROFIL</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#060710", fontFamily: T.fd }}>U</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.txt }}>Utilisateur DropElite</div>
            <div style={{ fontSize: 11, color: T.sub, fontFamily: T.fm }}>user@dropelite.io</div>
          </div>
          <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 6, background: plan === "admin" ? "rgba(207,171,59,0.12)" : plan === "business" ? "rgba(167,139,250,0.1)" : plan === "pro" ? "rgba(45,212,160,0.08)" : "rgba(255,255,255,0.04)", color: plan === "admin" ? T.gold : plan === "business" ? "#A78BFA" : plan === "pro" ? T.green : T.sub, fontSize: 10, fontWeight: 700, fontFamily: T.fm }}>
            {currentPlan.name}
          </div>
        </div>
        {[["Nom complet", "Utilisateur DropElite"], ["Email", "user@dropelite.io"], ["Membre depuis", "Mars 2026"]].map(([label, val], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
            <span style={{ fontSize: 12, color: T.sub }}>{label}</span>
            <span style={{ fontSize: 12, color: T.txt, fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Subscription card */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ ABONNEMENT</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.txt }}>{currentPlan.name}</div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>
              {plan === "free" ? "Gratuit · 3 crédits/jour" : plan === "pro" ? "49€/mois · 100 crédits/jour" : plan === "business" ? "149€/mois · Crédits illimités" : "Admin · Accès total"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: T.sub, fontFamily: T.fm }}>Crédits restants</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.gold, fontFamily: T.fm }}>{credits === Infinity ? "∞" : credits}</div>
          </div>
        </div>

        {plan === "free" ? (
          <button onClick={() => onUpgrade("pro")} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: GOLD_GRADIENT, color: "#060710", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: T.ff }}>
            Passer à Pro — 49€/mois →
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onUpgrade("pro")} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.03)", color: T.sub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.ff }}>
              Changer de plan
            </button>
            <button onClick={() => setShowCancel(true)} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid rgba(239,100,97,0.25)`, background: "rgba(239,100,97,0.05)", color: T.red, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.ff }}>
              Résilier l'abonnement
            </button>
          </div>
        )}
      </div>

      {/* Billing */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ FACTURATION</div>
        {plan === "free" ? (
          <div style={{ fontSize: 12, color: T.dim, textAlign: "center", padding: "12px 0" }}>Aucun paiement enregistré — Plan gratuit</div>
        ) : (
          [["Dernier paiement", "01/03/2026", T.txt], ["Prochain paiement", "01/04/2026", T.gold], ["Méthode", "•••• •••• •••• 4242", T.txt]].map(([label, val, color], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 12, color: T.sub }}>{label}</span>
              <span style={{ fontSize: 12, color, fontWeight: 600, fontFamily: T.fm }}>{val}</span>
            </div>
          ))
        )}
      </div>

      {/* Danger zone */}
      <div style={{ background: T.card, border: `1px solid rgba(239,100,97,0.15)`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.red, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>⚠ ZONE DANGER</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>Se déconnecter</div>
            <div style={{ fontSize: 11, color: T.sub }}>Vous serez redirigé vers la page d'accueil</div>
          </div>
          <button onClick={onLogout} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid rgba(239,100,97,0.3)`, background: "rgba(239,100,97,0.06)", color: T.red, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.ff }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Cancel modal */}
      {showCancel && (
        <>
          <div onClick={() => setShowCancel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1100, backdropFilter: "blur(6px)" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1101, width: "min(420px,90vw)", background: T.bg, border: `1px solid rgba(239,100,97,0.25)`, borderRadius: 20, padding: 32 }}>
            {cancelled ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.txt }}>Abonnement résilié</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>Vous êtes repassé au plan gratuit</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>⚠️</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: T.txt, textAlign: "center", marginBottom: 8 }}>Résilier l'abonnement ?</div>
                <div style={{ fontSize: 12, color: T.sub, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
                  Vous perdrez l'accès à toutes les fonctionnalités Pro à la fin de votre période de facturation. Vous pouvez vous réabonner à tout moment.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowCancel(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.sub, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.ff }}>Annuler</button>
                  <button onClick={handleCancel} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,100,97,0.15)", color: T.red, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: T.ff }}>Confirmer la résiliation</button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════ SETTINGS VIEW ═══════════════════ */
function SettingsView({ lang, setLang }) {
  const [notifs, setNotifs] = useState({ newWinners: true, weeklyReport: true, priceAlerts: false, newsletter: false });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, background: value ? T.green : T.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.txt, fontFamily: T.fd, marginBottom: 4 }}>Paramètres</div>
        <div style={{ fontSize: 12, color: T.sub }}>Personnalisez votre expérience DropElite</div>
      </div>

      {/* Language */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ LANGUE</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(TRANSLATIONS).map(([code, val]) => (
            <button key={code} onClick={() => setLang(code)} style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${lang === code ? T.gold + "50" : T.border}`, background: lang === code ? "rgba(207,171,59,0.08)" : "rgba(255,255,255,0.02)", color: lang === code ? T.gold : T.sub, fontSize: 13, fontWeight: lang === code ? 700 : 400, cursor: "pointer", fontFamily: T.ff, display: "flex", alignItems: "center", gap: 8 }}>
              {val.flag} {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ NOTIFICATIONS</div>
        {[
          ["Nouveaux produits winners", "Soyez alerté dès qu'un nouveau winner est détecté", "newWinners"],
          ["Rapport hebdomadaire", "Résumé des meilleurs produits de la semaine", "weeklyReport"],
          ["Alertes de prix", "Notification quand un prix AliExpress change", "priceAlerts"],
          ["Newsletter", "Conseils et actualités dropshipping", "newsletter"],
        ].map(([title, desc, key], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>{title}</div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{desc}</div>
            </div>
            <Toggle value={notifs[key]} onChange={v => setNotifs(n => ({...n, [key]: v}))} />
          </div>
        ))}
      </div>

      {/* Support */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 16 }}>◆ SUPPORT</div>
        {[
          ["📧", "Email support", "support@dropelite.io", "Réponse sous 24h"],
          ["💬", "Chat en direct", "Chatbot disponible 24/7", "Cliquez sur le bouton en bas à droite"],
          ["📋", "Centre d'aide", "docs.dropelite.io", "Guides et tutoriels"],
        ].map(([icon, title, val, desc], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>{title}</div>
              <div style={{ fontSize: 11, color: T.gold, fontFamily: T.fm }}>{val}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={save} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: saved ? "rgba(45,212,160,0.15)" : GOLD_GRADIENT, color: saved ? T.green : "#060710", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: T.ff, transition: "all 0.2s" }}>
          {saved ? "✓ Sauvegardé !" : "Sauvegarder les paramètres"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════ ADMIN LINKS PANEL ═══════════════════ */
function AdminLinksPanel({ products, aliLinks, setAliLinks }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // product name being edited
  const [form, setForm] = useState({ url: "", aliPrice: "", sellPrice: "" });
  const [saved, setSaved] = useState(null);

  const uniqueNames = [...new Set(products.map(p => p.name.replace(/ V\d+$/, "")))].sort();
  const filtered = search ? uniqueNames.filter(n => n.toLowerCase().includes(search.toLowerCase())) : uniqueNames;

  const startEdit = (name) => {
    setEditing(name);
    const existing = aliLinks[name] || {};
    setForm({ url: existing.url || "", aliPrice: existing.aliPrice || "", sellPrice: existing.sellPrice || "" });
  };

  const saveLink = (name) => {
    if (!form.url || !form.aliPrice || !form.sellPrice) return;
    setAliLinks(prev => ({
      ...prev,
      [name]: { url: form.url, aliPrice: parseFloat(form.aliPrice), sellPrice: parseFloat(form.sellPrice) }
    }));
    setSaved(name);
    setTimeout(() => setSaved(null), 2000);
    setEditing(null);
  };

  const removeLink = (name) => {
    setAliLinks(prev => { const n = {...prev}; delete n[name]; return n; });
  };

  const configuredCount = Object.keys(aliLinks).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>⚙️</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: T.txt }}>Admin Panel — Liens AliExpress</span>
          <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 5, background: "rgba(207,171,59,0.12)", color: T.gold, fontFamily: T.fm, fontWeight: 700 }}>ADMIN ∞</span>
        </div>
        <p style={{ fontSize: 12, color: T.sub, lineHeight: 1.6, margin: 0 }}>
          Pour chaque produit, colle le lien AliExpress direct (copié depuis la page produit) et saisis les vrais prix.<br/>
          Le lien et les prix seront utilisés dans toute l'app.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          ["Produits total", uniqueNames.length, T.txt],
          ["Liens configurés", configuredCount, T.gold],
          ["Restants", uniqueNames.length - configuredCount, T.sub],
        ].map(([label, val, color], i) => (
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 18px", flex: 1 }}>
            <div style={{ fontSize: 8, color: T.dim, fontFamily: T.fm, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: T.fm }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          style={{ width: "100%", padding: "10px 14px 10px 34px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, color: T.txt, fontSize: 12, outline: "none", fontFamily: T.ff, boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = `${T.gold}40`}
          onBlur={e => e.target.style.borderColor = T.border}
        />
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, opacity: 0.3 }}>⌕</span>
      </div>

      {/* Product list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.slice(0, 80).map(name => {
          const linked = aliLinks[name];
          const isEditing = editing === name;
          return (
            <div key={name} style={{
              background: T.card, border: `1px solid ${linked ? T.gold + "30" : T.border}`,
              borderRadius: 12, padding: "14px 16px", transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>{name}</div>
                  {linked && !isEditing && (
                    <div style={{ fontSize: 10, color: T.sub, marginTop: 3, fontFamily: T.fm }}>
                      <span style={{ color: T.green }}>✓</span> {linked.url.slice(0, 55)}... · <span style={{ color: T.gold }}>{linked.aliPrice}€ achat</span> · <span style={{ color: T.txt }}>{linked.sellPrice}€ vente</span>
                    </div>
                  )}
                  {!linked && !isEditing && (
                    <div style={{ fontSize: 9, color: T.dim, marginTop: 2, fontFamily: T.fm }}>Aucun lien configuré</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {saved === name && <span style={{ fontSize: 10, color: T.green, fontFamily: T.fm, fontWeight: 700 }}>✓ Sauvegardé</span>}
                  {linked && !isEditing && (
                    <button onClick={() => removeLink(name)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${T.red}25`, background: "rgba(239,100,97,0.06)", color: T.red, fontSize: 10, cursor: "pointer", fontFamily: T.fm }}>✕</button>
                  )}
                  <button
                    onClick={() => isEditing ? setEditing(null) : startEdit(name)}
                    style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${T.border}`, background: isEditing ? "rgba(255,255,255,0.06)" : linked ? "rgba(207,171,59,0.08)" : "rgba(255,255,255,0.03)", color: linked ? T.gold : T.sub, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: T.fm }}
                  >
                    {isEditing ? "Annuler" : linked ? "Modifier" : "+ Ajouter"}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, marginBottom: 5, letterSpacing: 1 }}>LIEN ALIEXPRESS (URL complète du produit)</div>
                    <input
                      value={form.url}
                      onChange={e => setForm(f => ({...f, url: e.target.value}))}
                      placeholder="https://www.aliexpress.com/item/XXXXXXXXXX.html"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.txt, fontSize: 11, outline: "none", fontFamily: T.fm, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, marginBottom: 5, letterSpacing: 1 }}>PRIX ACHAT (€) sur AliExpress</div>
                      <input
                        value={form.aliPrice}
                        onChange={e => setForm(f => ({...f, aliPrice: e.target.value}))}
                        placeholder="ex: 8.99"
                        type="number" step="0.01"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.txt, fontSize: 12, outline: "none", fontFamily: T.fm, boxSizing: "border-box" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, marginBottom: 5, letterSpacing: 1 }}>PRIX VENTE (€) recommandé</div>
                      <input
                        value={form.sellPrice}
                        onChange={e => setForm(f => ({...f, sellPrice: e.target.value}))}
                        placeholder="ex: 34.99"
                        type="number" step="0.01"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.txt, fontSize: 12, outline: "none", fontFamily: T.fm, boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {form.url && form.aliPrice && (
                      <a href={form.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px", borderRadius: 8, border: `1px solid rgba(255,87,34,0.3)`, background: "rgba(255,87,34,0.06)", color: "#FF5722", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: T.fm, textAlign: "center", textDecoration: "none" }}>
                        🔗 Tester le lien
                      </a>
                    )}
                    <button
                      onClick={() => saveLink(name)}
                      disabled={!form.url || !form.aliPrice || !form.sellPrice}
                      style={{ flex: 2, padding: "9px", borderRadius: 8, border: "none", background: (!form.url || !form.aliPrice || !form.sellPrice) ? "rgba(207,171,59,0.1)" : GOLD_GRADIENT, color: (!form.url || !form.aliPrice || !form.sellPrice) ? T.gold : "#060710", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: T.ff }}
                    >
                      ✓ Sauvegarder
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════ AUTH PAGE (Login / Register) ═══════════════════ */
/* Comptes de démonstration */
const DEMO_ACCOUNTS = [
  { email: "demo@dropelite.io", password: "demo1234", name: "Demo User", plan: "pro" },
  { email: "admin@dropelite.io", password: "admin2024", name: "Admin", plan: "admin" },
  { email: "test@test.com", password: "test1234", name: "Test User", plan: "free" },
];

/* ═══════════════════ FORGOT PASSWORD PAGE ═══════════════════ */
function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("form"); // "form" | "sent"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) { setError("Veuillez entrer votre adresse email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Adresse email invalide."); return; }
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setStep("sent");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Aucun compte trouvé avec cet email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Adresse email invalide.");
      } else {
        setError("Une erreur est survenue. Réessayez dans quelques instants.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.txt, fontFamily:T.ff, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative" }}>
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(207,171,59,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
      <button onClick={onBack} style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:"transparent", color:T.sub, fontSize:12, cursor:"pointer", fontFamily:T.ff }}>← Back</button>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:GOLD_GRADIENT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#060710", fontFamily:"'Playfair Display', serif" }}>D</div>
        <span style={{ fontSize:17, fontWeight:700 }}>Drop<span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Elite</span></span>
      </div>
      <div style={{ width:"100%", maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:"36px 32px", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
        {step === "form" ? (
          <>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🔑</div>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>Mot de passe oublié</div>
              <div style={{ fontSize:12, color:T.sub, lineHeight:1.6 }}>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <div style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace", letterSpacing:1, marginBottom:6 }}>ADRESSE EMAIL</div>
                <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => { if (e.key === "Enter") handleSend(); }} placeholder="you@example.com" type="email" autoFocus
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${error ? T.red : T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff, boxSizing:"border-box" }}
                  onFocus={e => e.target.style.borderColor = error ? T.red : "rgba(207,171,59,0.4)"}
                  onBlur={e => e.target.style.borderColor = error ? T.red : T.border}
                />
                {error && <div style={{ fontSize:11, color:T.red, marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>⚠ {error}</div>}
              </div>
              <button onClick={handleSend} style={{ width:"100%", padding:13, borderRadius:11, border:"none", background: loading ? "rgba(207,171,59,0.3)" : GOLD_GRADIENT, color: loading ? T.gold : "#060710", fontSize:14, fontWeight:800, cursor: loading ? "default" : "pointer", fontFamily:T.ff, marginTop:6, transition:"all 0.2s" }}>
                {loading ? "Envoi en cours..." : "Envoyer le lien →"}
              </button>
            </div>
            <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:T.sub }}>
              Vous vous souvenez ?{" "}<span onClick={onBack} style={{ color:T.gold, cursor:"pointer", fontWeight:700 }}>Se connecter</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>📬</div>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Playfair Display', serif", marginBottom:10 }}>Email envoyé !</div>
            <div style={{ fontSize:13, color:T.sub, lineHeight:1.7, marginBottom:8 }}>Un lien de réinitialisation a été envoyé à</div>
            <div style={{ fontSize:14, fontWeight:700, color:T.gold, fontFamily:"'JetBrains Mono', monospace", marginBottom:20, padding:"8px 14px", background:"rgba(207,171,59,0.08)", borderRadius:8, border:`1px solid rgba(207,171,59,0.15)` }}>{email}</div>
            <div style={{ fontSize:12, color:T.dim, lineHeight:1.7, marginBottom:28 }}>Vérifiez votre boîte de réception et vos spams.<br/>Le lien expire dans <span style={{ color:T.txt }}>30 minutes</span>.</div>
            <button onClick={() => { setStep("form"); setEmail(""); }} style={{ width:"100%", padding:11, borderRadius:10, border:`1px solid ${T.border}`, background:"transparent", color:T.sub, fontSize:13, cursor:"pointer", fontFamily:T.ff, marginBottom:10 }}>
              ← Renvoyer avec un autre email
            </button>
            <button onClick={onBack} style={{ width:"100%", padding:11, borderRadius:10, border:"none", background:GOLD_GRADIENT, color:"#060710", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:T.ff }}>
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AuthPage({ mode, onBack, onEnter }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);
  const isLogin = mode === "login";

  if (showForgot) return <ForgotPasswordPage onBack={() => setShowForgot(false)} />;

  const validate = () => {
    const errs = {};
    setError("");

    if (!form.email.trim()) {
      errs.email = "L'adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Adresse email invalide.";
    }

    if (!form.password) {
      errs.password = "Le mot de passe est requis.";
    } else if (form.password.length < 6) {
      errs.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (!isLogin) {
      if (!form.name.trim()) errs.name = "Le nom est requis.";
      if (!form.confirm) {
        errs.confirm = "Veuillez confirmer votre mot de passe.";
      } else if (form.password !== form.confirm) {
        errs.confirm = "Les mots de passe ne correspondent pas.";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      }
      setLoading(false);
      onEnter();
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email ou mot de passe incorrect.");
        setFieldErrors({ email: true, password: true });
      } else if (err.code === "auth/email-already-in-use") {
        setError("Un compte existe déjà avec cet email.");
        setFieldErrors({ email: true });
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe est trop faible (6 caractères minimum).");
        setFieldErrors({ password: true });
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez dans quelques minutes.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.txt, fontFamily:T.ff, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(207,171,59,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Back button */}
      <button onClick={onBack} style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:"transparent", color:T.sub, fontSize:12, cursor:"pointer", fontFamily:T.ff }}>
        ← Back
      </button>

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:GOLD_GRADIENT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#060710", fontFamily:"'Playfair Display', serif" }}>D</div>
        <span style={{ fontSize:17, fontWeight:700 }}>Drop<span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Elite</span></span>
      </div>

      {/* Card */}
      <div style={{ width:"100%", maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:"36px 32px", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </div>
          <div style={{ fontSize:12, color:T.sub }}>
            {isLogin ? "Sign in to access your DropElite dashboard" : "Start finding winning products today — it's free"}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {!isLogin && (
            <div>
              <div style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace", letterSpacing:1, marginBottom:6 }}>FULL NAME</div>
              <input value={form.name} onChange={e => { setForm(f => ({...f, name: e.target.value})); setFieldErrors(fe => ({...fe, name: ""})); }} placeholder="John Doe"
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${fieldErrors.name ? T.red : T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff, boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor = fieldErrors.name ? T.red : "rgba(207,171,59,0.4)"}
                onBlur={e => e.target.style.borderColor = fieldErrors.name ? T.red : T.border}
              />
              {fieldErrors.name && <div style={{ fontSize:11, color:T.red, marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>⚠ {fieldErrors.name}</div>}
            </div>
          )}

          <div>
            <div style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace", letterSpacing:1, marginBottom:6 }}>EMAIL</div>
            <input value={form.email} onChange={e => { setForm(f => ({...f, email: e.target.value})); setFieldErrors(fe => ({...fe, email: ""})); setError(""); }} placeholder="you@example.com" type="email"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${fieldErrors.email ? T.red : T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff, boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = fieldErrors.email ? T.red : "rgba(207,171,59,0.4)"}
              onBlur={e => e.target.style.borderColor = fieldErrors.email ? T.red : T.border}
            />
            {fieldErrors.email && typeof fieldErrors.email === "string" && <div style={{ fontSize:11, color:T.red, marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>⚠ {fieldErrors.email}</div>}
          </div>

          <div>
            <div style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace", letterSpacing:1, marginBottom:6 }}>PASSWORD</div>
            <input value={form.password} onChange={e => { setForm(f => ({...f, password: e.target.value})); setFieldErrors(fe => ({...fe, password: ""})); setError(""); }} placeholder="••••••••" type="password"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${fieldErrors.password ? T.red : T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff, boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = fieldErrors.password ? T.red : "rgba(207,171,59,0.4)"}
              onBlur={e => e.target.style.borderColor = fieldErrors.password ? T.red : T.border}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
            />
            {fieldErrors.password && typeof fieldErrors.password === "string" && <div style={{ fontSize:11, color:T.red, marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>⚠ {fieldErrors.password}</div>}
          </div>

          {!isLogin && (
            <div>
              <div style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace", letterSpacing:1, marginBottom:6 }}>CONFIRM PASSWORD</div>
              <input value={form.confirm} onChange={e => { setForm(f => ({...f, confirm: e.target.value})); setFieldErrors(fe => ({...fe, confirm: ""})); }} placeholder="••••••••" type="password"
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${fieldErrors.confirm ? T.red : T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff, boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor = fieldErrors.confirm ? T.red : "rgba(207,171,59,0.4)"}
                onBlur={e => e.target.style.borderColor = fieldErrors.confirm ? T.red : T.border}
              />
              {fieldErrors.confirm && <div style={{ fontSize:11, color:T.red, marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>⚠ {fieldErrors.confirm}</div>}
            </div>
          )}

          {/* Erreur globale login */}
          {error && (
            <div style={{
              padding: "11px 14px", borderRadius: 10,
              background: `${T.red}15`, border: `1px solid ${T.red}40`,
              color: T.red, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 15 }}>🔐</span>
              {error}
            </div>
          )}

          {isLogin && (
            <div style={{ textAlign:"right" }}>
              <span onClick={() => setShowForgot(true)} style={{ fontSize:11, color:T.gold, cursor:"pointer", fontFamily:"'JetBrains Mono', monospace" }}>Forgot password?</span>
            </div>
          )}

          <button onClick={handleSubmit} style={{
            width:"100%", padding:13, borderRadius:11, border:"none",
            background: loading ? "rgba(207,171,59,0.3)" : GOLD_GRADIENT,
            color: loading ? T.gold : "#060710",
            fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:T.ff, marginTop:6,
            transition:"all 0.2s",
          }}>
            {loading ? "Loading..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:T.border }} />
          <span style={{ fontSize:10, color:T.dim, fontFamily:"'JetBrains Mono', monospace" }}>OR</span>
          <div style={{ flex:1, height:1, background:T.border }} />
        </div>

        {/* Google */}
        <button onClick={handleSubmit} style={{ width:"100%", padding:12, borderRadius:11, border:`1px solid ${T.border}`, background:"rgba(255,255,255,0.03)", color:T.txt, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:T.ff, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <span style={{ fontSize:16 }}>G</span> Continue with Google
        </button>

        {/* Switch */}
        <div style={{ textAlign:"center", marginTop:22, fontSize:12, color:T.sub }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={onBack} style={{ color:T.gold, cursor:"pointer", fontWeight:700 }}>
            {isLogin ? "Sign up free" : "Sign in"}
          </span>
        </div>
      </div>

      {!isLogin && (
        <div style={{ marginTop:16, fontSize:10, color:T.dim, textAlign:"center", fontFamily:"'JetBrains Mono', monospace" }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ LANDING PAGE ═══════════════════ */
function LandingPage({ onEnter, lang, setLang }) {
  const [email, setEmail] = useState("");
  const [authPage, setAuthPage] = useState(null); // null | "login" | "register"

  if (authPage === "login") return <AuthPage mode="login" onBack={() => setAuthPage(null)} onEnter={onEnter} />;
  if (authPage === "register") return <AuthPage mode="register" onBack={() => setAuthPage(null)} onEnter={onEnter} />;

  const STATS = [
    { val: "250K+", label: "Products tracked" },
    { val: "94.2%", label: "AI Accuracy" },
    { val: "50K+", label: "Dropshippers" },
    { val: "7", label: "Platforms" },
  ];

  const FEATURES = [
    { icon: "◆", title: "Winner Score™", desc: "Our proprietary algorithm ranks every product by profit potential, trend momentum and market saturation." },
    { icon: "📈", title: "Real-Time Trends", desc: "Track viral products across TikTok, Instagram, Facebook and 4 more platforms before your competitors." },
    { icon: "🤖", title: "AI Auto-Pilot", desc: "Let our AI automatically discover winners and remove underperformers from your watchlist every day." },
    { icon: "🌍", title: "Global Insights", desc: "See which countries drive sales, top competitor stores, and optimal ad budgets for every product." },
  ];

  const PRICING = [
    { name: "Starter", price: "Free", desc: "3 product analyses/day", features: ["3 credits/day", "Basic score", "1 platform"], cta: "Start Free", gold: false },
    { name: "Pro", price: "$49", per: "/mo", desc: "For serious dropshippers", features: ["100 credits/day", "All 7 platforms", "AI Auto-Pilot", "Export CSV", "30-day trends"], cta: "Get Pro", gold: true, popular: true },
    { name: "Business", price: "$149", per: "/mo", desc: "For scaling teams", features: ["Unlimited credits", "5 team seats", "White-label reports", "Custom alerts"], cta: "Get Business", gold: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.txt, fontFamily: T.ff, overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
        .land-fade { animation: fadeUp 0.8s ease forwards; }
        .land-btn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 40px rgba(207,171,59,0.3) !important; }
        .feat-card:hover { border-color:rgba(207,171,59,0.3) !important; transform:translateY(-4px); }
        .plan-card:hover { transform:translateY(-6px); }
        * { transition: border-color 0.2s, transform 0.22s; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:64, padding:"0 6%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(8,9,14,0.88)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:GOLD_GRADIENT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#060710", fontFamily:T.fd }}>D</div>
          <span style={{ fontSize:15, fontWeight:700 }}>Drop<span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Elite</span></span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Language selector */}
          <div style={{ display:"flex", gap:2, background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:3 }}>
            {Object.entries(TRANSLATIONS).map(([code, val]) => (
              <button key={code} onClick={() => setLang(code)} style={{ padding:"4px 8px", borderRadius:6, border:"none", background: lang === code ? "rgba(207,171,59,0.15)" : "transparent", color: lang === code ? T.gold : T.dim, fontSize:12, cursor:"pointer", fontFamily:T.fm, fontWeight: lang === code ? 700 : 400, transition:"all 0.15s" }}>
                {val.flag}
              </button>
            ))}
          </div>
          <button onClick={() => setAuthPage("login")} style={{ padding:"8px 20px", borderRadius:8, border:`1px solid ${T.border}`, background:"transparent", color:T.sub, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:T.ff }}>Sign In</button>
          <button onClick={() => setAuthPage("register")} className="land-btn" style={{ padding:"8px 22px", borderRadius:8, border:"none", background:GOLD_GRADIENT, color:"#060710", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:T.ff }}>Start Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 6% 80px", position:"relative", overflow:"hidden" }}>
        {/* Glow */}
        <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(207,171,59,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"18%", left:"8%", width:90, height:90, borderRadius:"50%", border:"1px solid rgba(207,171,59,0.08)", animation:"float 7s ease infinite" }} />
        <div style={{ position:"absolute", top:"35%", right:"6%", width:55, height:55, borderRadius:"50%", border:"1px solid rgba(45,212,160,0.08)", animation:"float 9s ease infinite 2s" }} />

        <div className="land-fade" style={{ animationDelay:"0.1s", opacity:0, marginBottom:20 }}>
          <span style={{ fontSize:10, fontWeight:700, fontFamily:T.fm, letterSpacing:3, padding:"5px 18px", borderRadius:20, background:"rgba(207,171,59,0.07)", border:`1px solid rgba(207,171,59,0.18)`, color:T.gold }}>
            ◆ THE #1 DROPSHIPPING INTELLIGENCE PLATFORM
          </span>
        </div>

        <h1 className="land-fade" style={{ animationDelay:"0.2s", opacity:0, fontSize:"clamp(36px, 6.5vw, 80px)", fontWeight:800, fontFamily:T.fd, lineHeight:1.1, marginBottom:24, maxWidth:880 }}>
          Find Your Next<br />
          <span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontStyle:"italic" }}>Winning Product</span><br />
          Before Anyone Else
        </h1>

        <p className="land-fade" style={{ animationDelay:"0.3s", opacity:0, fontSize:"clamp(14px, 1.8vw, 17px)", color:T.sub, maxWidth:520, lineHeight:1.75, marginBottom:36 }}>
          DropElite analyzes 250,000+ products across 7 platforms daily. Our AI finds winners with proven demand, high margins and low competition.
        </p>

        <div className="land-fade" style={{ animationDelay:"0.4s", opacity:0, display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:14 }}>
          <button onClick={() => setAuthPage("register")} className="land-btn" style={{ padding:"14px 38px", borderRadius:12, border:"none", background:GOLD_GRADIENT, color:"#060710", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:T.ff }}>
            Start For Free →
          </button>
          <button onClick={() => setAuthPage("register")} style={{ padding:"14px 38px", borderRadius:12, border:`1px solid ${T.border}`, background:"rgba(255,255,255,0.03)", color:T.txt, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:T.ff }}>
            View Demo
          </button>
        </div>
        <div className="land-fade" style={{ animationDelay:"0.5s", opacity:0, fontSize:11, color:T.dim, fontFamily:T.fm }}>No credit card required · Free plan available forever</div>

        {/* Stats */}
        <div className="land-fade" style={{ animationDelay:"0.65s", opacity:0, marginTop:64, display:"flex", background:T.card, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", flexWrap:"wrap" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding:"20px 32px", textAlign:"center", borderRight: i < STATS.length-1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize:24, fontWeight:800, fontFamily:T.fm, background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.val}</div>
              <div style={{ fontSize:9, color:T.dim, fontFamily:T.fm, letterSpacing:1.5, marginTop:4 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"80px 6%", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:9, color:T.gold, fontFamily:T.fm, letterSpacing:3, marginBottom:12 }}>◆ FEATURES</div>
          <h2 style={{ fontSize:"clamp(26px, 4vw, 44px)", fontWeight:800, fontFamily:T.fd }}>
            Everything you need to <span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>dominate</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card" style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:26, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.txt, marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:12, color:T.sub, lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding:"80px 6%", maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:9, color:T.gold, fontFamily:T.fm, letterSpacing:3, marginBottom:12 }}>◆ PRICING</div>
          <h2 style={{ fontSize:"clamp(26px, 4vw, 44px)", fontWeight:800, fontFamily:T.fd }}>
            Simple <span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>transparent</span> pricing
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }}>
          {PRICING.map((p, i) => (
            <div key={i} className="plan-card" style={{ background:T.card, border:`1px solid ${p.gold ? T.gold+"45" : T.border}`, borderRadius:20, padding:"28px 22px", position:"relative", boxShadow: p.gold ? "0 0 50px rgba(207,171,59,0.07)" : "none" }}>
              {p.popular && <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:GOLD_GRADIENT, color:"#060710", fontSize:9, fontWeight:800, padding:"3px 16px", borderRadius:6, fontFamily:T.fm, whiteSpace:"nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize:11, fontWeight:700, color: p.gold ? T.gold : T.sub, fontFamily:T.fm, marginBottom:6 }}>{p.name.toUpperCase()}</div>
              <div style={{ fontSize:34, fontWeight:800, fontFamily:T.fm, color:T.txt }}>{p.price}<span style={{ fontSize:12, color:T.dim, fontWeight:400 }}>{p.per}</span></div>
              <div style={{ fontSize:11, color:T.sub, marginBottom:18 }}>{p.desc}</div>
              <div style={{ height:1, background:T.border, marginBottom:16 }} />
              {p.features.map((feat, j) => (
                <div key={j} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:9 }}>
                  <span style={{ color:T.gold, fontSize:8 }}>◆</span>
                  <span style={{ fontSize:12, color:T.sub }}>{feat}</span>
                </div>
              ))}
              <button onClick={() => setAuthPage("register")} style={{ width:"100%", padding:12, borderRadius:10, marginTop:16, border: p.gold ? "none" : `1px solid ${T.border}`, background: p.gold ? GOLD_GRADIENT : "rgba(255,255,255,0.04)", color: p.gold ? "#060710" : T.sub, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:T.ff }}>
                {p.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"80px 6%", textAlign:"center" }}>
        <div style={{ maxWidth:580, margin:"0 auto", background:T.card, border:`1px solid rgba(207,171,59,0.18)`, borderRadius:24, padding:"52px 40px" }}>
          <div style={{ fontSize:9, color:T.gold, fontFamily:T.fm, letterSpacing:3, marginBottom:14 }}>◆ GET STARTED TODAY</div>
          <h2 style={{ fontSize:"clamp(24px, 4vw, 40px)", fontWeight:800, fontFamily:T.fd, marginBottom:14 }}>
            Ready to find your <span style={{ background:GOLD_GRADIENT, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontStyle:"italic" }}>next winner?</span>
          </h2>
          <p style={{ fontSize:13, color:T.sub, marginBottom:28, lineHeight:1.75 }}>Join 50,000+ dropshippers who use DropElite every day.</p>
          <div style={{ display:"flex", gap:10, maxWidth:420, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email..." style={{ flex:"1 1 190px", padding:"12px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:T.surface, color:T.txt, fontSize:13, outline:"none", fontFamily:T.ff }} />
            <button onClick={() => setAuthPage("register")} className="land-btn" style={{ padding:"12px 24px", borderRadius:10, border:"none", background:GOLD_GRADIENT, color:"#060710", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:T.ff, whiteSpace:"nowrap" }}>Start Free →</button>
          </div>
          <div style={{ fontSize:10, color:T.dim, marginTop:12, fontFamily:T.fm }}>No credit card · Cancel anytime · Free plan forever</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${T.border}`, padding:"22px 6%", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:22, height:22, borderRadius:5, background:GOLD_GRADIENT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#060710" }}>D</div>
          <span style={{ fontSize:11, color:T.sub }}>Drop<span style={{ color:T.gold }}>Elite</span> © 2026</span>
        </div>
        <div style={{ display:"flex", gap:18 }}>
          {["Privacy", "Terms", "Contact"].map((l, i) => <span key={i} style={{ fontSize:11, color:T.dim, cursor:"pointer", fontFamily:T.fm }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}

export default function DropEliteApp() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("products");
  const [selected, setSelected] = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Credit & Plan system
  const [plan, setPlan] = useState("free"); // free, pro, business, admin
  const [credits, setCredits] = useState(PLANS.free.maxCredits);
  const [showAdminModal, setShowAdminModal] = useState(false);
  // Admin: custom AliExpress links per product name { "LED Galaxy Projector": { url, aliPrice, sellPrice } }
  const [aliLinks, setAliLinks] = useState({});
  const [totalViewed, setTotalViewed] = useState(0);
  const logoClickRef = useRef(0);
  const logoTimerRef = useRef(null);

  const handleLogoClick = () => {
    logoClickRef.current += 1;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    if (logoClickRef.current >= 7) {
      logoClickRef.current = 0;
      setShowAdminModal(true);
    } else {
      logoTimerRef.current = setTimeout(() => {
        if (logoClickRef.current < 7) handleNav("dashboard");
        logoClickRef.current = 0;
      }, 400);
    }
  };

  const isAdmin = plan === "admin";
  const currentPlan = PLANS[plan];
  const hasCredits = currentPlan.maxCredits === Infinity || credits > 0;

  const consumeCredit = () => {
    if (currentPlan.maxCredits === Infinity) return true;
    if (credits <= 0) return false;
    setCredits((c) => c - 1);
    setTotalViewed((v) => v + 1);
    return true;
  };

  const handleProductClick = (product) => {
    if (consumeCredit()) {
      setSelected(product);
    } else {
      setShowPaywall(true);
    }
  };

  const handleUpgrade = (newPlan) => {
    setPlan(newPlan);
    setCredits(PLANS[newPlan].maxCredits === Infinity ? Infinity : PLANS[newPlan].maxCredits);
  };

  const t = TRANSLATIONS[lang];
  const s = t;
  const langCtx = useMemo(() => ({ t: s, lang }), [lang]);
  const products = useMemo(() => generateProducts(600), []);

  const sideWidth = sideCollapsed ? 60 : 220;
  const winners = useMemo(() => products.filter((p) => calcScore(p) >= 85), [products]);
  const todayProducts = useMemo(() => products.filter((p) => p.dateAdded === "2026-03-05"), [products]);

  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} lang={lang} setLang={setLang} />;

  const navItems = [
    { id: "dashboard", icon: "◆", label: s.dashboard },
    { id: "products", icon: "★", label: s.productSpy },
    { id: "winners", icon: "🏆", label: s.winners },
    { divider: true, label: "PLATFORMS" },
    ...PLATFORMS.map((p) => ({ id: `pl-${p}`, icon: PLATFORM_ICONS[p], label: p, color: PLATFORM_COLORS[p], platform: p })),
    { divider: true, label: "TOOLS" },
    { id: "ailab", icon: "◈", label: s.aiLab },
    { id: "pricing", icon: "◇", label: s.pricing },
    { divider: true, label: "ACCOUNT" },
    { id: "account", icon: "👤", label: "Mon Compte" },
    { id: "settings", icon: "⚙", label: "Paramètres" },
    ...(plan === "admin" ? [{ id: "adminpanel", icon: "🔐", label: "Admin Panel", color: T.gold }] : []),
  ];

  // Show landing page first
  const handleNav = (id) => {
    setSelected(null);
    if (id.startsWith("pl-")) {
      setPlatformFilter(id.replace("pl-", ""));
      setView("platform");
    } else {
      setPlatformFilter(null);
      setView(id);
    }
  };

  return (
    <LangCtx.Provider value={langCtx}>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.txt, fontFamily: T.ff, display: "flex" }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

        {/* ── SIDEBAR ── */}
        <aside style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: sideWidth,
          background: T.sidebar, borderRight: `1px solid ${T.border}`,
          zIndex: 100, display: "flex", flexDirection: "column",
          transition: "width 0.25s ease", overflow: "hidden",
        }}>
          {/* Logo */}
          <div
            style={{
              padding: sideCollapsed ? "14px" : "14px 18px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            }}
            onClick={handleLogoClick}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: GOLD_GRADIENT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "#060710", fontFamily: T.fd, flexShrink: 0,
            }}>
              D
            </div>
            {!sideCollapsed && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Drop<GoldText>Elite</GoldText></div>
                <div style={{ fontSize: 8, color: T.dim, fontFamily: T.fm, letterSpacing: 1.5 }}>WINNER RESEARCH</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {navItems.map((item, i) => {
              if (item.divider) {
                return !sideCollapsed ? (
                  <div key={i} style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, letterSpacing: 1.5, padding: "14px 10px 6px", fontWeight: 700 }}>
                    {item.label}
                  </div>
                ) : (
                  <div key={i} style={{ height: 1, background: T.border, margin: "8px 4px" }} />
                );
              }

              const isActive = item.id === view || (item.platform && view === "platform" && platformFilter === item.platform);
              const isFreeUser = plan === "free";
              const allowedFreePlatforms = ["TikTok"];
              const isLockedNav = isFreeUser && (
                item.id === "ailab" ||
                item.id === "winners" ||
                (item.platform && !allowedFreePlatforms.includes(item.platform))
              );

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isLockedNav) { setShowPaywall(true); return; }
                    handleNav(item.id);
                  }}
                  style={{
                    width: "100%", padding: sideCollapsed ? "9px 0" : "8px 12px",
                    borderRadius: 8, border: "none", cursor: "pointer",
                    background: isActive ? (item.color ? `${item.color}15` : "rgba(207,171,59,0.1)") : "transparent",
                    color: isLockedNav ? T.dim : isActive ? (item.color || T.gold) : T.sub,
                    display: "flex", alignItems: "center", gap: 10,
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    fontFamily: T.ff, marginBottom: 2, transition: "all 0.15s",
                    justifyContent: sideCollapsed ? "center" : "flex-start",
                    opacity: isLockedNav ? 0.5 : 1,
                    position: "relative",
                  }}
                >
                  <span style={{
                    fontSize: 13, width: 20, textAlign: "center",
                    color: item.color || "inherit", flexShrink: 0,
                    opacity: isActive ? 1 : 0.5,
                  }}>
                    {item.icon}
                  </span>
                  {!sideCollapsed && <span>{item.label}</span>}
                  {isLockedNav && !sideCollapsed && (
                    <span style={{ marginLeft: "auto", fontSize: 9, color: T.gold, fontFamily: T.fm }}>🔒</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom controls */}
          <div style={{ padding: "10px 8px", borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
            <CreditBar credits={credits} maxCredits={currentPlan.maxCredits} plan={plan} onUpgrade={() => setShowPaywall(true)} collapsed={sideCollapsed} />
            {!sideCollapsed && <LangSelector lang={lang} setLang={setLang} />}
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setSideCollapsed(!sideCollapsed)}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
                  borderRadius: 7, padding: "6px", cursor: "pointer", color: T.sub,
                  fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {sideCollapsed ? "→" : "←"}
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ marginLeft: sideWidth, flex: 1, transition: "margin-left 0.25s ease", minHeight: "100vh" }}>
          {/* Top bar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 50,
            background: "rgba(8,9,14,0.85)", backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${T.border}`, padding: "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.txt }}>
              {view === "dashboard" && s.dashboard}
              {view === "products" && s.productSpy}
              {view === "winners" && s.winners}
              {view === "platform" && `${platformFilter}`}
              {view === "ailab" && s.aiLab}
              {view === "pricing" && s.pricing}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <div style={{
                  background: "rgba(207,171,59,0.1)", border: `1px solid ${T.gold}30`,
                  borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{ fontSize: 12 }}>👑</span>
                  <span style={{ fontSize: 9, color: T.gold, fontWeight: 700, fontFamily: T.fm }}>ADMIN</span>
                </div>
              )}
              <div style={{
                background: "rgba(45,212,160,0.08)", border: "1px solid rgba(45,212,160,0.2)",
                borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
                <span style={{ fontSize: 9, color: T.green, fontWeight: 700, fontFamily: T.fm }}>LIVE</span>
              </div>
              <div style={{
                background: currentPlan.maxCredits === Infinity ? "rgba(207,171,59,0.06)" : credits <= 3 ? "rgba(239,100,97,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${currentPlan.maxCredits === Infinity ? T.gold + "20" : credits <= 3 ? "rgba(239,100,97,0.2)" : T.border}`,
                borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5, cursor: plan === "free" ? "pointer" : "default",
              }}
                onClick={() => { if (plan === "free") setShowPaywall(true); }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, fontFamily: T.fm, color: currentPlan.maxCredits === Infinity ? T.gold : credits <= 3 ? T.red : T.sub }}>
                  {currentPlan.maxCredits === Infinity ? "∞ Credits" : `${credits} credits`}
                </span>
              </div>
              <div style={{ background: "rgba(207,171,59,0.06)", borderRadius: 6, padding: "4px 10px" }}>
                <span style={{ fontSize: 9, color: T.gold, fontFamily: T.fm }}>{products.length.toLocaleString()} products</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div style={{ padding: "20px 24px" }}>

            {/* DASHBOARD */}
            {view === "dashboard" && (
              <div>
                {/* Upgrade banner for free users */}
                {plan === "free" && (
                  <div style={{
                    background: `linear-gradient(135deg, rgba(207,171,59,0.08), rgba(207,171,59,0.02))`,
                    border: `1px solid ${T.gold}25`, borderRadius: 16, padding: "20px 24px",
                    marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 16,
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.txt, marginBottom: 4 }}>
                        🚀 Unlock the full power of DropElite
                      </div>
                      <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.5 }}>
                        You're on the free plan — only 3 credits/day, 5 visible products, 1 platform. Upgrade to Pro for unlimited access.
                      </div>
                    </div>
                    <button onClick={() => setShowPaywall(true)} style={{
                      padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: GOLD_GRADIENT, color: "#060710", fontSize: 13, fontWeight: 800,
                      fontFamily: T.ff, whiteSpace: "nowrap",
                    }}>
                      Upgrade to Pro — $49/mo
                    </button>
                  </div>
                )}

                {/* FEATURED WINNERS with big images */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 14 }}>◆ FEATURED WINNERS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, position: "relative" }}>
                    {winners.sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 6).map((p, i) => {
                      const sc = calcScore(p);
                      const c = scoreColor(sc);
                      const pr = (p.sellPrice - p.aliPrice).toFixed(2);
                      const isCardLocked = plan === "free" && i >= 2;
                      return (
                        <div key={p.id} onClick={() => { if (isCardLocked) { setShowPaywall(true); return; } handleProductClick(p); }} style={{
                          background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
                          overflow: "hidden", cursor: "pointer", transition: "all 0.3s",
                          opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.06}s forwards`,
                          position: "relative",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}30`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 30px rgba(207,171,59,0.06)`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          {isCardLocked && (
                            <div style={{
                              position: "absolute", inset: 0, background: "rgba(8,9,14,0.82)",
                              zIndex: 5, display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center", borderRadius: 14, gap: 6,
                            }}>
                              <div style={{ fontSize: 24 }}>🔒</div>
                              <div style={{ fontSize: 11, color: T.gold, fontWeight: 700, fontFamily: T.fm }}>PRO</div>
                              <div style={{
                                padding: "6px 16px", borderRadius: 8,
                                background: GOLD_GRADIENT, color: "#060710",
                                fontSize: 10, fontWeight: 800, fontFamily: T.ff,
                              }}>
                                Unlock Now →
                              </div>
                            </div>
                          )}
                          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
                          {/* Big thumbnail */}
                          <div style={{ position: "relative" }}>
                            <ProductImage product={p} height={160} />
                            <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 3 }}>
                              {sc >= 85 && <Badge color={T.gold}>ELITE</Badge>}
                              {p.viral && <Badge color={T.red}>VIRAL</Badge>}
                            </div>
                            <div style={{ position: "absolute", top: 8, right: 8 }}>
                              <ScoreRing score={sc} size={36} />
                            </div>
                            <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{p.name}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: T.fm }}>{p.niche}</div>
                            </div>
                          </div>
                          {/* Info */}
                          <div style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ fontSize: 11, color: T.sub, fontFamily: T.fm }}>{p.aliPrice.toFixed(2)}€ → </span>
                                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: T.fm }}><GoldText>{p.sellPrice.toFixed(2)}€</GoldText></span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: T.green, fontFamily: T.fm }}>+{pr}€</div>
                                <div style={{ fontSize: 8, color: T.dim }}>profit</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                              {p.platforms.slice(0, 4).map((pl, j) => (
                                <span key={j} style={{
                                  width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 9, fontWeight: 800, fontFamily: T.fm,
                                  background: `${PLATFORM_COLORS[pl]}18`, color: PLATFORM_COLORS[pl],
                                }}>{PLATFORM_ICONS[pl]}</span>
                              ))}
                              <span style={{ fontSize: 9, color: T.dim, fontFamily: T.fm, display: "flex", alignItems: "center", marginLeft: 4 }}>
                                {p.orders30d.toLocaleString()} orders
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* NEW TODAY with images */}
                {todayProducts.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: T.cyan, fontFamily: T.fm, letterSpacing: 2 }}>● {s.newToday}</div>
                      <div style={{ padding: "2px 10px", borderRadius: 6, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}>
                        <span style={{ fontSize: 10, color: T.cyan, fontWeight: 700, fontFamily: T.fm }}>{todayProducts.length}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                      {todayProducts.slice(0, plan === "free" ? 3 : 10).map((p, i) => {
                        const sc = calcScore(p);
                        return (
                          <div key={p.id} onClick={() => handleProductClick(p)} style={{
                            minWidth: 160, background: T.card, border: `1px solid ${T.border}`,
                            borderRadius: 12, overflow: "hidden", cursor: "pointer", flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.cyan}30`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
                          >
                            <div style={{ position: "relative" }}>
                              <ProductImage product={p} height={100} />
                              <div style={{ position: "absolute", top: 6, right: 6 }}>
                                <ScoreRing score={sc} size={28} />
                              </div>
                            </div>
                            <div style={{ padding: "8px 10px" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: T.txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                              <div style={{ fontSize: 10, fontWeight: 800, fontFamily: T.fm, marginTop: 3 }}>
                                <GoldText>{(p.sellPrice - p.aliPrice).toFixed(2)}€ profit</GoldText>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {plan === "free" && (
                        <div onClick={() => setShowPaywall(true)} style={{
                          minWidth: 160, background: T.card, border: `1px solid ${T.gold}20`,
                          borderRadius: 12, cursor: "pointer", flexShrink: 0,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          padding: 16, gap: 6,
                        }}>
                          <div style={{ fontSize: 22 }}>🔒</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, fontFamily: T.fm, textAlign: "center" }}>+{todayProducts.length - 3} more</div>
                          <div style={{ fontSize: 9, color: T.sub, textAlign: "center" }}>Upgrade to see all</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 28 }}>
                  <StatCard label={s.analyzed} value={products.length.toLocaleString()} icon="◆" />
                  <StatCard label={s.eliteWinners} value={winners.length.toString()} color={T.gold} icon="★" />
                  <StatCard label={s.newToday} value={todayProducts.length.toString()} color={T.cyan} icon="●" />
                  <StatCard label={s.avgMargin} value={`${(products.reduce((acc, p) => acc + ((p.sellPrice - p.aliPrice) / p.sellPrice * 100), 0) / products.length).toFixed(0)}%`} color={T.green} icon="▲" />
                  <StatCard label={s.totalOrders} value={products.reduce((acc, p) => acc + p.orders30d, 0).toLocaleString()} icon="◎" />
                </div>

                <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 12 }}>{s.platformBreak}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10, marginBottom: 28 }}>
                  {PLATFORMS.map((pl) => {
                    const plProducts = products.filter((p) => p.platforms.includes(pl));
                    const count = plProducts.length;
                    const winCount = plProducts.filter((p) => calcScore(p) >= 85).length;
                    const topImgs = plProducts.sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 3);
                    return (
                      <div
                        key={pl}
                        onClick={() => handleNav(`pl-${pl}`)}
                        style={{
                          background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
                          padding: "14px 16px", cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${PLATFORM_COLORS[pl]}35`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: `${PLATFORM_COLORS[pl]}18`, color: PLATFORM_COLORS[pl],
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, fontFamily: T.fm,
                          }}>
                            {PLATFORM_ICONS[pl]}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{pl}</span>
                        </div>
                        {/* Product thumbnails */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                          {topImgs.map((tp, ti) => (
                            <div key={ti} style={{
                              width: 36, height: 36, borderRadius: 8, overflow: "hidden",
                              border: `1px solid ${T.border}`, flexShrink: 0,
                            }}>
                              <ProductImage product={tp} height={36} />
                            </div>
                          ))}
                          {count > 3 && (
                            <div style={{
                              width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.03)",
                              border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9, color: T.dim, fontFamily: T.fm,
                            }}>
                              +{count - 3}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: T.fm }}>{count}</div>
                            <div style={{ fontSize: 8, color: T.dim }}>products</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: T.gold, fontFamily: T.fm }}>{winCount}</div>
                            <div style={{ fontSize: 8, color: T.dim }}>winners</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: 10, color: T.gold, fontFamily: T.fm, letterSpacing: 2, marginBottom: 12 }}>◆ {s.topWinners}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                  {winners.sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 8).map((p, i) => (
                    <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} delay={i * 40} onPaywall={() => setShowPaywall(true)} isUnlocked={plan !== "free"} />
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {view === "products" && (
              <ProductsListView products={products} onSelect={handleProductClick} platformFilter={null} onPaywall={() => setShowPaywall(true)} isUnlocked={plan !== "free"} />
            )}

            {/* PLATFORM */}
            {view === "platform" && (
              <ProductsListView products={products} onSelect={handleProductClick} platformFilter={platformFilter} onPaywall={() => setShowPaywall(true)} isUnlocked={plan !== "free"} />
            )}

            {/* WINNERS */}
            {view === "winners" && (
              <ProductsListView products={winners} onSelect={handleProductClick} platformFilter={null} onPaywall={() => setShowPaywall(true)} isUnlocked={plan !== "free"} />
            )}

            {/* AI LAB */}
            {view === "ailab" && <AILab />}

            {/* PRICING */}
            {view === "pricing" && <PricingView />}

            {/* ACCOUNT */}
            {view === "account" && <AccountView plan={plan} credits={credits} onUpgrade={handleUpgrade} onLogout={() => setShowLanding(true)} />}

            {/* SETTINGS */}
            {view === "settings" && <SettingsView lang={lang} setLang={setLang} />}

            {/* ADMIN PANEL */}
            {view === "adminpanel" && plan === "admin" && (
              <AdminLinksPanel products={products} aliLinks={aliLinks} setAliLinks={setAliLinks} />
            )}
          </div>
        </main>

        {/* Detail Panel */}
        <DetailPanel product={selected} onClose={() => setSelected(null)} plan={plan} onPaywall={() => setShowPaywall(true)} aliLinks={aliLinks} />

        {/* Paywall Modal */}
        {showPaywall && (
          <PaywallModal
            onClose={() => setShowPaywall(false)}
            onNavigatePricing={() => { setShowPaywall(false); handleNav("pricing"); }}
            onUpgrade={(newPlan) => { handleUpgrade(newPlan); setShowPaywall(false); }}
            currentPlan={plan}
            credits={credits}
          />
        )}

        {/* Admin Modal */}
        {showAdminModal && (
          <AdminModal
            onClose={() => setShowAdminModal(false)}
            onSuccess={() => handleUpgrade("admin")}
          />
        )}

        {/* Support Chatbot */}
        <SupportChatbot plan={plan} />
      </div>
    </LangCtx.Provider>
  );
}

/* ═══════════════════ SUPPORT CHATBOT ═══════════════════ */
function SupportChatbot({ plan }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour, bienvenue sur DropElite. Je suis votre assistant support. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (!open && messages.length > 1) {
      setUnread(u => u + 1);
    }
  }, [messages]);

  const QUICK_REPLIES = [
    "Comment fonctionne l'abonnement ?",
    "Je souhaite un remboursement",
    "Quelle est la différence entre Pro et Business ?",
    "Comment contacter le support ?",
  ];

  const getBotReply = (userMsg) => {
    const msg = userMsg.toLowerCase();

    // Abonnement / plans / prix
    if (msg.match(/abonnement|plan|tarif|prix|combien|coût|starter|pro|business/)) {
      return "Nous proposons 3 plans : **Starter** (gratuit, 3 analyses/jour), **Pro** à 49€/mois (100 analyses/jour, toutes les plateformes, export CSV, IA Auto-Pilot), et **Business** à 149€/mois (analyses illimitées, 5 sièges, rapports white-label). L'accès est immédiat après paiement. 🚀";
    }
    // Remboursement
    if (msg.match(/rembours|remboursement|argent|annul|cancel/)) {
      return "Vous pouvez demander un remboursement intégral sous 14 jours après votre achat, sans aucune justification. Il vous suffit d'écrire à support@dropelite.io et notre équipe traitera votre demande sous 24h ouvrées. L'annulation de votre abonnement est également possible à tout moment depuis vos paramètres.";
    }
    // Différence Pro vs Business
    if (msg.match(/diff[eé]rence|pro.{0,10}business|business.{0,10}pro|lequel choisir|quel plan/)) {
      return "Le plan **Pro** est idéal si vous gérez votre boutique seul — il vous donne 100 analyses/jour, l'Auto-Pilot IA et l'export CSV. Le plan **Business** est fait pour les agences et équipes : analyses illimitées, 5 sièges utilisateurs et rapports en marque blanche. Si vous débutez, le Pro est largement suffisant. 💪";
    }
    // Support / contact
    if (msg.match(/support|contact|aide|help|joindre|[eé]quipe|r[eé]pondre/)) {
      return "Notre équipe support est disponible par email à **support@dropelite.io**, avec une réponse garantie sous 24h ouvrées. Pour les abonnés Pro et Business, nous donnons la priorité à vos demandes. N'hésitez pas à nous contacter !";
    }
    // Crédits / analyses
    if (msg.match(/cr[eé]dit|analyse|utiliser|fonctionn|comment/)) {
      return "1 crédit équivaut à 1 analyse complète d'un produit (score, marges, ROAS, plateformes, concurrence...). Les crédits sont renouvelés chaque jour et ne se cumulent pas d'un jour à l'autre. Avec le plan Pro, vous avez 100 crédits/jour, largement suffisant pour une utilisation intensive. 📊";
    }
    // Plateformes
    if (msg.match(/plateforme|tiktok|instagram|facebook|youtube|snapchat|pinterest/)) {
      return "DropElite analyse les produits sur 7 plateformes : TikTok, Instagram, Facebook, Pinterest, Snapchat, YouTube et X (Twitter). Les données sont mises à jour quotidiennement pour vous garantir des tendances en temps réel. 🌍";
    }
    // Données / mise à jour
    if (msg.match(/donn[eé]es|mise [aà] jour|update|fr[aâ]ich|r[eé]cent/)) {
      return "Notre base de produits est mise à jour **chaque jour**. Notre IA analyse en continu des millions de publicités et de ventes sur toutes les plateformes pour détecter les nouveaux winners avant qu'ils ne saturent le marché. 🔄";
    }
    // Bonjour / salut
    if (msg.match(/bonjour|salut|hello|hi|hey|bonsoir/)) {
      return "Bonjour ! 👋 Je suis l'assistant DropElite. Je peux vous renseigner sur nos plans, le fonctionnement de la plateforme, les remboursements ou tout autre sujet. Comment puis-je vous aider ?";
    }
    // Merci
    if (msg.match(/merci|thank|super|parfait|nickel|cool|top/)) {
      return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Bonne chasse aux winners ! 🏆";
    }
    // Réponse par défaut
    return "Je n'ai pas bien compris votre demande. Pour toute question spécifique, notre équipe est disponible à **support@dropelite.io** et vous répondra sous 24h ouvrées. Ou reformulez votre question, je ferai de mon mieux ! 🙏";
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Simulate a short thinking delay for realism
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

    const reply = getBotReply(userMsg);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: "min(380px, calc(100vw - 48px))",
          height: "min(520px, calc(100vh - 120px))",
          background: T.bg, border: `1px solid ${T.border}`, borderRadius: 20,
          zIndex: 1200, display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          animation: "chatIn 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <style>{`
            @keyframes chatIn { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
            .chat-msg { animation: fadeUp 0.25s ease both; }
            @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
            .chat-input:focus { outline: none; border-color: rgba(207,171,59,0.4) !important; }
            ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "16px 18px", borderBottom: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", gap: 12, borderRadius: "20px 20px 0 0",
            background: `linear-gradient(135deg, rgba(207,171,59,0.06), transparent)`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: GOLD_GRADIENT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>Support DropElite</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
                <span style={{ fontSize: 10, color: T.sub, fontFamily: T.fm }}>Assistant IA · En ligne</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.border}`,
              background: "rgba(255,255,255,0.04)", color: T.sub, cursor: "pointer", fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg" style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                gap: 8, alignItems: "flex-end",
              }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, background: GOLD_GRADIENT,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, flexShrink: 0,
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "10px 13px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? GOLD_GRADIENT : T.card,
                  border: msg.role === "user" ? "none" : `1px solid ${T.border}`,
                  color: msg.role === "user" ? "#060710" : T.txt,
                  fontSize: 12, lineHeight: 1.55, fontWeight: msg.role === "user" ? 600 : 400,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>
                <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: T.card, border: `1px solid ${T.border}`, display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 6, height: 6, borderRadius: "50%", background: T.gold,
                      animation: `bounce 1.2s ease infinite ${j * 0.2}s`,
                    }} />
                  ))}
                  <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }`}</style>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies — only show at start */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {QUICK_REPLIES.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} style={{
                  padding: "6px 11px", borderRadius: 8, border: `1px solid ${T.border}`,
                  background: "rgba(207,171,59,0.06)", color: T.gold,
                  fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: T.ff,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => e.target.style.background = "rgba(207,171,59,0.12)"}
                onMouseLeave={e => e.target.style.background = "rgba(207,171,59,0.06)"}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 14px", borderTop: `1px solid ${T.border}`,
            display: "flex", gap: 8, borderRadius: "0 0 20px 20px",
          }}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Écrivez votre message..."
              style={{
                flex: 1, padding: "10px 13px", borderRadius: 10,
                border: `1px solid ${T.border}`, background: T.surface,
                color: T.txt, fontSize: 12, fontFamily: T.ff,
                transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 10, border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                background: input.trim() && !loading ? GOLD_GRADIENT : "rgba(255,255,255,0.04)",
                color: input.trim() && !loading ? "#060710" : T.dim,
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: 16, border: "none", cursor: "pointer", zIndex: 1200,
          background: open ? T.elevated : GOLD_GRADIENT,
          boxShadow: open ? "none" : "0 8px 32px rgba(207,171,59,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          transform: open ? "rotate(0deg) scale(0.95)" : "rotate(0deg) scale(1)",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = open ? "scale(0.95)" : "scale(1)"; }}
      >
        {open ? <span style={{ color: T.sub, fontSize: 18 }}>✕</span> : "💬"}
        {!open && unread > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4, width: 18, height: 18,
            borderRadius: "50%", background: T.red, border: `2px solid ${T.bg}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "#fff", fontFamily: T.fm,
          }}>{unread}</div>
        )}
      </button>
    </>
  );
}

