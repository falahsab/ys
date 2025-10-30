// api/proxy.js
export default async function handler(req, res) {
  const API_TOKEN = process.env.API_TOKEN; // التوكن مخفي تمامًا
  const SCRIPT_ID = "AKfycbAq40UiBAHlUmiEdaXHP3jSumBJl8o86kWZHpXdUNZ3Z7N5ccLREB9Wcjz8Wz4kQOk";
  const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

  // تحقق من التوكن المرسل من المتصفح
  if (req.headers['x-api-token'] !== API_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    // إذا كان POST، أرسل الجسم
    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(SCRIPT_URL, options);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
