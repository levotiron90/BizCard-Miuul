// RAG kaynak dokümanlarını (PDF) üretir: node docs/rag/build-pdfs.js
// HTML -> PDF dönüşümü için Microsoft Edge (headless) kullanılır; Türkçe karakterler sorunsuz çıkar.
// Tüm içerik demo (örnek) veridir, gerçek bir kişi/kurum bilgisi değildir.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = __dirname;

const CSS = `
  body { font-family: Arial, sans-serif; color: #0d1b34; font-size: 12pt; line-height: 1.5; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4px; color: #0d1b34; }
  .sub { color: #1fb6c9; font-weight: bold; margin-bottom: 18px; }
  h2 { font-size: 14pt; margin: 20px 0 6px; border-bottom: 2px solid #1fb6c9; padding-bottom: 3px; }
  p { margin: 6px 0; }
  li { margin: 3px 0; }
`;

const page = (title, sub, body) => `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>
<h1>${title}</h1><div class="sub">${sub}</div>${body}</body></html>`;

const profil = page(
  "BizCard - Profil, Hizmetler ve Kullanım Rehberi",
  "Sercan BALLI | Industrial Digitalization &amp; Analytics Engineer | Veri Endüstri Mühendislik A.Ş.",
  `
<h2>1. Sercan BALLI Kimdir?</h2>
<p>Sercan BALLI, Veri Endüstri Mühendislik A.Ş. bünyesinde çalışan bir Industrial Digitalization &amp; Analytics Engineer'dır. Üretim tesislerinin verilerini toplamaya, anlamlı hale getirmeye ve karar vermeyi kolaylaştıran raporlara dönüştürmeye odaklanır. İstanbul merkezlidir; Türkiye genelinde çalışır.</p>

<h2>2. Uzmanlık Alanları</h2>
<ul>
  <li>Üretim verimliliği analitiği: OEE (Toplam Ekipman Verimliliği), duruş ve fire analizi.</li>
  <li>Sanayi verisi entegrasyonu: PLC, SCADA ve ERP sistemlerinden veri toplama ve birleştirme.</li>
  <li>Yönetim panoları: canlı üretim panoları ve haftalık/aylık performans raporları.</li>
  <li>Dijital dönüşüm danışmanlığı: yol haritası hazırlama, öncelik belirleme, pilot proje tasarımı.</li>
</ul>

<h2>3. Sunulan Hizmetler</h2>
<p><b>Üretim Verimliliği Analizi:</b> Mevcut üretim verisinin incelenmesi, kayıp kalemlerinin belirlenmesi ve iyileştirme önerilerinin sunulması. Tipik süre 2-4 haftadır.</p>
<p><b>Veri Altyapısı ve Entegrasyon:</b> Farklı makinelerden ve yazılımlardan gelen verilerin tek bir yapıda toplanması. Kapsama göre 4-8 hafta sürer.</p>
<p><b>Pano ve Raporlama Geliştirme:</b> Yöneticilerin ve vardiya amirlerinin kullanacağı sade panoların hazırlanması. Tipik süre 2-3 haftadır.</p>
<p><b>Dijital Dönüşüm Danışmanlığı ve Eğitim:</b> Ekipler için atölye çalışmaları ve yönetim düzeyinde yol haritası oturumları. Bir oturum yarım gün sürer.</p>
<p>Her hizmet için fiyat, kapsama ve süreye göre teklif halinde paylaşılır; sabit bir fiyat listesi yoktur. Teklif almak için önce bir tanışma toplantısı talep edilmesi önerilir.</p>

<h2>4. Çalışma Şekli</h2>
<ol>
  <li>Tanışma toplantısı: ihtiyaç ve mevcut durum konuşulur.</li>
  <li>Kapsam ve teklif: yazılı bir çalışma planı paylaşılır.</li>
  <li>Uygulama: haftalık ilerleme bilgilendirmeleriyle yürütülür.</li>
  <li>Teslim ve devir: dokümantasyon ve kısa bir kullanım eğitimi verilir.</li>
</ol>

<h2>5. Dijital Kartvizit Nasıl Kullanılır?</h2>
<p><b>Kartı Kaydet:</b> Ad ve e-posta bilgisini girip "Kartı Kaydet" düğmesine basan ziyaretçi, Sercan'ın kartvizitini kaydetmiş ve kendi iletişim bilgisini paylaşmış olur. Kısa süre içinde bir teşekkür e-postası alır.</p>
<p><b>Toplantı Talep Et:</b> Ziyaretçi bir tarih ve saat seçip "Toplantı Talep Et" düğmesine basar. Seçilen saat uygunsa talebin alındığı bildirilir; uygun değilse bir alternatif saat önerilir. Toplantı ancak Sercan'ın kesin dönüşüyle onaylanmış sayılır.</p>
<p><b>Telefonuma Ekle:</b> Bu düğme kartvizit bilgilerini bir vCard (.vcf) dosyası olarak indirir ve telefon rehberine eklemeyi sağlar.</p>
<p><b>QR Kod:</b> Kartvizitteki QR kod telefonla okutulduğunda dijital kartvizit sayfası açılır. Kartvizit web sitesinde ve mobil uygulamada aynı bilgileri gösterir.</p>
<p>Ad ve e-posta bilgisi paylaşmadan önce KVKK Aydınlatma Metni'nin onaylanması gerekir.</p>
`
);

const toplanti = (v) => page(
  "BizCard - Toplantı ve İletişim Politikası",
  `Sercan BALLI | Doküman versiyonu: ${v.no} | Yürürlük: ${v.tarih}`,
  `
<h2>1. Toplantı Talebi Nasıl İşler?</h2>
<p>Dijital kartvizit üzerinden gönderilen her toplantı talebi kaydedilir ve Sercan BALLI'ya iletilir. Talep sahibine otomatik bir bilgilendirme e-postası gider. Bu e-posta toplantının onaylandığı anlamına gelmez; kesin onay Sercan'ın kişisel dönüşüyle verilir.</p>

<h2>2. Yanıt Süresi</h2>
<p>Toplantı talebine ve kartvizit kaydına en geç 1 iş günü içinde dönüş yapılır. Hafta sonu ve resmi tatillerde gelen talepler, izleyen ilk iş günü yanıtlanır.</p>

<h2>3. Müsait Toplantı Saatleri</h2>
<p>Toplantılar hafta içi günlerde, saat 10:00, 11:00, 13:00, 14:00, 15:00 ve 16:00 başlangıç saatlerinden biriyle planlanır. Cumartesi ve pazar günleri toplantı yapılmaz.</p>
<p>Çarşamba günleri sabah saatleri (10:00 ve 11:00) ve Cuma günleri öğleden sonra saatleri (15:00 ve 16:00) doludur. Seçilen saat doluysa sistem aynı güne ait en yakın müsait saati, o gün müsait saat yoksa sonraki en yakın müsait günü önerir.</p>
<p>Aynı gün için toplantı talep edilemez; talepler en erken ertesi iş günü için planlanır.</p>

<h2>4. Toplantı Süresi ve Şekli</h2>
<p>${v.sure}</p>
<p>Toplantılar çevrim içi yapılır; toplantı bağlantısı kesin onay e-postasıyla paylaşılır. İstanbul'da yüz yüze görüşme, ancak çevrim içi tanışma toplantısından sonra ve karşılıklı uygunlukla planlanabilir.</p>

<h2>5. İptal ve Erteleme</h2>
<p>Toplantı saatinden en az 4 saat önce e-posta ile haber verilmesi kaydıyla toplantı ücretsiz olarak iptal edilebilir veya ertelenebilir.</p>

<h2>6. Kişisel Verilerin Korunması (KVKK)</h2>
<p>Ad, e-posta ve toplantı tercihleri yalnızca talebin değerlendirilmesi ve size dönüş yapılması amacıyla işlenir; üçüncü kişilerle paylaşılmaz. Bilgilerin silinmesini istemek için sercan.balli@veriendustri.com adresine yazılabilir.</p>
`
);

const kurumsal = page(
  "Veri Endüstri Mühendislik A.Ş. - Kurumsal Tanıtım ve Bilgi Rehberi",
  "Örnek (demo) doküman: BizCard kurs projesi için hazırlanmıştır, gerçek şirket bilgilerini yansıtmaz.",
  `
<h2>1. Şirket Hakkında</h2>
<p>Veri Endüstri Mühendislik A.Ş., sanayi işletmelerinin üretim verisini toplayıp anlamlı hale getirmesine yardımcı olan bir endüstriyel dijitalleşme ve veri analitiği şirketidir. Merkezi İstanbul'dadır ve Türkiye genelinde hizmet verir. Şirket 2018 yılında kurulmuştur ve yaklaşık 35 kişilik bir mühendis ve analist ekibiyle çalışır.</p>

<h2>2. Misyon ve Vizyon</h2>
<p><b>Misyon:</b> Üretim tesislerinin verisini sade, güvenilir ve karar vermeyi kolaylaştıran bir yapıya dönüştürmek.</p>
<p><b>Vizyon:</b> Türkiye'deki her ölçekten üretim işletmesinin veriyle yönetilen bir fabrikaya geçişinde ilk akla gelen mühendislik ortağı olmak.</p>

<h2>3. Faaliyet Alanları</h2>
<ul>
  <li>Endüstriyel veri toplama: PLC, SCADA, sensör ve ERP sistemlerinden veri toplanması.</li>
  <li>Üretim analitiği: OEE (Toplam Ekipman Verimliliği), duruş, fire ve verim analizleri.</li>
  <li>Enerji izleme: makine ve hat bazında enerji tüketiminin izlenmesi.</li>
  <li>Kalite analitiği: hata eğilimlerinin ve kök nedenlerin veriden çıkarılması.</li>
  <li>Bakım analitiği: arıza kayıtlarından öngörülü bakım planlarının hazırlanması.</li>
</ul>

<h2>4. Hizmet Verilen Sektörler</h2>
<p>Otomotiv yan sanayi, gıda ve içecek, tekstil, plastik ve kauçuk, makine imalatı ve metal işleme sektörlerindeki üretim işletmelerine hizmet verilir.</p>

<h2>5. Çözüm Paketleri</h2>
<p><b>Veri Görünürlüğü Paketi:</b> Makinelerden veri toplanır ve temel üretim panoları kurulur. Tipik süre 4 hafta.</p>
<p><b>Verimlilik Paketi:</b> Veri Görünürlüğü Paketi'ne ek olarak OEE, duruş ve fire analizleri ile iyileştirme önerileri sunulur. Tipik süre 8 hafta.</p>
<p><b>Dijital Fabrika Yol Haritası:</b> Mevcut durum incelenir, öncelikli yatırımlar sıralanır ve yazılı bir yol haritası hazırlanır. Tipik süre 3 hafta.</p>
<p>Paketlerin fiyatı sabit değildir; tesisin büyüklüğüne, makine sayısına ve kapsama göre teklif hazırlanır.</p>

<h2>6. Çalışma Yöntemi</h2>
<ol>
  <li>Keşif: mevcut sistemler, veri kaynakları ve hedefler birlikte belirlenir.</li>
  <li>Pilot: tek bir hat veya bölümde küçük bir uygulama yapılır.</li>
  <li>Yaygınlaştırma: pilot başarılıysa diğer hatlara ve tesislere genişletilir.</li>
  <li>Destek: devreye alma sonrası eğitim ve uzaktan destek verilir.</li>
</ol>
<p>Proje süresince haftalık ilerleme toplantısı yapılır. Destek taleplerine en geç 1 iş günü içinde dönüş yapılır.</p>

<h2>7. Teknoloji ve Entegrasyon</h2>
<p>Veri toplamada OPC UA ve MQTT protokolleri kullanılır. Veriler müşterinin isteğine göre kendi sunucusunda (yerinde) ya da bulutta saklanır. Raporlama için Power BI, Python ve SQL tabanlı çözümler kullanılır; PostgreSQL ve SQL Server veritabanlarıyla çalışılır.</p>

<h2>8. Örnek Çalışmalar (Demo)</h2>
<p><b>Otomotiv yan sanayi:</b> Üç presleme hattının duruş verisi tek panoda birleştirildi; en sık duruş nedenleri görünür hale geldi.</p>
<p><b>Gıda ve içecek:</b> Dolum hatlarında vardiya bazlı verim raporu hazırlandı ve haftalık toplantılarda kullanılmaya başlandı.</p>
<p><b>Plastik enjeksiyon:</b> Makine bazlı enerji tüketimi izlendi ve boşta çalışma saatleri raporlandı.</p>

<h2>9. Veri Güvenliği ve Gizlilik</h2>
<p>Her projede gizlilik sözleşmesi imzalanır. Üretim verisinin sahibi her zaman müşteridir; veri, müşterinin yazılı izni olmadan üçüncü kişilerle paylaşılmaz. Kişisel veriler KVKK'ya uygun işlenir.</p>

<h2>10. Kariyer ve Staj</h2>
<p>Şirket; endüstri, elektrik-elektronik, bilgisayar ve yazılım mühendisliği öğrencilerinden yaz stajı için başvuru kabul eder. Başvurular özgeçmişle birlikte info@veriendustri.com adresine gönderilir.</p>

<h2>11. İletişim</h2>
<p>Adres: İstanbul, Türkiye. Web sitesi: https://www.veriendustri.com/. Telefon: +90 500 123 45 67. Çalışma saatleri hafta içi 09:00-18:00'dir. Sercan BALLI ile görüşmek için dijital kartvizit üzerindeki "Toplantı Talep Et" düğmesi kullanılabilir.</p>

<h2>12. Sık Sorulan Sorular</h2>
<p><b>Fiyat listesi var mı?</b> Hayır. Teklif, tesisin büyüklüğüne ve kapsama göre hazırlanır.</p>
<p><b>Bir pilot çalışma ne kadar sürer?</b> Tipik bir pilot 4 ila 6 hafta sürer.</p>
<p><b>Uzaktan destek veriyor musunuz?</b> Evet, devreye alma sonrası uzaktan destek verilir.</p>
<p><b>Verilerimiz nerede saklanır?</b> Müşterinin tercihine göre kendi sunucusunda veya bulutta saklanır.</p>
<p><b>Sadece büyük fabrikalar mı çalışabilir?</b> Hayır, küçük ve orta ölçekli üretim işletmeleriyle de çalışılır.</p>
`
);

const docs = {
  "bizcard_veri_endustri_kurumsal_rehber.pdf": kurumsal,
  "bizcard_profil_hizmetler_rehberi.pdf": profil,
  "bizcard_toplanti_iletisim_politikasi_v1.pdf": toplanti({ no: "v1", tarih: "1 Eylül 2026", sure: "Toplantılar 30 dakika sürer." }),
  "bizcard_toplanti_iletisim_politikasi_v2.pdf": toplanti({ no: "v2", tarih: "20 Eylül 2026", sure: "Toplantılar 45 dakika sürer. (v1'de bu süre 30 dakikaydı.)" }),
};

for (const [name, html] of Object.entries(docs)) {
  const htmlPath = path.join(OUT, name.replace(".pdf", ".html"));
  fs.writeFileSync(htmlPath, html);
  execFileSync(EDGE, ["--headless", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${path.join(OUT, name)}`, "file:///" + htmlPath.replace(/\\/g, "/")], { stdio: "ignore" });
  fs.unlinkSync(htmlPath);
  console.log("üretildi:", name);
}
