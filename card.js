import React, { useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { QRCodeSVG } from "https://esm.sh/qrcode.react@3.1.0?deps=react@18.2.0";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v16H4z" />
    <path d="m4 6 8 7 8-7" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z" />
  </svg>
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function slugify(text) {
  const turkishMap = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => turkishMap[ch] || ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildVCard(person) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${person.name};;;`,
    `FN:${person.name}`,
    `ORG:${person.company}`,
    `TITLE:${person.title}`,
    `TEL;TYPE=CELL:${person.phone}`,
    `EMAIL:${person.email}`,
    `URL:${person.website}`,
    `ADR;TYPE=WORK:;;${person.location};;;;`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

function ContactList({ items }) {
  return (
    <div className="contact-list">
      {items.map((item) => (
        <a key={item.href} className="contact-item" href={item.href}>
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

function CardActionsForm({ person }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  function validateContact() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Lütfen adınızı girin.";
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    return nextErrors;
  }

  async function handleSaveCard() {
    const nextErrors = validateContact();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setStatus({ action: "card", state: "sending" });
    try {
      const response = await fetch(window.BIZCARD_WEBHOOKS.cardSave, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "card.save",
          cardId: slugify(person.name),
          timestamp: new Date().toISOString(),
          visitor: { name: name.trim(), email: email.trim(), phone: null },
          data: { note: null },
        }),
      });
      if (!response.ok) throw new Error("Webhook isteği başarısız oldu.");
      setStatus({ action: "card", state: "success" });
    } catch (err) {
      setStatus({ action: "card", state: "info" });
    }
  }

  async function handleRequestMeeting() {
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

    setStatus({ action: "meeting", state: "sending" });
    try {
      const response = await fetch(window.BIZCARD_WEBHOOKS.meetingRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "meeting.request",
          cardId: slugify(person.name),
          timestamp: new Date().toISOString(),
          visitor: { name: name.trim(), email: email.trim(), phone: null },
          data: { preferredDate: date, preferredTime: null, message: null },
        }),
      });
      if (!response.ok) throw new Error("Webhook isteği başarısız oldu.");
      setStatus({ action: "meeting", state: "success" });
    } catch (err) {
      setStatus({ action: "meeting", state: "info" });
    }
  }

  const isSending = status && status.state === "sending";

  return (
    <div className="save-form">
      <div className="form-field">
        <label className="form-label" htmlFor="visitor-name">İsim</label>
        <input
          id="visitor-name"
          className={errors.name ? "form-input form-input-error" : "form-input"}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ad Soyad"
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="visitor-email">E-posta</label>
        <input
          id="visitor-email"
          className={errors.email ? "form-input form-input-error" : "form-input"}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@eposta.com"
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

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
        <button className="form-button" type="button" onClick={handleSaveCard} disabled={isSending}>
          {status && status.action === "card" && status.state === "sending" ? "Gönderiliyor..." : "Kartı Kaydet"}
        </button>
        <button className="form-button" type="button" onClick={handleRequestMeeting} disabled={isSending}>
          {status && status.action === "meeting" && status.state === "sending" ? "Gönderiliyor..." : "Toplantı Talep Et"}
        </button>
      </div>

      {status && status.action === "card" && status.state === "success" && (
        <div className="form-status form-status-success">Bilgileriniz kaydedildi, teşekkürler!</div>
      )}
      {status && status.action === "card" && status.state === "info" && (
        <div className="form-status form-status-info">
          Şu an demo ortamındasınız; kayıt gerçek bir sunucuya bağlı olmadığı için iletilemedi.
        </div>
      )}
      {status && status.action === "meeting" && status.state === "success" && (
        <div className="form-status form-status-success">Toplantı talebiniz alındı, teşekkürler!</div>
      )}
      {status && status.action === "meeting" && status.state === "info" && (
        <div className="form-status form-status-info">
          Şu an demo ortamındasınız; talep gerçek bir sunucuya bağlı olmadığı için iletilemedi.
        </div>
      )}
    </div>
  );
}

function QRCodeSection({ person, url }) {
  const vcardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(buildVCard(person))}`;
  const vcardFilename = `${slugify(person.name)}.vcf`;

  return (
    <div className="qr-section">
      <QRCodeSVG value={url} size={132} bgColor="#ffffff" fgColor="#0d1b34" level="M" />
      <div className="qr-caption">Rehbere eklemek için taratın</div>
      <a className="vcard-link" href={vcardHref} download={vcardFilename}>veya vCard indir (.vcf)</a>
    </div>
  );
}

function ProfileCard({ person, siteUrl }) {
  const locationHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.location)}`;

  const contactItems = [
    { href: person.phoneHref, icon: <PhoneIcon />, label: person.phone },
    { href: person.emailHref, icon: <MailIcon />, label: person.email },
    { href: locationHref, icon: <LocationIcon />, label: person.location },
  ];

  return (
    <div className="card">
      <div className="header-bar">
        <div className="company-label">{person.company}</div>
        <div className="name">{person.name}</div>
        <div className="title">{person.title}</div>
      </div>

      <div className="card-body">
        <ContactList items={contactItems} />

        <div className="socials">
          <a className="social-link" href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a className="social-link" href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
        </div>

        <div className="divider"></div>

        <CardActionsForm person={person} />

        <div className="divider"></div>

        <QRCodeSection person={person} url={siteUrl} />
      </div>

      <div className="footer-bar">
        <a href={person.website} target="_blank" rel="noopener noreferrer">www.veriendustri.com</a>
      </div>
    </div>
  );
}

function App() {
  const [person] = useState(window.BIZCARD_PERSON);

  return <ProfileCard person={person} siteUrl={window.BIZCARD_SITE_URL} />;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
