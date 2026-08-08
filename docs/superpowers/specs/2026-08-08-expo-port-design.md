# BizCard'ı Expo (React Native) Projesine Taşıma

## Amaç

Şu an tek sayfalık, buildless, CDN-React ile çalışan web kartvizitini (`react.html` + `card.js`), Expo Go üzerinde çalışan bir React Native uygulaması olarak da sunmak. `CLAUDE.md`'de belirtilen "ileride React'e ve mobil uygulamaya dönüşecek" hedefinin mobil ayağı.

## Kapsam

- Yeni, bağımsız bir Expo projesi: repo kökünde **`/app`** klasörü (kendi `package.json`, `node_modules`, `app.json`).
- Mevcut web sürümü (`react.html`, `index.html`, `card.js`, `vercel.json`, `src/data/*`) **değiştirilmez** — iki dağıtım hedefi (web + Expo Go) birbirinden bağımsız, aynı repo içinde bir arada yaşar.
- Hedef: **Expo Go** içinde çalışmak — EAS Build / custom dev client / native prebuild gerekmez. Bu yüzden sadece Expo Go'nun zaten içerdiği modüller kullanılır.
- **`expo-contacts` kullanılmaz** — cihazın kişiler/rehber izni hiçbir şekilde istenmez.
- `CLAUDE.md` kısıtları Expo tarafı için de geçerli: backend/veritabanı yok, gerçek iletişim bilgisi yerine demo veri, kod basit ve okunabilir kalmalı.

## Proje Yapısı

```
app/
  App.js
  app.json
  package.json
  src/
    data/
      person.js        # export default {...}  (web'deki window.BIZCARD_PERSON ile aynı demo veri)
      webhooks.js       # export default {...}  (aynı placeholder demo URL'ler, gerçek secret değil)
      privacy.js         # export default {...}  (KVKK Aydınlatma Metni, web'deki privacy.js ile aynı içerik)
      site.js            # export default "https://biz-card-miuul.vercel.app/"
    components/
      icons/
        PhoneIcon.js
        MailIcon.js
        LocationIcon.js
        LinkedinIcon.js
        GithubIcon.js
      ContactList.js
      SocialLinks.js
      PrivacyPolicyModal.js
      CardActionsForm.js
      SaveToPhoneSection.js
      QRCodeSection.js
      ProfileCard.js
    utils/
      vcard.js          # buildVCard(), slugify(), todayISODate()
```

Web projesindeki "tüm bileşenler tek dosyada" kuralı (`bizcard-conventions` skill) buildless/bundler'sız olmasından kaynaklanıyor; Expo tarafında Metro bundler olduğu için bu kısıt uygulanmaz — standart React Native dosya yapısı (her bileşen kendi dosyasında) kullanılır. Veri hâlâ `src/data/` altında, ayrı dosyalarda tutulur (böylece demo veriyi güncellemek için component koduna dokunmak gerekmez — web tarafındaki prensip korunur), ama `window.BIZCARD_*` global'leri yerine normal ES module `export default` kullanılır.

## Bağımlılıklar

Hepsi Expo Go içinde ek native derleme gerektirmeden çalışır:

| Paket | Amaç |
|---|---|
| `react-native-svg` | İkonlar ve QR kodun altyapısı |
| `react-native-qrcode-svg` | QR kod bölümü (web'deki `qrcode.react` karşılığı) |
| `@react-native-community/datetimepicker` | "Tarih" alanı (Toplantı Talep Et formu) |
| `expo-sharing` | `.vcf` dosyasını native paylaşım sayfası üzerinden paylaşmak |
| `expo-file-system` | `.vcf` içeriğini geçici bir dosyaya yazmak (paylaşım için dosya yolu gerekiyor) |

## Özellik Eşlemesi

### İletişim listesi ve sosyal linkler
`ContactList` ve `SocialLinks` bileşenleri; `Linking.openURL()` ile tel:/mailto:/Google Maps/LinkedIn/GitHub linklerini açar. İkonlar `react-native-svg`'nin `Svg`/`Path` bileşenleriyle, web'deki path verileri birebir korunarak yeniden oluşturulur.

### KVKK onaylı form (Kartı Kaydet / Toplantı Talep Et)
`CardActionsForm`: isim, e-posta (regex doğrulama), tarih (toplantı için) ve zorunlu KVKK onay checkbox'ı. Doğrulama mantığı ve buton kilitleme davranışı (`submitting.card` / `submitting.meeting`, `setTimeout` ile simüle edilen "Gönderiliyor..." durumu) web'den birebir taşınır — gerçek bir webhook çağrısı yapılmaz (web'de de yapılmıyor, `CLAUDE.md`: backend yok).

Tarih alanı `@react-native-community/datetimepicker` ile native tarih seçici olarak render edilir; geçmiş tarih seçimi engellenir (web'deki `min={todayISODate()}` davranışının karşılığı).

### Gizlilik Politikası modalı
`PrivacyPolicyModal`: React Native `Modal` bileşeni, `src/data/privacy.js`'deki bölümleri sırayla başlık/paragraf olarak render eder. Web'deki overlay + kapat butonu davranışı korunur.

### Kartviziti Telefonuma Kaydet
Web'de bu buton bir `.vcf` dosyasını `data:` URI ile tarayıcıya indirtiyor. Expo'da native kişiler iznine ihtiyaç duymadan eşdeğerini sağlamak için:
1. `utils/vcard.js`'deki `buildVCard()` ile aynı vCard metni oluşturulur.
2. `expo-file-system` ile bu metin geçici bir `.vcf` dosyasına yazılır.
3. `expo-sharing.shareAsync()` ile işletim sisteminin native paylaşım sayfası açılır; kullanıcı oradan "Kişilere Ekle" seçeneğini seçebilir.

Bu akışta izni bizim uygulamamız değil, işletim sisteminin kendi kişiler uygulaması yönetir — uygulama `expo-contacts` veya herhangi bir CONTACTS izni istemez.

### QR kod
`QRCodeSection`: `react-native-qrcode-svg` ile `src/data/site.js`'deki URL'yi kodlar (web sürümüne yönlendiren aynı QR).

### Görsel kimlik
Web'deki mor-mavi gradient (`#6a5cff → #8a6bff → #5eb8ff`), beyaz kart yüzeyi, koyu lacivert metin tonları (`#1f1b3d`, `#0d1b34`) `StyleSheet.create` ile taşınır. `expo-linear-gradient` header arka planındaki gradient için kullanılabilir (Expo Go uyumlu).

## Kapsam Dışı

- Gerçek webhook/backend entegrasyonu (web'de de yok, sadece simülasyon).
- EAS Build ile native binary üretimi / App Store-Play Store dağıtımı — sadece Expo Go üzerinden çalıştırma hedefleniyor.
- Kişiler/rehber (contacts) entegrasyonu — bilinçli olarak dışlandı.
- Push notification, derin bağlantı (deep linking) gibi ek mobil özellikler.
- Web sürümünün (`react.html`/`index.html`) değiştirilmesi veya kaldırılması.
