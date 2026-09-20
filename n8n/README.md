# BizCard n8n Workflow'ları

| Dosya | n8n adı | Görevi |
|---|---|---|
| `bizcard-webhook.json` | BizCard - Webhook | `card.save` / `meeting.request` olaylarını alır, doğrular, Google Sheet'e yazar, AI ile e-posta üretip gönderir |
| `bizcard-dogrulama.json` | BizCard - Dogrulama | Ortak doğrulama sub-workflow'u (e-posta formatı, olay türü, kart ID, tarih/saat) |
| `bizcard-hata-bildirimi.json` | BizCard - Hata Bildirimi | Error Workflow: hataları `BizCard - Hatalar` sekmesine yazar |
| `bizcard-gunluk-ozet.json` | BizCard - Gunluk Ozet | Her gün 23:59'da bugünkü kayıtları türe göre gruplayıp `BizCard - Gunluk Ozet` sekmesine yazar |
| `bizcard-rag-indeksleme.json` | BizCard - RAG Indeksleme | Form ile yüklenen üç PDF'yi (profil rehberi, toplantı politikası, Veri Endüstri kurumsal rehberi) metadata etiketleyip chunk'lara böler ve vector store'a yazar |
| `bizcard-sss-chatbot.json` | BizCard - SSS Chatbot | Chat Trigger + AI Agent; yanıtlarını vector store'dan (`bizcard_bilgi_arama` tool'u) üretir |

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

## RAG ve Chatbot

- Kaynak dokümanlar `docs/rag/` klasöründedir (`node docs/rag/build-pdfs.js` ile yeniden üretilir). `bizcard_veri_endustri_kurumsal_rehber.pdf` şirket hakkında örnek (demo) bilgiler içerir. Toplantı politikasının v1 ve v2 sürümleri vardır; v2'de toplantı süresi 30 dk'dan 45 dk'ya çıkar.
- İndeksleme formu üç PDF ve üç versiyon seçimi (v1/v2) alır. Her yükleme vector store'u (Clear Store: açık) baştan oluşturur; **doküman güncellemesi = yeni sürümü seçip üç PDF'yi formla tekrar yüklemek**.
- Her chunk'ın metadata'sı: `kaynak_dokuman`, `dokuman_turu`, `dokuman_versiyonu`, `eklenme_tarihi`, `meta_title`, `meta_description`, `meta_keywords`.
- Vector store bellektedir (anahtar: `bizcard_bilgi`). **n8n her yeniden başladığında formdan PDF'leri tekrar yüklemek gerekir.**
- Chunk boyutu 1500, overlap 200, topK 10; embedding: Ollama `nomic-embed-text`.
- Sohbet modeli: OpenRouter `nex-agi/nex-n2.5-pro:free`. `deepseek-v4-flash-0731:free` artık ücretsiz değil (404), `gemma-4-31b-it:free` ise kota nedeniyle 429 verdi. Ücretsiz modeller değişebilir; hata alınırsa OpenRouter model listesinden tool destekli başka bir ücretsiz model seçilmelidir.

## Çalıştırma ortamı

BizCard workflow'ları AtölyeKart'tan ayrı bir n8n örneğinde çalışır (Docker container `n8n-bizcard`, http://localhost:5680, volume `n8n_test_data`, `--restart unless-stopped`). Dışarıya ayrı bir Cloudflare Quick Tunnel ile açılır:

```
cloudflared tunnel --no-autoupdate --metrics 127.0.0.1:20260 --url http://localhost:5680
curl http://127.0.0.1:20260/quicktunnel     # güncel tünel adresini verir
```

- Tünel adresi değiştiğinde (süreç durursa yeni adres alınır): Vercel'de `WEBHOOK_URL` = `https://<tünel>/webhook/bizcard-webhook` güncellenip yeniden deploy edilmelidir.
- RAG formu: `https://<tünel>/form/5f0c7a52-3b1e-4c6f-9a55-2d7e8b1c4a90`; sohbet: `https://<tünel>/webhook/9c4e2a10-7d3b-4f8a-b6c1-0e5a3d9f7b22/chat`.
- n8n container yeniden başladığında vector store boşalır; üç PDF formdan tekrar yüklenmelidir.
