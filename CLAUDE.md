# CLAUDE.md

## Bu proje ne?

BizCard adında dijital bir kartvizit. Şu an sadece basit bir HTML sayfası - ileride React'e ve mobil uygulamaya dönüşecek.

## Kimin için?

Yazılımcı olmayan iş insanları için hazırlanan bir kurs projesi. Kod basit ve okunabilir kalsın, gereksiz karmaşıklaşmasın.

## Ton

Sıcak ve profesyonel. Aşırı resmi değil, aşırı gündelik de değil.

## Şimdilik kapsam

- Tek sayfalık HTML kartvizit: isim, unvan, iletişim bilgileri.
- Görsel olarak sade-kalabalık değil.

## Kısıtlar
- Veritabanı yok. Tek backend: Vercel'deki `api/webhook.js` proxy'si; o da n8n webhook'una (yerel Docker + Cloudflare Quick Tunnel) iletir. Workflow'lar `n8n/` klasöründe (bkz. `n8n/README.md`).
- Gerçek iletişim bilgileri yerine örnek (demo) veri kullan.