export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function slugify(text) {
  const turkishMap = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => turkishMap[ch] || ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildVCard(person) {
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
