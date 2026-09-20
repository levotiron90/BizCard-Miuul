# Hafta 6 - Kısa Düşünce (taslak)

> Bu metin, yapılan işe dayanan bir **taslaktır**; kendi cümlelerinizle düzenleyip kullanabilirsiniz.

**1. 6 hafta boyunca AtölyeKart'ı BizCard'a paralel yürütmek anlayışınızı nasıl etkiledi?**

Aynı mimariyi (webhook → doğrulama → Sheet → AI → e-posta, ardından RAG, Redis, MCP ve n8n API) iki farklı projede kurmak, "hangi parça projeye özgü, hangisi genel" ayrımını netleştirdi. İkinci kurulumda ilk projede yaşadığım tuzakları (bellekte tutulan vector store, kopan tünel, ücretsiz model kotaları) baştan bildiğim için daha hızlı ilerledim ve bunları belgelere yazdım. BizCard'da ayrıca ortak doğrulama sub-workflow'u, yedek model ve ziyaretçi bazlı Redis hafızası gibi ilk projede olmayan iyileştirmeleri de ekleyebildim.

**2. Kursun final projesinde hangi kısmın size daha kolay geleceğini düşünüyorsunuz?**

Webhook, doğrulama, Google Sheet'e yazma ve AI ile e-posta üretme gibi akışları kurmak artık en rahat olduğum kısım; bir iş değişikliğini bu parçalara bölüp workflow'a çevirebiliyorum. Daha dikkatli olmam gereken kısım operasyon: tünelin ve ücretsiz model kotalarının kararlılığı, restart sonrası RAG'in yeniden yüklenmesi ve secret yönetimi. Final projesinde bunları baştan planlayıp (kalıcı tünel, ücretli ya da yedekli model) ilerlemeyi hedefliyorum.
