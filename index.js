const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express().use(bodyParser.json());

// Hizi zitachukuliwa kutoka ENV kwenye Railway
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages
  ) {
    const message = body.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const text = message.text?.body || "";

    const reply = generateReply(text);

    await sendMessage(from, reply);
  }

  res.sendStatus(200);
});

// Function ya kutoa majibu (Swahili + English)
function generateReply(text) {
  const lower = text.toLowerCase();

  const isEnglish = /[a-z]/.test(lower);

  if (lower.includes("hello") || lower.includes("hi")) {
    return isEnglish
      ? "Hello 👋, how can I help you today?"
      : "Habari 👋, naweza kukusaidia vipi leo?";
  }

  if (lower.includes("price") || lower.includes("bei")) {
    return isEnglish
      ? "Our prices depend on the service. Please tell me which service you need."
      : "Bei zetu zinategemea huduma. Tafadhali taja huduma unayohitaji.";
  }

  if (
    lower.includes("services") ||
    lower.includes("huduma") ||
    lower.includes("service")
  ) {
    return isEnglish
      ? "We offer services like: certificates, website design, graphics, business support and more."
      : "Tunatoa huduma kama: vyeti, websites, graphics, usajili wa biashara na nyinginezo.";
  }

  if (lower.includes("location") || lower.includes("ulipo") || lower.includes("wapi")) {
    return isEnglish
      ? "We are located in Tanzania. Contact us for exact directions."
      : "Tupo Tanzania. Wasiliana nasi kwa maelekezo kamili.";
  }

  return isEnglish
    ? "Thank you for your message 😊. How can I assist you?"
    : "Asante kwa ujumbe wako 😊. Nakuaje nikupe msaada?";
}

// Kutuma ujumbe WhatsApp
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Bot running on port " + PORT));
