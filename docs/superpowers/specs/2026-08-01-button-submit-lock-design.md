# Kartı Kaydet / Toplantı Talep Et — Gönderim Kilidi

## Amaç

`CardActionsForm` (card.js) içindeki "Kartı Kaydet" ve "Toplantı Talep Et" butonları, geçerli bir gönderim sırasında art arda tıklanarak birden fazla kez tetiklenebiliyor. Bu değişiklik, bir gönderim işlemdeyken ilgili butonu devre dışı bırakarak tekrar tıklanmasını engeller.

## Kapsam

- Sadece `card.js` içindeki `CardActionsForm` bileşeni değişir.
- Webhook entegrasyonu eklenmiyor; `window.BIZCARD_WEBHOOKS` URL'leri hâlâ placeholder, gerçek bir ağ isteği yapılmıyor (`CLAUDE.md`: backend yok).

## Davranış

1. **Doğrulama hataları** (boş isim, geçersiz e-posta, geçmiş/boş tarih) anında gösterilir — herhangi bir gecikme veya kilitleme olmadan, mevcut davranışla aynı.
2. **Geçerli bir gönderim** başladığında:
   - İlgili buton (`Kartı Kaydet` veya `Toplantı Talep Et`) `disabled` olur ve metni "Gönderiliyor..." olarak değişir.
   - Diğer buton etkilenmez, bağımsız çalışmaya devam eder.
   - ~600ms yapay gecikmenin ardından başarı mesajı gösterilir ve buton tekrar aktif hale gelir, metni eski haline döner.
3. Bir buton "Gönderiliyor..." durumundayken tekrar tıklanması hiçbir şey yapmaz (disabled), böylece art arda/çift gönderim engellenmiş olur.

## State Yapısı

`CardActionsForm` içinde tek bir state objesi:

```js
const [submitting, setSubmitting] = useState({ card: false, meeting: false });
```

`handleSaveCard` ve `handleRequestMeeting`, doğrulama geçtikten sonra kendi anahtarını (`card` / `meeting`) `true` yapar, `setTimeout` ile ~600ms sonra `false`'a çeker ve status'u günceller.

## Kapsam Dışı

- Gerçek webhook çağrısı eklemek.
- İki butonu birbirine bağlı kilitlemek (biri gönderilirken diğerini de kilitlemek) — bilerek bağımsız bırakıldı.
- Başarılı gönderim sonrası butonu kalıcı olarak kilitli bırakmak — bilerek tekrar aktif hale getiriliyor.
