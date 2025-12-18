require("dotenv").config();
const express = require("express");
const cors = require("cors");

// If using Node 18+ on Railway, fetch is built-in
// Otherwise uncomment next line:
// const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

/* ✅ BODY PARSER (MUST BE FIRST) */
app.use(express.json());

/* ✅ CORS (WordPress → Railway) */
app.use(cors({
  origin: "https://n6n-wordpress.yboc1e.easypanel.host/wp-admin/tmp366889.htm", // 🔁 replace with your real WP domain
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

/* (Optional) serve static files if needed */
app.use(express.static("public"));

/* ✅ API ROUTE */
app.post("/api/message", async (req, res) => {
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

/* ✅ JSON 404 (prevents HTML errors) */
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`🔥 SERVER ON ${PORT} 🔥`);
});


