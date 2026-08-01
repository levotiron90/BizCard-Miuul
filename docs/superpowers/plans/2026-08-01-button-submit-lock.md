# Kartı Kaydet / Toplantı Talep Et Gönderim Kilidi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `CardActionsForm` (card.js) içindeki "Kartı Kaydet" ve "Toplantı Talep Et" butonlarını, geçerli bir gönderim işlemdeyken devre dışı bırakarak art arda/çift gönderimi engellemek.

**Architecture:** `CardActionsForm` bileşenine `submitting` adında `{ card: boolean, meeting: boolean }` şeklinde tek bir state eklenir. Doğrulama geçen bir gönderimde ilgili anahtar `true` yapılır, buton `disabled` olur ve metni "Gönderiliyor..." olur; `setTimeout` ile ~600ms sonra `false`'a döner ve mevcut başarı mesajı gösterilir. Doğrulama hataları hiçbir gecikme/kilitleme olmadan anında gösterilmeye devam eder.

**Tech Stack:** React 18 (esm.sh CDN, buildless), Babel standalone (`text/babel` script), tek dosya `card.js`. Proje npm/test framework içermiyor — doğrulama tarayıcıda manuel yapılır.

## Global Constraints

- Tüm React bileşenleri tek dosyada kalır: `card.js` (bizcard-conventions). Yeni dosya oluşturma.
- Demo veriler `card.js` içine hardcode edilmez (bu görevde veri değişikliği yok, sadece davranış).
- Backend/webhook çağrısı eklenmez (`CLAUDE.md`): gecikme tamamen client-side `setTimeout` ile simüle edilir.
- İki buton birbirinden bağımsız kilitlenir; biri "Gönderiliyor..." durumundayken diğeri normal çalışmaya devam eder.
- Başarılı gönderim sonrası buton tekrar aktif hale gelir (kalıcı kilit yok).

---

### Task 1: CardActionsForm'a bağımsız gönderim kilidi ekle

**Files:**
- Modify: `card.js:88-187` (`CardActionsForm` fonksiyonu)

**Interfaces:**
- Consumes: Bileşenin kendi mevcut state'leri (`name`, `email`, `date`, `errors`, `status`) ve `validateContact()` — değişmiyor.
- Produces: Yok (dışa aktarılan bir arayüz değişmiyor, `CardActionsForm` hâlâ `{ person }` prop'u alan bir bileşen).

- [ ] **Step 1: `submitting` state'ini ekle ve `handleSaveCard` / `handleRequestMeeting` içine gecikmeli kilit mantığını yaz**

`card.js` içindeki mevcut `CardActionsForm` fonksiyonunun state tanımları ve iki handler'ı şu şekilde değiştirilir (satır 88-131 aralığının yerini alır):

```jsx
function CardActionsForm({ person }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState({ card: false, meeting: false });

  function validateContact() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Lütfen adınızı girin.";
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    return nextErrors;
  }

  // Butonlar henüz bir webhook'a bağlı değil (n8n entegrasyonu sonraya
  // planlanıyor); şimdilik yalnızca alanları doğrulayıp sonucu gösteriyoruz.
  // Gönderim sırasında ilgili buton kısa süreliğine kilitlenir, böylece
  // art arda tıklanarak birden fazla kez tetiklenmesi engellenir.
  function handleSaveCard() {
    const nextErrors = validateContact();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setSubmitting((prev) => ({ ...prev, card: true }));
    setTimeout(() => {
      setSubmitting((prev) => ({ ...prev, card: false }));
      setStatus({ action: "card", state: "success" });
    }, 600);
  }

  function handleRequestMeeting() {
    const nextErrors = validateContact();
    if (!date) {
      nextErrors.date = "Lütfen bir tarih seçin.";
    } else if (date < todayISODate()) {
      nextErrors.date = "Geçmiş bir tarih seçemezsiniz.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setSubmitting((prev) => ({ ...prev, meeting: true }));
    setTimeout(() => {
      setSubmitting((prev) => ({ ...prev, meeting: false }));
      setStatus({ action: "meeting", state: "success" });
    }, 600);
  }
```

**Neden `setSubmitting((prev) => ...)` fonksiyonel güncelleme kullanılıyor:** iki buton bağımsız çalıştığı için, biri state günceller güncellerken diğerinin state'ini ezmemesi gerekir (stale closure riskini önler).

- [ ] **Step 2: Buton JSX'ini `disabled` ve dinamik etiketle güncelle**

Mevcut (satır 174-177 civarı):

```jsx
      <div className="form-buttons">
        <button className="form-button" type="button" onClick={handleSaveCard}>Kartı Kaydet</button>
        <button className="form-button" type="button" onClick={handleRequestMeeting}>Toplantı Talep Et</button>
      </div>
```

Yeni hali:

```jsx
      <div className="form-buttons">
        <button
          className="form-button"
          type="button"
          onClick={handleSaveCard}
          disabled={submitting.card}
        >
          {submitting.card ? "Gönderiliyor..." : "Kartı Kaydet"}
        </button>
        <button
          className="form-button"
          type="button"
          onClick={handleRequestMeeting}
          disabled={submitting.meeting}
        >
          {submitting.meeting ? "Gönderiliyor..." : "Toplantı Talep Et"}
        </button>
      </div>
```

`.form-button:disabled` stili zaten `react.html`'de tanımlı (`opacity: 0.6; cursor: not-allowed;`), ekstra CSS gerekmiyor.

- [ ] **Step 3: Yerelde manuel doğrulama**

Bu projede otomatik test altyapısı yok (buildless CDN React, `CLAUDE.md`: npm/derleme yok). Doğrulama tarayıcıda yapılır:

```bash
python -m http.server 8000
```

Tarayıcıda `http://localhost:8000/react.html` aç ve şunları doğrula:
1. İsim/e-posta boşken "Kartı Kaydet"e tıkla → hata anında görünür, buton disabled OLMAZ, metin değişmez.
2. Geçerli isim + e-posta gir, "Kartı Kaydet"e tıkla → buton anında "Gönderiliyor..." olur ve disabled görünür (gri, tıklanamaz); ~600ms sonra "Kart kaydedildi, teşekkürler!" mesajı çıkar ve buton "Kartı Kaydet" metnine dönüp tekrar tıklanabilir olur.
3. Adım 2'yi tekrarlarken "Gönderiliyor..." durumundayken aynı butona hızlıca birkaç kez tıkla → disabled olduğu için hiçbir ek istek/animasyon tetiklenmez (art arda gönderim engellendiğini doğrular).
4. Geçerli isim/e-posta + gelecekteki bir tarih gir, "Toplantı Talep Et"e tıkla → sadece o buton "Gönderiliyor..." olur, "Kartı Kaydet" butonu bu sırada hâlâ normal/tıklanabilir kalır (bağımsız kilitlemeyi doğrular).
5. Tarayıcı konsolunda (F12) React/Babel hatası olmadığını doğrula.

- [ ] **Step 4: Commit**

```bash
git add card.js
git commit -m "Kartı Kaydet ve Toplantı Talep Et butonlarını gönderim sırasında kilitle"
```

## Self-Review Notes

- **Spec coverage:** Bağımsız kilitleme (spec §Davranış 2) → Step 1/2. Doğrulama hatalarının anında/gecikmesiz kalması (spec §Davranış 1) → Step 1 (early return `validateContact` sonrası, `submitting` hiç dokunulmuyor). Başarı sonrası tekrar aktif olma (spec §Davranış 2) → `setTimeout` içinde `submitting: false`. Art arda tıklamayı engelleme (spec §Davranış 3) → `disabled={submitting.card|meeting}`.
- **Placeholder scan:** Yok — tüm kod blokları tam ve çalıştırılabilir.
- **Type consistency:** `submitting` state'i tek yerde tanımlanıp (`{ card: false, meeting: false }`) her iki handler ve JSX'te aynı anahtarlarla (`card`, `meeting`) kullanılıyor.
