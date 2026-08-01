# BizCard

Sercan BALLI için hazırlanmış, tek sayfalık dijital kartvizit projesi. Şu an basit bir web sayfası; ileride React tabanlı bir web/mobil uygulamaya dönüşecek.

**Canlı adres:** https://biz-card-miuul.vercel.app/ (Vercel, `ders2` dalındaki her push ile otomatik güncellenir)

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `index.html` | Sade HTML/CSS kartvizit. Çift tıklayarak doğrudan tarayıcıda açılabilir. Vercel'de `/demo` yolunda yayında. |
| `react.html` | Aynı kartvizitin React (CDN üzerinden, kurulum gerektirmeyen) versiyonu. `Avatar`, `ContactList`, `ProfileCard` bileşenlerine bölünmüştür. Vercel'de ana adreste (`/`) yayında. |
| `vercel.json` | `/` adresini `react.html`'e, `/demo` adresini `index.html`'e yönlendiren Vercel rewrite kuralları. |
| `CLAUDE.md` | Projenin kapsamı, tonu ve kısıtları. |
| `.claude/skills/bizcard-conventions/` | Bileşen dosya düzeni ve webhook JSON sözleşmesi kuralları. |

## Nasıl görüntülenir?

**index.html** — doğrudan çift tıklayıp tarayıcıda açabilirsiniz.

**react.html** — React/Babel CDN scriptleri `file://` üzerinden güvenlik kısıtlamalarına takıldığı için bir yerel sunucu üzerinden açılması gerekir:

```bash
python -m http.server 8000
```

sonra tarayıcıda `http://localhost:8000/react.html` adresini açın. VS Code kullanıyorsanız **Live Server** eklentisiyle de açabilirsiniz.

## Kısıtlar

- Şu aşamada backend/veritabanı yok.
- Kullanılan iletişim bilgileri gerçek değil, örnek (demo) veridir.
- Kurulum/derleme adımı yoktur (npm gerekmez); React versiyonu CDN scriptleriyle çalışır.
