const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.chat = functions.https.onRequest(async (req, res) => {
  // Allow CORS from your app
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { messages } = req.body;
    const apiKey = functions.config().anthropic.key;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: `Tu es l'assistant support de DropElite, une plateforme de recherche de produits gagnants pour le dropshipping. Tu aides les utilisateurs avec toutes leurs questions sur le dropshipping, la recherche de produits, les stratégies marketing, TikTok, Instagram, Facebook Ads, AliExpress, fournisseurs, etc. Tu es expert en dropshipping. Tu réponds toujours en français, de façon concise et utile. Les plans disponibles sont : Starter (gratuit, 3 analyses/jour), Pro (49€/mois, 100 analyses/jour, toutes plateformes, IA Auto-Pilot), Business (149€/mois, illimité, 5 sièges). Support : support@dropelite.io`,
        messages,
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.content?.[0]?.text || "Désolé, une erreur est survenue." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erreur serveur. Contactez support@dropelite.io." });
  }
});
exports.aliproxy = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }

  const crypto = require("crypto");
  const APP_KEY    = "529710";
  const APP_SECRET = "otLVGK2zpp14EVUi9SU92iWaPBNwZaxT";

  const now = new Date();
  const p = n => String(n).padStart(2,"0");
  const ts = now.getFullYear()+"-"+p(now.getMonth()+1)+"-"+p(now.getDate())+" "+p(now.getHours())+":"+p(now.getMinutes())+":"+p(now.getSeconds());

  const params = { ...req.query, app_key: APP_KEY, timestamp: ts, sign_method: "hmac-sha256", v: "2.0" };
  const str = Object.keys(params).sort().map(k => k+params[k]).join("") ;
  params.sign = crypto.createHmac("sha256", APP_SECRET).update(str).digest("hex").toUpperCase();

  const q = Object.entries(params).map(([k,v]) => encodeURIComponent(k)+"="+encodeURIComponent(v)).join("&");
  const url = "https://gw-api.aliexpress.com/sync?" + q;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
