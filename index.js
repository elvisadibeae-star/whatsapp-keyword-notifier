require("dotenv").config();
const express = require("express");
const { sendEmailAlert } = require("./mailer");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const KEYWORDS = process.env.KEYWORDS
  ? process.env.KEYWORDS.split(",").map((k) => k.trim().toLowerCase()).filter(k => k)
  : ["urgent", "help", "important"];

console.log("🔍 Watching for keywords:", KEYWORDS);

// ─── Webhook Verification ─────────────────────────────────────────────────────
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Webhook verification failed");
    res.sendStatus(403);
  }
});

// ─── Receive Incoming Messages ────────────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    for (const message of messages) {
      if (message.type !== "text") continue;

      const text = message.text?.body || "";
      const from = message.from;
      const timestamp = new Date(parseInt(message.timestamp) * 1000).toLocaleString();

      console.log(`📩 Message from ${from}: "${text}"`);

      // Check for keyword match
      const matched = KEYWORDS.filter((kw) => text.toLowerCase().includes(kw));

      if (matched.length > 0) {
        console.log(`🚨 Keyword match: [${matched.join(", ")}] — sending email...`);
        await sendEmailAlert({ from, text, matched, timestamp });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.sendStatus(500);
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("WhatsApp Keyword Notifier is running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
