// api/proxy.js
export default async function handler(req, res) {
  const API_TOKEN = process.env.API_TOKEN; // التوكن مخفي
  const SCRIPT_URL = "https//script.google.com/macros/s/AKfycbz6OKgn9xmj4zQbfTKAuGleNrWyUyqRDewWL0GfcXx4xSRr0xO3xiYAX8nNCMaZ15SE/exec"; // رابط Web App الخاص بك

  // تحقق من التوكن المرسل من المتصفح
  if (req.headers['x-api-token'] !== API_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // إعادة توجيه الطلب إلى Google Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',   // أو GET حسب الحاجة
      body: req.method === 'POST' ? JSON.stringify(req.body) : null,
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
