# CLAUDE.md

## Bu proje ne?

BizCard adında dijital bir kartvizit (Sercan BALLI, Veri Endüstri Mühendislik A.Ş.). Proje artık uçtan uca çalışır durumda: web ve mobilde canlı, "Kartı Kaydet" / "Toplantı Talep Et" akışları ve sohbet asistanı n8n üzerinden işliyor.

## Kimin için?

Yazılımcı olmayan iş insanları için hazırlanan bir kurs projesi. Kod basit ve okunabilir kalsın, gereksiz karmaşıklaşmasın.

## Ton

Sıcak ve profesyonel. Aşırı resmi değil, aşırı gündelik de değil.

## Kapsam

- Kartvizit: isim, unvan, iletişim bilgileri, QR kod, "Telefonuma Ekle" (vCard).
- **Kartı Kaydet:** ziyaretçi ad + e-posta bırakır (KVKK onayıyla); teşekkür + tahmini dönüş süresi içeren bir e-posta alır.
- **Toplantı Talep Et:** ziyaretçi tarih ve saat seçer; saat doluysa tek bir alternatif saat önerilir, kesin onay Sercan'dan gelir.
- **Sohbet asistanı:** ziyaretçi Sercan'ın hizmetleri, toplantı süreci ve Veri Endüstri Mühendislik A.Ş. hakkında soru sorar; cevaplar yüklenen dokümanlardan (RAG) gelir.

## Teknik Mimari (Güncel Durum)

### Web ve Mobil
- **Web:** `react.html` + `card.js` (React, CDN; derleme adımı yok) + Vercel serverless fonksiyonları `api/webhook.js` ve `api/chat.js`. Canlı adres: https://biz-card-miuul.vercel.app (Vercel projesi `biz-card-miuul`). `ders4` dalına push **Preview** üretir; production için önizleme `vercel promote` ile (ya da panelden "Promote to Production") yayına alınır.
- **Mobil:** `mobile/` altında Expo (React Native) portu; aynı Vercel API'lerini kullanır (`mobile/src/data/webhooks.js`). Önizleme: `cd mobile && npx expo start` ve Expo Go ile QR okutma. Sohbet penceresi şimdilik yalnızca web'de var.
- Demo veri `src/data/*.js` (web) ve `mobile/src/data/*.js` (mobil) içindedir; bileşen kodu veriyi bu dosyalardan okur.

### Webhook sözleşmesi ve doğrulama
- İki olay, tek zarf: `card.save` ve `meeting.request` (`event`, `cardId`, `timestamp`, `visitor{name,email,phone}`, `data{...}`). Ayrıntı: `.claude/skills/bizcard-conventions/`.
- `api/webhook.js` **sunucu tarafında** olay türü, kart ID'si, e-posta biçimi, tarih/saat biçimini doğrular; bilinmeyen alanları eler, zaman damgasını yeniden üretir ve n8n'e temiz payload iletir. IP başına 3 dakikada 10 istek (rate limit).
- `api/chat.js`: oturum kimliği (`^[A-Za-z0-9_-]{8,100}$`) ve mesaj uzunluğu (≤500) doğrulanır; IP başına 3 dakikada 30 mesaj. Her endpoint kendi sayacını kullanır (`api/_rateLimit.js`).
- Gerçek n8n adresleri tarayıcıya/mobil uygulamaya gönderilmez; yalnızca Vercel ortam değişkenlerinde tutulur: `WEBHOOK_URL`, `CHAT_WEBHOOK_URL`. Repoda secret yoktur (`.env*` ve `.vercel` `.gitignore`'dadır).

### n8n Altyapısı
- BizCard, AtölyeKart'tan **ayrı** bir n8n örneğinde çalışır: Docker container `n8n-bizcard` (http://localhost:5680, volume `n8n_test_data`, `--restart unless-stopped`). AtölyeKart n8n'i (5678) ve tüneli bundan bağımsızdır.
- Redis için container aynı Docker ağına bağlıdır: `docker network connect atolyekart-net n8n-bizcard`.
- Dışarıya ayrı bir **Cloudflare Quick Tunnel** ile açılır: `cloudflared tunnel --no-autoupdate --metrics 127.0.0.1:20260 --url http://localhost:5680`. Güncel adres: `curl http://127.0.0.1:20260/quicktunnel`.
  - ⚠️ Quick tunnel kalıcı değildir; süreç durursa/koparsa adres değişir. Bu durumda Vercel'de `WEBHOOK_URL` ve `CHAT_WEBHOOK_URL` yeni adresle güncellenip yeniden deploy edilir (`vercel env` + önizleme + promote). Kalıcı çözüm: kendi domain'imiz + Cloudflare named tunnel (denenmedi).
- Google Sheet: `atolyekart-n8n` dosyasındaki `BizCard - ...` sekmeleri (Kart Kaydetme, Toplanti Talepleri, Gunluk Ozet, Hatalar).

### n8n Workflow'ları (`n8n/` klasöründe JSON olarak; bkz. `n8n/README.md`)
| Workflow | Görevi |
|---|---|
| BizCard - Webhook | Olayı alır → ortak doğrulama → `card.save`: AI teşekkür maili + Sheet + Gmail; `meeting.request`: AI Agent (müsait saat tool'u) + Sheet + Gmail |
| BizCard - Dogrulama | Ortak sub-workflow: e-posta biçimi, olay türü, bilinmeyen kart ID'si, tarih/saat |
| BizCard - Hata Bildirimi | Error Workflow: hataları `BizCard - Hatalar` sekmesine yazar |
| BizCard - Gunluk Ozet | Her gün 23:59: bugünkü kayıtları Loop + Code ile türe göre gruplar, Sheet'e yazar |
| BizCard - RAG Indeksleme | Form ile 3 PDF yüklenir (profil rehberi, toplantı politikası, Veri Endüstri kurumsal rehberi), metadata etiketlenir, vector store'a yazılır |
| BizCard - SSS Chatbot | Chat Trigger + AI Agent + RAG tool'u + Redis hafızası + MCP sunucusu |
| BizCard - n8n API Sorgu | n8n API ile "bu hafta kaç kart kaydı / toplantı talebi geldi" sorgusu |

### Sohbet Asistanı (RAG + Redis + MCP)
- **Dil modeli:** OpenRouter ücretsiz `nex-agi/nex-n2.5-pro:free`; hata/kota durumunda **yedek model** Google Gemini `models/gemini-3.5-flash` (Agent'ın "fallback model" özelliği).
  - ⚠️ Ücretsiz katmanların günlük kotası vardır (OpenRouter `free-models-per-day`, Gemini kotası); yoğun testte ikisi de 429 verebilir. Sürekli kullanım için OpenRouter'a kredi eklemek ya da ücretli model seçmek gerekir. Ücretsiz model adları zamanla değişir (`deepseek-v4-flash-0731:free` artık ücretsiz değil).
- **Ziyaretçi bazlı sohbet geçmişi (Redis):** `Redis Sohbet Hafizasi` node'u, oturum kimliğini `bizcard_<sessionId>` anahtarıyla saklar (TTL=0, son 5 mesaj). Web'de kimlik `localStorage`'da (`bizcard_chat_session`) tutulur; sayfa yenilense de aynı ziyaretçi hatırlanır, farklı ziyaretçiye geçmiş sızmaz.
- **RAG:** `bizcard_bilgi_arama` tool'u (in-memory Vector Store, anahtar `bizcard_bilgi`, Ollama `nomic-embed-text`, chunk 1500 / overlap 200, topK 10). Kaynak dokümanlar `docs/rag/` (üretim: `node docs/rag/build-pdfs.js`; içerik demo veridir). Her chunk'ta metadata: `kaynak_dokuman`, `dokuman_turu`, `dokuman_versiyonu`, `eklenme_tarihi`, `meta_*`.
  - **Güncelleme yöntemi:** form Clear Store açık çalışır; yeni sürümü seçip üç PDF'i tekrar yüklemek bilgi tabanını baştan kurar (ör. toplantı politikası v1 → v2: süre 30 dk → 45 dk).
  - ⚠️ Vector store **bellektedir**: `n8n-bizcard` yeniden başlayınca sıfırlanır, PDF'ler formdan (`/form/5f0c7a52-3b1e-4c6f-9a55-2d7e8b1c4a90`) tekrar yüklenmelidir.
- **MCP:** `BizCard MCP Sunucusu` (MCP Server Trigger) aynı arama tool'unu MCP protokolüyle (Streamable HTTP) açar: `/mcp/b6f2c1d4-5a3e-4e7b-9c18-2f0d8a7e6b35`. Doğrulama: `initialize` → `tools/list` → `tools/call` başarılı. Kimlik doğrulama yok (eğitim amaçlı; üretimde Header/Bearer Auth eklenmeli). Bir export/import sonrasında `ai_tool` bağlantısının hem Agent'a hem MCP'ye gittiği JSON'dan doğrulanmalıdır.
- Sistem promptu, üretimde görülen davranışlara karşı somut kurallar içerir: tool'u mesaj başına en fazla 1 kez çağırma (Max Iterations=4), takip sorusunu konusu açık aramaya çevirme, fiyat/toplantı onayı uydurmama, düz metin cevap (JSON değil).

### n8n API ile Operasyonel Sorgular
- n8n'in kendi **"n8n" node'u** (Resource: Execution, Get Many, "Include Execution Details" açık) ile `BizCard - Webhook` çalıştırmaları çekilir; Code node bu haftayı (Pazartesi 00:00'dan itibaren) filtreleyip `card.save` / `meeting.request` ayrımıyla sayar.
- Örnek çıktı: `{"haftaBaslangici":"2026-09-14","buHaftaToplamIstek":16,"kartKaydi":9,"toplantiTalebi":7,"basarisiz":4,...}`.

## Test ve Doğrulama Notları
- API düzeyi: geçerli `card.save`, dolu/boş saatli `meeting.request`, bilinmeyen kart ID'si ve geçersiz e-posta (Hata Bildirimi sekmesine düşer).
- Web: headless Edge ile canlı sitede form ve sohbet penceresi (yenileme sonrası hafıza) test edildi; Vercel'de `vercel curl` ile Preview doğrulandı.
- n8n execution geçmişi arayüzden (`localhost:5680`) ya da n8n API'den izlenebilir.

## Kısıtlar
- Veritabanı yok; veri Google Sheet'te tutulur.
- Gerçek iletişim bilgileri ve şirket bilgileri yerine örnek (demo) veri kullanılır.
- Secret'lar repoya girmez; Vercel ortam değişkenlerinde tutulur.
