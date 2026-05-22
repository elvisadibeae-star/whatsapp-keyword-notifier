# 📱 WhatsApp Keyword Notifier

Monitors incoming WhatsApp Business messages for specific keywords and sends you a Gmail alert instantly.

---

## How It Works

```
WhatsApp message received
        ↓
Meta sends it to your /webhook endpoint
        ↓
Server checks if message contains any keyword
        ↓
If match found → sends formatted email to you via Gmail
```

---

## Prerequisites

- A **Meta Developer account** (free): https://developers.facebook.com
- A **WhatsApp Business account** (free tier available)
- A **Gmail account** with 2-Factor Authentication enabled
- **Node.js 18+** installed
- A way to deploy publicly (Render, Railway, or ngrok for local testing)

---

## Step 1 — Install & Configure

```bash
# Clone or copy this project folder
cd whatsapp-keyword-notifier

# Install dependencies
npm install

# Create your .env file
cp env.example.txt .env
# Then edit .env with your actual values (see below)
```

---

## Step 2 — Get a Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in and enable 2FA if not already done
3. Create a new App Password → select "Mail" and "Other (Custom name)"
4. Copy the 16-character password into your `.env` as `GMAIL_APP_PASSWORD`

---

## Step 3 — Set Up Meta WhatsApp Business API

1. Go to https://developers.facebook.com and create a new App
2. Choose **Business** type → add **WhatsApp** product
3. In the WhatsApp section, go to **API Setup**
4. Note your **Phone Number ID** and **Access Token** (you don't need these in the code, but keep them handy)

---

## Step 4 — Deploy Your Server

### Option A: Deploy to Render (recommended, free tier)
1. Push this folder to a GitHub repo
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node index.js`
6. Add all environment variables from your `.env` file
7. Deploy — you'll get a public URL like `https://your-app.onrender.com`

### Option B: Local testing with ngrok
```bash
# Install ngrok: https://ngrok.com
ngrok http 3000
# Use the https URL it gives you as your webhook URL
```

---

## Step 5 — Register Your Webhook with Meta

1. In Meta Developer Console → WhatsApp → Configuration
2. Set **Callback URL**: `https://your-app.onrender.com/webhook`
3. Set **Verify Token**: same value as `VERIFY_TOKEN` in your `.env`
4. Click **Verify and Save**
5. Subscribe to the **messages** field

---

## Step 6 — Test It

Send a WhatsApp message to your business number containing one of your keywords (e.g. "urgent") and check your email inbox!

---

## Customizing Keywords

Edit the `KEYWORDS` line in your `.env`:

```
KEYWORDS=urgent,help,payment,invoice,emergency,call me
```

Keywords are **case-insensitive** and support **phrases** (e.g. "call me").

---

## Project Structure

```
whatsapp-keyword-notifier/
├── index.js          # Express server + webhook handler
├── mailer.js         # Gmail email sending logic
├── package.json      # Dependencies
└── env.example.txt   # Environment variable template
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Webhook verification fails | Make sure `VERIFY_TOKEN` matches exactly in Meta console and `.env` |
| Email not sending | Double-check Gmail App Password (not your regular password) |
| No messages received | Ensure you subscribed to the "messages" webhook field in Meta console |
| Server crashes | Check logs — likely a missing `.env` variable |
