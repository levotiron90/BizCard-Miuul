# KVKK Aydınlatma Metni ve Form Onayı

## Amaç

Kartvizit formu (`CardActionsForm`) üzerinden toplanan ziyaretçi verileri (isim, e-posta, toplantı tarihi) için KVKK'ya uygun bir Aydınlatma Metni yazmak ve bu metni forma, açık rıza alacak şekilde entegre etmek.

## Kapsam

- Yeni veri dosyası: `src/data/privacy.js` — `window.BIZCARD_PRIVACY_POLICY` (metin içeriği).
- `card.js` içine yeni `PrivacyPolicyModal` bileşeni ve `CardActionsForm`'a onay kutucuğu + link eklenir.
- Form tasarımı (renk teması, buton yapısı) değişmez; sadece checkbox + link + modal eklenir.
- Gerçek bir hukuki danışmanlık değildir — metin KVKK m.10 genel yapısını izleyen bir taslaktır; sonunda "yaygın/ticari kullanım öncesi hukuki inceleme önerilir" notu bulunur.

## Aydınlatma Metni İçeriği

Veri sorumlusu: **Sercan BALLI / Veri Endüstri Mühendislik A.Ş.**, iletişim: `sercan.balli@veriendustri.com` (mevcut `src/data/person.js` ile aynı).

Bölümler:
1. **Veri Sorumlusunun Kimliği** — yukarıdaki bilgiler.
2. **İşlenen Kişisel Veriler** — ad-soyad, e-posta; toplantı talebinde ayrıca tercih edilen tarih/saat ve mesaj. ("Telefonuma Ekle" vCard indirmesi sunucuya veri göndermez, bu ayrıca belirtilir.)
3. **İşleme Amacı** — kartvizit sahibine ulaşım talebinin/toplantı talebinin değerlendirilmesi ve yanıtlanması.
4. **Hukuki Sebep** — KVKK m.5/2-c (bir sözleşmenin kurulması/ifasıyla ilgili) ve açık rıza (checkbox onayı).
5. **Aktarılan Taraflar:**
   - **Vercel Inc.** — barındırma/altyapı sağlayıcısı, yurt dışında (ABD) sunucularda barındırma; KVKK m.9 kapsamında yurt dışı aktarım notu.
   - **n8n** — otomasyon/iş akışı aracı; **henüz aktif değildir**, ileride devreye alındığında bu metin güncellenecektir.
   - **Mobil uygulama** — planlanan, henüz yayında değildir; yayına alındığında aktarım kapsamı güncellenecektir.
6. **Saklama Süresi** — ilgili talep sonuçlandıktan sonra en fazla 1 yıl içinde silinir/anonimleştirilir.
7. **İlgili Kişinin Hakları (KVKK m.11)** — veri işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme/yok etme, itiraz vb. standart liste.
8. **Başvuru / Silme Talebi Yolu** — `sercan.balli@veriendustri.com` adresine e-posta ile başvuru.
9. **Not** — bu metin genel bir taslaktır, gerçek/ticari kullanım öncesi hukuki inceleme önerilir.

## UI Davranışı

- `CardActionsForm` içindeki form alanları ile buton satırı arasına tek bir checkbox + açıklama metni eklenir: *"Kişisel verilerimin [amaç] amacıyla işlenmesini **KVKK Aydınlatma Metni** kapsamında kabul ediyorum."* — kalın/link kısmı tıklanınca modal açılır.
- Checkbox state'i: `const [consent, setConsent] = useState(false);`
- Modal state'i: `const [showPolicy, setShowPolicy] = useState(false);` — link tıklanınca `true`, kapat butonu/backdrop tıklanınca `false`.
- `validateContact()` fonksiyonuna consent kontrolü eklenir: checkbox işaretli değilse `nextErrors.consent = "Lütfen KVKK Aydınlatma Metni'ni onaylayın."` — bu hata diğer alan hatalarıyla aynı anda, aynı şekilde (anında, gecikmesiz) gösterilir.
- Consent hatası varken önceki oturumdaki "buton kilidi" (Gönderiliyor... state'i) hiç tetiklenmez — tıpkı isim/e-posta hatası gibi, `setSubmitting` çağrılmadan `return` edilir.
- `PrivacyPolicyModal` bileşeni: `window.BIZCARD_PRIVACY_POLICY`'deki bölümleri sırayla `<h3>`/`<p>` olarak render eden basit bir overlay + kapat butonu. Mevcut lacivert/turkuaz renk paletini kullanır.

## Kapsam Dışı

- n8n/mobil entegrasyonunun gerçek şekilde kurulması (sadece metinde "planlanıyor" olarak belirtiliyor).
- Çerez/consent yönetim sistemi (cookie banner) — bu form sadece ziyaretçi tarafından girilen verileri kapsıyor.
- Form tasarımının/temanın değiştirilmesi.
