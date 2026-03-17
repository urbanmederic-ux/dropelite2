import crypto from "crypto";

function sign(params, secret) {
  const sorted = Object.keys(params).sort().map(k => `${k}${params[k]}`).join("");
  return crypto.createHmac("sha256", secret).update(sorted).digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const appKey = "529710";
  const appSecret = "otLVGK2zpp14EVUi9SU92iWaPBNwZaxT";
  const ts = Date.now().toString();

  const params = {
    app_key: appKey,
    timestamp: ts,
    method: "aliexpress.affiliate.product.query",
    sign_method: "hmac-sha256",
    format: "json",
    v: "2.0",
    keywords: q,
    fields: "product_main_image_url,product_title",
    page_size: "5",
    target_currency: "EUR",
    target_language: "FR",
  };

  params.sign = sign(params, appSecret);
  const url = "https://api-sg.aliexpress.com/sync?" + new URLSearchParams(params).toString();

  try {
    const r = await fetch(url);
    const data = await r.json();
    const products = data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product || [];
    const imageUrl = products[0]?.product_main_image_url || null;
    res.json({ imageUrl, products: products.map(p => ({ title: p.product_title, image: p.product_main_image_url })) });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
