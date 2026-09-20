# BizCard n8n Workflow'ları

| Dosya | n8n adı | Görevi |
|---|---|---|
| `bizcard-webhook.json` | BizCard - Webhook | `card.save` / `meeting.request` olaylarını alır, doğrular, Google Sheet'e yazar, AI ile e-posta üretip gönderir |
| `bizcard-dogrulama.json` | BizCard - Dogrulama | Ortak doğrulama sub-workflow'u (e-posta formatı, olay türü, kart ID, tarih/saat) |
| `bizcard-hata-bildirimi.json` | BizCard - Hata Bildirimi | Error Workflow: hataları `BizCard - Hatalar` sekmesine yazar |
| `bizcard-gunluk-ozet.json` | BizCard - Gunluk Ozet | Her gün 23:59'da bugünkü kayıtları türe göre gruplayıp `BizCard - Gunluk Ozet` sekmesine yazar |

## Akış

```
Webhook → Alanlari Duzenle → Ortak Dogrulamayi Cagir → Gecerli mi?
   hayır → Gecersiz Istegi Durdur (Stop and Error → BizCard - Hata Bildirimi)
   evet  → Olay Turu
      card.save       → Ollama (teşekkür + tahmini dönüş süresi) → Sheet → Gmail
      meeting.request → AI Agent (musait_saat_kontrol tool) → Sheet → Gmail
```

- Google Sheet: `atolyekart-n8n` dosyasındaki `BizCard - ...` sekmeleri.
- AI: Ollama `llama3.2:latest` (credential: "Ollama account").
- `Musait Saat Kontrol` tool'u demo takvim kullanır (hafta içi 10-16 arası, Çarşamba sabahı ve Cuma öğleden sonra dolu).
- Webhook adresi: `/webhook/bizcard-webhook`. Web ve mobil doğrudan bu adrese değil, Vercel'deki `/api/webhook` proxy'sine istek atar; proxy `WEBHOOK_URL` ortam değişkeniyle n8n'e (Cloudflare tüneli üzerinden) iletir.
