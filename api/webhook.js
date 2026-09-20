const { isRateLimited, getClientIp } = require("./_rateLimit");

const ALLOWED_EVENTS = new Set(["card.save", "meeting.request"]);
const ALLOWED_CARD_IDS = new Set(["sercan-balli"]);
const MAX_TEXT_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isBoundedString(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

// req.body'yi doğrudan forward etmek yerine, sadece bilinen alanları
// (bizcard-conventions skill'deki webhook veri sözleşmesi) doğrulayıp temiz
// bir kopyasını oluşturur. Bilinmeyen/fazladan alanlar elenir, zaman damgası
// sunucu tarafında yeniden üretilir.
function buildValidatedPayload(body) {
  if (!body || typeof body !== "object") return null;
  if (!ALLOWED_EVENTS.has(body.event)) return null;
  if (!ALLOWED_CARD_IDS.has(body.cardId)) return null;
  if (!body.visitor || typeof body.visitor !== "object") return null;
  if (!isBoundedString(body.visitor.name, MAX_TEXT_LENGTH)) return null;
  if (!isBoundedString(body.visitor.email, MAX_TEXT_LENGTH) || !EMAIL_PATTERN.test(body.visitor.email.trim())) return null;

  const payload = {
    event: body.event,
    cardId: body.cardId,
    timestamp: new Date().toISOString(),
    visitor: {
      name: body.visitor.name.trim(),
      email: body.visitor.email.trim(),
      phone: null,
    },
    data: {},
  };

  if (body.event === "card.save") {
    payload.data = { note: null };
  } else {
    const data = body.data || {};
    if (!DATE_PATTERN.test(data.preferredDate || "")) return null;
    if (!TIME_PATTERN.test(data.preferredTime || "")) return null;
    payload.data = { preferredDate: data.preferredDate, preferredTime: data.preferredTime, message: null };
  }

  return payload;
}

module.exports = async (req, res) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too Many Requests" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const payload = buildValidatedPayload(req.body);
  if (!payload) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Gerçek n8n adresi tarayıcıya/mobil uygulamaya hiç gönderilmez.
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("WEBHOOK_URL ortam değişkeni tanımlı değil");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  try {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      const responseText = await webhookRes.text().catch(() => "");
      console.error("Webhook hedefi hata döndü:", webhookRes.status, webhookRes.statusText, responseText);
      return res.status(502).json({ error: "Webhook delivery failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook'a ulaşılamadı:", err);
    return res.status(502).json({ error: "Webhook delivery failed" });
  }
};
