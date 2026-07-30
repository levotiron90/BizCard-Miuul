---
name: bizcard-conventions
description: Use when creating, editing, or reviewing BizCard components (Avatar, ContactList, ProfileCard, or any new button/form like Save Card or Request Meeting) or wiring a webhook call in the BizCard project — covers required file layout and the webhook JSON payload contract.
---

# BizCard Conventions

## Overview

BizCard is a buildless, CDN-React digital business card (see `CLAUDE.md`: no npm install, no backend, demo data only, code simple enough for a non-programmer to read). This skill fixes the two things that drift without a written rule: where component code and demo data physically live, and what shape webhook payloads take.

## When to Use

- Adding, splitting, or editing a React component in this project
- Adding a new interactive feature that calls a webhook (e.g. "Kartı Kaydet", "Toplantı Talep Et")
- Reviewing a change to `react.html`, `card.js`, or `src/data/*`

## Component Rules

| Rule | Detail |
|---|---|
| Single file | All React components live together in one file: `card.js`. Do not split components into `Avatar.js`, `ContactList.js`, etc. — this project has no bundler, so every extra file is an extra `<script>` tag to keep in sync by hand. |
| Function components only | No class components, ever — matches existing `Avatar`/`ContactList`/`ProfileCard` code and `CLAUDE.md`'s "keep it simple" rule. |
| Demo data lives in `src/data/` | Sample values (person info, webhook URLs, placeholder text) never get hardcoded inside `card.js`. They live in `src/data/` as plain scripts that set a `window.BIZCARD_*` global, loaded before `card.js`. |
| `card.js` only reads data, never defines it | Components pull their data from the `window.BIZCARD_*` globals (or props passed down from them), so a non-programmer can update the demo card by editing one small file in `src/data/` without touching component logic. |

**File layout:**

```
BizCard/
  index.html            # static HTML/CSS twin (no React)
  react.html            # loads the two scripts below
  card.js               # ALL components: Avatar, ContactList, ProfileCard, ...
  src/
    data/
      person.js          # window.BIZCARD_PERSON = {...}
      webhooks.js         # window.BIZCARD_WEBHOOKS = {...}
```

`react.html` loads them in order, after the React/Babel CDN scripts:
```html
<script src="src/data/person.js"></script>
<script src="src/data/webhooks.js"></script>
<script type="text/babel" src="card.js"></script>
```

`src/data/person.js` example:
```js
window.BIZCARD_PERSON = {
  initials: "SB",
  name: "Sercan BALLI",
  title: "Industrial Digitalization & Analytics Engineer",
  company: "Veri Endüstri Mühendislik A.Ş.",
  email: "sercan.balli@example.com",
};
```

`card.js` then reads it: `const person = window.BIZCARD_PERSON;` — never `const person = { name: "Sercan BALLI", ... }` typed directly into `card.js`.

## Webhook Data Contract

Two events exist today: **`card.save`** (visitor saves/requests the owner's contact info) and **`meeting.request`** (visitor asks for a meeting). Both use the same envelope so one handler can dispatch on `event`.

```json
{
  "event": "card.save",
  "cardId": "sercan-balli",
  "timestamp": "2026-07-30T12:00:00Z",
  "visitor": {
    "name": "Örnek Ziyaretçi",
    "email": "ornek.ziyaretci@example.com",
    "phone": null
  },
  "data": {
    "note": null
  }
}
```

```json
{
  "event": "meeting.request",
  "cardId": "sercan-balli",
  "timestamp": "2026-07-30T12:00:00Z",
  "visitor": {
    "name": "Örnek Ziyaretçi",
    "email": "ornek.ziyaretci@example.com",
    "phone": null
  },
  "data": {
    "preferredDate": "2026-08-05",
    "preferredTime": "14:00",
    "message": "Ürün demosu hakkında konuşmak istiyorum."
  }
}
```

Rules:
- `event` is always `"card.save"` or `"meeting.request"` — no other event names, no free-form strings.
- `cardId` is the owner's slug (kebab-case of their name), constant per deployment — read it from `window.BIZCARD_PERSON`, never hardcode it in a component.
- `visitor` always has all three keys (`name`, `email`, `phone`); use `null` for fields the form didn't collect, never omit the key.
- Event-specific fields go under `data`, never at the top level — keeps the envelope identical across events.
- `timestamp` is ISO 8601 UTC, generated client-side with `new Date().toISOString()`.
- The webhook URL for each event comes from `window.BIZCARD_WEBHOOKS.cardSave` / `.meetingRequest` (defined in `src/data/webhooks.js`), never inlined at the fetch call site.

## Common Mistakes

| Mistake | Fix |
|---|---|
| New component added as its own `.js` file | Put it in `card.js` alongside the others |
| Demo person/webhook values typed directly into `card.js` | Move them to `src/data/person.js` or `src/data/webhooks.js` |
| Webhook payload built ad hoc per feature (different key names, flat structure) | Use the shared envelope above; only `data` changes between events |
| `visitor.phone` key left out when empty | Keep the key, set it to `null` |
