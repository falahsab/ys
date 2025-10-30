export default async function handler(req, res) {
  const API_TOKEN = "s3cr3tK3y123"; // التوكن المخفي
  const SCRIPT_ID = "AKfycbxa5MKkdT0skVXhAjmCT6jY78bfD2viTlZi4ntrxP-NlIWDmsLTZjQgiWVZLNFKwmCz";
  const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

  try {
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    // إذا كان GET، أرسل التوكن كـ query param
    if(req.method === "GET"){
      const url = new URL(SCRIPT_URL);
      url.searchParams.append("token", API_TOKEN);
      const response = await fetch(url.toString(), options);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // إذا كان POST، أرسل التوكن داخل الجسم
    if(req.method === "POST"){
      const bodyWithToken = {...req.body, token: API_TOKEN};
      options.body = JSON.stringify(bodyWithToken);
      const response = await fetch(SCRIPT_URL, options);
      const data = await response.json();
      return res.status(200).json(data);
    }

  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
