/**
 * DROPELITE — Proxy AliExpress
 * Déployé sur Railway → tout le monde voit les vraies images AliExpress
 */

const express = require("express");
const cors    = require("cors");
const crypto  = require("crypto");
const https   = require("https");

// Fix certificat SSL AliExpress
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ALI_APP_KEY    = process.env.ALI_APP_KEY    || "529710";
const ALI_APP_SECRET = process.env.ALI_APP_SECRET || "otLVGK2zpp14EVUi9SU92iWaPBNwZaxT";

const SEARCHES = [
  { keyword: "led projector lamp bedroom",       niche: "Home & Décor",     emoji: "🏠" },
  { keyword: "wireless bluetooth earbuds sport", niche: "Tech & Gadgets",   emoji: "⚡" },
  { keyword: "face massager skin care device",   niche: "Beauty & Care",    emoji: "✨" },
  { keyword: "massage gun muscle recovery",      niche: "Sport & Wellness", emoji: "💪" },
  { keyword: "anti theft backpack usb charging", niche: "Fashion",          emoji: "👗" },
  { keyword: "cat water fountain automatic pet", niche: "Pets",             emoji: "🐾" },
  { keyword: "car phone holder magnetic mount",  niche: "Auto & Moto",      emoji: "🚗" },
  { keyword: "solar garden light outdoor stake", niche: "Garden",           emoji: "🌿" },
  { keyword: "baby monitor wifi hd camera",      niche: "Kids & Baby",      emoji: "👶" },
  { keyword: "air fryer mini compact kitchen",   niche: "Kitchen",          emoji: "🍳" },
  { keyword: "knee brace compression support",   niche: "Health",           emoji: "🏥" },
  { keyword: "laptop stand aluminum adjustable", niche: "Office",           emoji: "💼" },
];

function sign(params, secret) {
  const str = secret + Object.keys(params).sort().map(k => `${k}${params[k]}`).join("") + secret;
  return crypto.createHmac("sha256", secret).update(str).digest("hex").toUpperCase();
}

function fetchAliExpress(keyword, pageSize = 30) {
  return new Promise((resolve) => {
    try {
      const now = new Date();
      const p   = n => String(n).padStart(2, "0");
      const ts  = `${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
      const params = {
        app_key: ALI_APP_KEY, timestamp: ts,
        sign_method: "hmac-sha256", format: "json", v: "2.0",
        method: "aliexpress.affiliate.product.query",
        fields: "product_id,product_title,product_main_image_url,product_small_image_urls,sale_price,original_price,evaluate_rate,volume,commission_rate,product_detail_url,shop_url",
        keywords: keyword, page_no: "1", page_size: String(pageSize),
        sort: "SALES_DESC", target_currency: "EUR", target_language: "FR",
        tracking_id: "dropelite2026",
      };
      params.sign = sign(params, ALI_APP_SECRET);
      const query = Object.entries(params).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
      const req = https.request(
        { hostname: "gw.api.aliexpress.com", path: `/sync?${query}`, method: "GET" },
        (res) => {
          let data = "";
          res.on("data", c => data += c);
          res.on("end", () => {
            try {
              const json   = JSON.parse(data);
              const result = json?.aliexpress_affiliate_product_query_response?.resp_result;
              if (result?.resp_code === 200) {
                resolve(result?.result?.products?.product || []);
              } else {
                console.warn(`⚠️ "${keyword}":`, result?.resp_msg, "code:", result?.resp_code);
                resolve([]);
              }
            } catch(e) { resolve([]); }
          });
        }
      );
      req.on("error", () => resolve([]));
      req.end();
    } catch(e) { resolve([]); }
  });
}

function calcScore(volume, evalRate, aliPrice, sellPrice) {
  const margin = sellPrice > 0 ? ((sellPrice - aliPrice) / sellPrice) * 100 : 0;
  return Math.round(
    Math.min(40, (volume / 500) * 10) +
    Math.min(30, ((evalRate - 85) / 15) * 30) +
    Math.min(30, (margin / 70) * 30)
  );
}

let cache = { date: null, products: [] };

async function loadProducts() {
  const today = new Date().toISOString().slice(0, 10);
  if (cache.date === today && cache.products.length > 0) return cache.products;
  console.log("🔄 Chargement AliExpress...");
  const allRaw = [];
  const results = await Promise.allSettled(SEARCHES.map(s => fetchAliExpress(s.keyword, 30)));
  for (const r of results) if (r.status === "fulfilled") allRaw.push(...r.value);
  const seen   = new Set();
  const unique = allRaw.filter(p => {
    if (!p.product_id || seen.has(p.product_id)) return false;
    seen.add(p.product_id); return true;
  });
  // Debug — affiche les premiers produits bruts
  if (unique.length > 0) {
    const sample = unique[0];
    console.log("📦 Exemple produit brut:", {
      title: (sample.product_title||"").slice(0,40),
      img: sample.product_main_image_url||"NO IMAGE",
      volume: sample.volume,
      evalRate: sample.evaluate_rate,
      price: sample.sale_price,
    });
  }

  const formatted = unique.map((ali, i) => {
    const aliPrice  = parseFloat(ali.sale_price || ali.original_price || "10") || 10;
    const sellPrice = Math.round(aliPrice * 3.2 * 100) / 100;
    const volume    = parseInt(ali.volume || "0", 10);
    const evalRate  = parseFloat((ali.evaluate_rate || "0").toString().replace("%","")) || 0;
    const score     = calcScore(volume, evalRate, aliPrice, sellPrice);
    // Filtres assouplis pour maximiser les résultats
    if (evalRate < 50 || volume < 10 || score < 10) return null;
    const match   = SEARCHES.find(s => (ali.product_title||"").toLowerCase().includes(s.keyword.split(" ")[0])) || SEARCHES[i % SEARCHES.length];
    const mainImg = ali.product_main_image_url || "";
    const smalls  = ali.product_small_image_urls?.string || [];
    return {
      id: i+1, aliProductId: ali.product_id,
      aliUrl:   ali.product_detail_url || `https://www.aliexpress.com/item/${ali.product_id}.html`,
      name:     (ali.product_title || `Produit #${i+1}`).slice(0, 60),
      niche: match.niche, emoji: match.emoji,
      img:     mainImg,
      imgAlt:  smalls[0] || mainImg,
      imgLife: smalls[1] || mainImg,
      aliPrice, sellPrice, orders30d: volume, winnerScore: score,
      trend:       Math.min(99, Math.round(60 + (volume/3000)*20)),
      engagement:  Math.min(99, Math.round(evalRate * 0.65)),
      competition: Math.round(6 + Math.random()*28),
      saturation:  Math.round(4 + Math.random()*24),
      viral: volume > 5000,
      reviews: Math.min(5.0, Math.round(evalRate/20*10)/10),
      platforms: ["Facebook","TikTok","Instagram"].slice(0, 1+Math.floor(Math.random()*3)),
      tags: volume > 10000 ? ["Mega Winner","Viral 🔥"] : score >= 85 ? ["Elite Score"] : ["Trending"],
      dateAdded: today, premium: score >= 85 || volume > 3000,
      _source: "aliexpress_real",
    };
  }).filter(Boolean);
  console.log(`✅ ${formatted.length} winners chargés`);
  cache = { date: today, products: formatted };
  return formatted;
}

app.get("/",           (req, res) => res.json({ status: "DropElite Proxy OK", products: cache.products.length }));
app.get("/health",     (req, res) => res.json({ ok: true, cached: cache.products.length, date: cache.date }));
app.get("/getProducts", async (req, res) => {
  try { const p = await loadProducts(); res.json({ success: true, products: p, count: p.length }); }
  catch(e) { res.status(500).json({ success: false, error: e.message }); }
});
app.get("/getWinners", async (req, res) => {
  try {
    const p = await loadProducts();
    const w = [...p].sort((a,b)=>(b.winnerScore||0)-(a.winnerScore||0)).slice(0,10);
    res.json({ success: true, winners: w });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`🚀 DropElite Proxy sur port ${PORT}`);
  loadProducts();
});
