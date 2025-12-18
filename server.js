require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 3000;

// ✅ MUST COME FIRST
app.use(express.json());
app.use(cors({ origin: "*" })); 

app.post("/api/message", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://yoursite.com");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  console.log("REQ BODY:", req.body);

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing fields",
    });
  }

  const text = `
📩 New Contact Message
👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${message}
`;

  const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
      }),
    });

    console.log("Message sent to Telegram ✅");

    res.json({ success: true });

  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).json({ success: false });
  }
});


// ❗ catch-all (prevents HTML responses)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`🔥 SERVER ON ${PORT} 🔥`);
});
