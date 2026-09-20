// Her iki olay da aynı origin'deki /api/webhook fonksiyonuna gider; gerçek n8n adresi
// tarayıcıya hiç gönderilmez (Vercel ortam değişkeni WEBHOOK_URL'de tutulur).
window.BIZCARD_WEBHOOKS = {
  cardSave: "/api/webhook",
  meetingRequest: "/api/webhook",
};
