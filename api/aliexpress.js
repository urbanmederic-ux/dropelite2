export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch(
      `https://aliexpress-datahub.p.rapidapi.com/item_search_2?q=${encodeURIComponent(q)}&page=1`,
      {
        headers: {
          "x-rapidapi-key": "e3df7c0236msh15c962a82e92d47p10000djsnabf1b915a91e",
          "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();
    const item = data?.result?.resultList?.[0]?.item;
    const imageUrl = item?.image || null;
    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ imageUrl: null });
  }
}
