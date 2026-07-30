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

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M6 21V7l6-4 6 4v14" />
    <path d="M10 21v-6h4v6" />
    <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
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

function Avatar({ initials }) {
  return <div className="avatar">{initials}</div>;
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

function ProfileCard({ person }) {
  const contactItems = [
    { href: person.phoneHref, icon: <PhoneIcon />, label: person.phone },
    { href: person.emailHref, icon: <MailIcon />, label: person.email },
    { href: person.companyEmailHref, icon: <BuildingIcon />, label: person.companyLabel },
  ];

  return (
    <div className="card">
      <Avatar initials={person.initials} />
      <div className="name">{person.name}</div>
      <div className="title">{person.title}</div>
      <div className="company">{person.company}</div>

      <div className="divider"></div>

      <ContactList items={contactItems} />

      <div className="socials">
        <a className="social-link" href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedinIcon />
        </a>
        <a className="social-link" href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GithubIcon />
        </a>
      </div>
    </div>
  );
}

function QRCodeBlock({ url }) {
  return (
    <div className="qr-block">
      <QRCodeSVG value={url} size={132} bgColor="#ffffff" fgColor="#1f1b3d" level="M" />
      <div className="qr-caption">Kartviziti taramak için QR kodu okutun</div>
    </div>
  );
}

function App() {
  const [person] = useState(window.BIZCARD_PERSON);

  return (
    <div className="page">
      <ProfileCard person={person} />
      <QRCodeBlock url={window.BIZCARD_SITE_URL} />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
