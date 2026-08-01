# KVKK Aydınlatma Metni Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kartvizit formuna (`CardActionsForm`) bir KVKK onay kutucuğu + "KVKK Aydınlatma Metni" linki eklemek; link bir modal açar, metin `src/data/privacy.js`'de tutulur; checkbox işaretlenmeden gönderim (ve "Gönderiliyor..." kilidi) tetiklenmez.

**Architecture:** Yeni bir `src/data/privacy.js` dosyası `window.BIZCARD_PRIVACY_POLICY` objesini tanımlar (bölüm listesi). `card.js`'e yeni bir `PrivacyPolicyModal` bileşeni eklenir ve `CardActionsForm` içine `consent`/`showPolicy` state'leri, checkbox+link JSX'i ve `validateContact()`'a consent kontrolü eklenir. `react.html`'e yeni script tag'i ve modal/checkbox için birkaç CSS kuralı eklenir.

**Tech Stack:** React 18 (esm.sh CDN, buildless), Babel standalone, proje npm/test framework içermiyor — doğrulama tarayıcıda manuel yapılır.

## Global Constraints

- Tüm React bileşenleri tek dosyada kalır: `card.js` (bizcard-conventions).
- Metin/içerik verisi `card.js` içine hardcode edilmez, `src/data/` altında `window.BIZCARD_*` global'i olarak tanımlanır (bizcard-conventions).
- Backend/webhook çağrısı eklenmez (`CLAUDE.md`).
- Form teması (lacivert/turkuaz) ve buton yapısı değişmez; sadece checkbox+link+modal eklenir.
- Doğrulama hataları (isim, e-posta, tarih, consent) hepsi anında/gecikmesiz gösterilir; sadece geçerli gönderimde "Gönderiliyor..." kilidi devreye girer.

---

### Task 1: `src/data/privacy.js` içeriğini oluştur

**Files:**
- Create: `src/data/privacy.js`
- Modify: `react.html:317-320` (script tag'leri arasına ekleme)

**Interfaces:**
- Produces: `window.BIZCARD_PRIVACY_POLICY = { lastUpdated: string, controller: { name, company, email }, sections: [{ heading: string, body: string[] }] }` — Task 2'de `PrivacyPolicyModal` bunu tüketir.

- [ ] **Step 1: `src/data/privacy.js` dosyasını yaz**

```js
window.BIZCARD_PRIVACY_POLICY = {
  lastUpdated: "2026-08-01",
  controller: {
    name: "Sercan BALLI",
    company: "Veri Endüstri Mühendislik A.Ş.",
    email: "sercan.balli@veriendustri.com",
  },
  sections: [
    {
      heading: "1. Veri Sorumlusunun Kimliği",
      body: [
        "Bu kartvizit üzerinden paylaştığınız kişisel veriler, veri sorumlusu sıfatıyla Sercan BALLI (Veri Endüstri Mühendislik A.Ş.) tarafından işlenmektedir.",
        "İletişim: sercan.balli@veriendustri.com",
      ],
    },
    {
      heading: "2. İşlenen Kişisel Veriler",
      body: [
        "Formu doldurduğunuzda: ad-soyad ve e-posta adresiniz.",
        "Toplantı talebinde ayrıca: tercih ettiğiniz tarih.",
        "\"Telefonuma Ekle\" ile kartviziti indirmeniz herhangi bir veri göndermez; işlem tamamen kendi cihazınızda gerçekleşir ve bu kapsamda kişisel veri işlenmez.",
      ],
    },
    {
      heading: "3. Kişisel Verilerin İşlenme Amacı",
      body: [
        "Kartvizit sahibine ulaşım talebinizin veya toplantı talebinizin değerlendirilmesi ve size dönüş yapılabilmesi amacıyla işlenir.",
      ],
    },
    {
      heading: "4. Hukuki Sebep",
      body: [
        "KVKK m.5/2-c kapsamında bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması ve/veya bu form aracılığıyla verdiğiniz açık rıza.",
      ],
    },
    {
      heading: "5. Kişisel Verilerin Aktarılabileceği Taraflar",
      body: [
        "Vercel Inc. — bu kartvizitin barındırıldığı (hosting) altyapı sağlayıcısıdır; sunucular yurt dışında (ABD) bulunmaktadır, bu nedenle verileriniz KVKK m.9 kapsamında yurt dışına aktarılabilir.",
        "n8n — planlanan bir otomasyon/iş akışı aracıdır; bu yazının yayınlandığı tarih itibarıyla henüz aktif değildir ve herhangi bir veri aktarımı yapılmamaktadır. Devreye alındığında bu metin güncellenecektir.",
        "Mobil uygulama — bu kartvizitin planlanan bir mobil sürümüdür; henüz yayında değildir. Yayına alındığında aktarım kapsamı bu metinde güncellenecektir.",
      ],
    },
    {
      heading: "6. Saklama Süresi",
      body: [
        "Verileriniz, ilgili talebiniz sonuçlandıktan sonra en fazla 1 (bir) yıl içinde silinir veya anonimleştirilir.",
      ],
    },
    {
      heading: "7. İlgili Kişinin Hakları (KVKK m.11)",
      body: [
        "KVKK'nın 11. maddesi uyarınca; kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme, düzeltme-silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
      ],
    },
    {
      heading: "8. Başvuru ve Silme Talebi",
      body: [
        "Yukarıdaki haklarınızı kullanmak veya verilerinizin silinmesini talep etmek için sercan.balli@veriendustri.com adresine e-posta gönderebilirsiniz.",
      ],
    },
    {
      heading: "Not",
      body: [
        "Bu metin, KVKK m.10 kapsamındaki genel aydınlatma yükümlülüğünü karşılamak amacıyla hazırlanmış bir taslaktır. Yaygın/ticari kullanım öncesinde bir hukuk danışmanı tarafından gözden geçirilmesi önerilir.",
      ],
    },
  ],
};
```

- [ ] **Step 2: `react.html`'e script tag'ini ekle**

`react.html:317-320` şu an:

```html
  <script src="src/data/person.js"></script>
  <script src="src/data/site.js"></script>
  <script src="src/data/webhooks.js"></script>
```

Şu satır eklenir (üç script'in arasına, `card.js`'den önce herhangi bir sıraya — alfabetik tutarlılık için `person.js`'den sonra):

```html
  <script src="src/data/person.js"></script>
  <script src="src/data/privacy.js"></script>
  <script src="src/data/site.js"></script>
  <script src="src/data/webhooks.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add src/data/privacy.js react.html
git commit -m "KVKK Aydınlatma Metni verisini src/data/privacy.js'e ekle"
```

---

### Task 2: `PrivacyPolicyModal` bileşenini ekle ve forma bağla

**Files:**
- Modify: `card.js` (yeni bileşen + `CardActionsForm` değişiklikleri)
- Modify: `react.html` (checkbox/modal CSS kuralları)

**Interfaces:**
- Consumes: `window.BIZCARD_PRIVACY_POLICY` (Task 1).
- Produces: `PrivacyPolicyModal({ open, onClose })` bileşeni — `card.js` içinde başka yerden çağrılmıyor, sadece `CardActionsForm` içinde kullanılıyor.

- [ ] **Step 1: `PrivacyPolicyModal` bileşenini `card.js`'e ekle**

`ContactList` fonksiyonunun hemen altına (satır 86'dan sonra, `CardActionsForm`'dan önce) eklenir:

```jsx
function PrivacyPolicyModal({ open, onClose }) {
  if (!open) return null;

  const policy = window.BIZCARD_PRIVACY_POLICY;

  return (
    <div className="policy-overlay" onClick={onClose}>
      <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="policy-header">
          <div className="policy-title">KVKK Aydınlatma Metni</div>
          <button className="policy-close" type="button" onClick={onClose} aria-label="Kapat">×</button>
        </div>
        <div className="policy-body">
          {policy.sections.map((section) => (
            <div key={section.heading} className="policy-section">
              <h3 className="policy-heading">{section.heading}</h3>
              {section.body.map((paragraph, index) => (
                <p key={index} className="policy-paragraph">{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `CardActionsForm`'a `consent`/`showPolicy` state'lerini ekle**

`card.js` içindeki mevcut state satırları (şu an):

```jsx
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState({ card: false, meeting: false });
```

şu şekilde güncellenir:

```jsx
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState({ card: false, meeting: false });
  const [consent, setConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
```

- [ ] **Step 3: `validateContact()`'a consent kontrolü ekle**

Mevcut:

```jsx
  function validateContact() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Lütfen adınızı girin.";
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    return nextErrors;
  }
```

Yeni hali:

```jsx
  function validateContact() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Lütfen adınızı girin.";
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    if (!consent) {
      nextErrors.consent = "Lütfen KVKK Aydınlatma Metni'ni onaylayın.";
    }
    return nextErrors;
  }
```

Bu fonksiyon hem `handleSaveCard` hem `handleRequestMeeting` tarafından çağrıldığı için değişiklik otomatik olarak iki akışa da uygulanır; bu görevde `handleSaveCard`/`handleRequestMeeting` içeriğinde başka bir değişiklik gerekmez.

- [ ] **Step 4: Checkbox + link JSX'ini form alanları ile buton satırı arasına ekle, modalı forma bağla**

Mevcut (Tarih alanından hemen sonra, buton satırından hemen önce):

```jsx
      <div className="form-field">
        <label className="form-label" htmlFor="visitor-date">Tarih</label>
        <input
          id="visitor-date"
          className={errors.date ? "form-input form-input-error" : "form-input"}
          type="date"
          min={todayISODate()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <div className="form-error">{errors.date}</div>}
      </div>

      <div className="form-buttons">
```

Aralarına şu blok eklenir:

```jsx
      <div className="form-field">
        <label className="form-label" htmlFor="visitor-date">Tarih</label>
        <input
          id="visitor-date"
          className={errors.date ? "form-input form-input-error" : "form-input"}
          type="date"
          min={todayISODate()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <div className="form-error">{errors.date}</div>}
      </div>

      <div className="form-field consent-field">
        <label className="consent-label" htmlFor="visitor-consent">
          <input
            id="visitor-consent"
            className="consent-checkbox"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Kişisel verilerimin ulaşım/toplantı talebimin değerlendirilmesi amacıyla işlenmesini{" "}
            <button
              className="consent-link"
              type="button"
              onClick={() => setShowPolicy(true)}
            >
              KVKK Aydınlatma Metni
            </button>{" "}
            kapsamında kabul ediyorum.
          </span>
        </label>
        {errors.consent && <div className="form-error">{errors.consent}</div>}
      </div>

      <div className="form-buttons">
```

Bileşenin `return (...)` bloğunun kapanışından hemen önce (mevcut son satır `</div>\n  );\n}` — `status` mesajlarının altına) modal render edilir:

```jsx
      {status && status.action === "meeting" && status.state === "success" && (
        <div className="form-status form-status-success">Toplantı talebiniz alındı, teşekkürler!</div>
      )}

      <PrivacyPolicyModal open={showPolicy} onClose={() => setShowPolicy(false)} />
    </div>
  );
}
```

- [ ] **Step 5: `react.html`'e checkbox/modal CSS kurallarını ekle**

`.save-form { text-align: left; }` kuralının hemen altına eklenir:

```css
  .consent-field {
    margin-top: 4px;
  }

  .consent-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
  }

  .consent-checkbox {
    margin-top: 3px;
    flex-shrink: 0;
  }

  .consent-label span {
    font-size: 13px;
    line-height: 1.5;
    color: #33404f;
  }

  .consent-link {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-weight: 600;
    color: #1fb6c9;
    text-decoration: underline;
    cursor: pointer;
  }

  .policy-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13, 27, 52, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .policy-modal {
    width: 100%;
    max-width: 420px;
    max-height: 80vh;
    background: #ffffff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .policy-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: #0d1b34;
  }

  .policy-title {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }

  .policy-close {
    border: none;
    background: none;
    color: #ffffff;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
  }

  .policy-body {
    padding: 20px;
    overflow-y: auto;
  }

  .policy-section {
    margin-bottom: 16px;
  }

  .policy-heading {
    font-size: 13.5px;
    font-weight: 700;
    color: #0d1b34;
    margin-bottom: 6px;
  }

  .policy-paragraph {
    font-size: 13px;
    line-height: 1.5;
    color: #5a6b7a;
    margin-bottom: 6px;
  }
```

- [ ] **Step 6: Yerelde manuel doğrulama**

```bash
python -m http.server 8123
```

`http://localhost:8123/react.html` aç ve doğrula:
1. İsim/e-posta doldur, checkbox'ı **işaretlemeden** "Kartı Kaydet"e tıkla → "Lütfen KVKK Aydınlatma Metni'ni onaylayın." hatası anında görünür, buton "Gönderiliyor..." OLMAZ.
2. "KVKK Aydınlatma Metni" linkine tıkla → modal açılır, 8 bölüm + not görünür, kapatma butonuna veya arka plana tıklayınca kapanır.
3. Checkbox'ı işaretle, isim/e-posta geçerliyken "Kartı Kaydet"e tıkla → önceki davranış gibi "Gönderiliyor..." → başarı mesajı → buton tekrar aktif olur.
4. Aynı akışı "Toplantı Talep Et" için de (geçerli tarih + checkbox işaretli) tekrarla.
5. Tarayıcı konsolunda (F12) hata olmadığını doğrula.

- [ ] **Step 7: Commit**

```bash
git add card.js react.html
git commit -m "Kartvizit formuna KVKK onay kutucuğu ve Aydınlatma Metni modalı ekle"
```

## Self-Review Notes

- **Spec coverage:** Veri dosyası + 8 bölüm + not → Task 1. Checkbox+link+modal UI, consent zorunluluğu, gönderim kilidiyle etkileşim → Task 2. Vercel/n8n/mobil üçüncü taraf notları, saklama süresi (1 yıl), silme talebi e-postası, vCard'ın veri göndermediği notu → Task 1 Step 1 içeriğinde mevcut.
- **Placeholder scan:** Yok — tüm kod blokları tam.
- **Type consistency:** `submitting`, `errors`, `consent`, `showPolicy` state adları Task 2 boyunca tutarlı; `PrivacyPolicyModal` prop isimleri (`open`, `onClose`) tanım ve kullanım yerinde aynı.
