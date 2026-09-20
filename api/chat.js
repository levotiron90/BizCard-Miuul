const { getClientIp, createRateLimiter } = require("./_rateLimit");

const MAX_MESSAGE_LENGTH = 500;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,100}$/;
// Sohbet mesajı başına yapay zekâ maliyeti olduğu için IP başına 3 dakikada 30 mesaj.
const isChatRateLimited = createRateLimiter(30, 3 * 60 * 1000);

// Tarayıcıdan gelen gövdeyi doğrular; n8n'e sadece bilinen alanlar iletilir.
module.exports = async (req, res) => {
  if (isChatRateLimited(getClientIp(req))) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too Many Requests" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sessionId, chatInput } = req.body || {};
  const validMessage = typeof chatInput === "string" && chatInput.trim().length > 0 && chatInput.length <= MAX_MESSAGE_LENGTH;
  if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId) || !validMessage) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Gerçek n8n adresi tarayıcıya hiç gönderilmez.
  const webhookUrl = process.env.CHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("CHAT_WEBHOOK_URL ortam değişkeni tanımlı değil");
    return res.status(500).json({ error: "Chat webhook not configured" });
  }

  try {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendMessage", sessionId, chatInput: chatInput.trim() }),
    });

    if (!webhookRes.ok) {
      const responseText = await webhookRes.text().catch(() => "");
      console.error("Chat webhook hedefi hata döndü:", webhookRes.status, responseText);
      return res.status(502).json({ error: "Chat webhook delivery failed" });
    }

    const data = await webhookRes.json().catch(() => null);
    const output = data && typeof data.output === "string" ? data.output : null;
    if (!output) {
      console.error("Chat webhook beklenmeyen yanıt döndü:", data);
      return res.status(502).json({ error: "Chat webhook returned unexpected response" });
    }
    return res.status(200).json({ output });
  } catch (err) {
    console.error("Chat webhook'a ulaşılamadı:", err);
    return res.status(502).json({ error: "Chat webhook delivery failed" });
  }
};
