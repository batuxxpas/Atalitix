-- =====================================================================
-- Atalitix — Haber modülü: detay sayfası alanları + admin izinleri
-- SQL Editor'e tamamını yapıştırıp Run. Tekrar çalıştırmak güvenlidir.
-- =====================================================================

-- 1) Admin paneli (sunucu, service_role) yeni tablolara erişsin
grant all on public.haberler, public.cozum_alt_basliklari to service_role;

-- 2) Detay sayfası alanları
alter table public.haberler add column if not exists slug   text;
alter table public.haberler add column if not exists icerik text;

-- 3) Mevcut haberlere adres (slug) üret — Türkçe karakterler sadeleştirilir
update public.haberler
set slug = trim(both '-' from regexp_replace(
  lower(translate(baslik, 'çğıöşüâîûÇĞİIÖŞÜÂÎÛ', 'cgiosuaiucgiiosuaiu')),
  '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- Aynı adres iki kez çıkarsa sonuna kısa id ekle
update public.haberler h
set slug = h.slug || '-' || left(h.id::text, 6)
where exists (select 1 from public.haberler o where o.slug = h.slug and o.id < h.id);

create unique index if not exists haberler_slug_key on public.haberler (slug);

-- 4) Örnek haberlerin tam metinleri (boşsa doldurur)
--    Biçim: boş satır = yeni paragraf · "## " = ara başlık · "- " = madde
update public.haberler set icerik = $t$Atalitix'in yeni web sitesi yayında. Sitenin merkezinde markamızın yaklaşımını özetleyen cümle var: Veriden zekâya, süreçten değere.

## Sitede neler var?
- Üç çözüm alanımız: süreç analizi ve hedef süreç tasarımı, dijital ve AI olgunluk değerlendirmesi, dijital eğitim ve kullanıcı adaptasyonu.
- ERP kapsamı ve kavramsal tasarım çalışmalarımızın nasıl ilerlediği; Odoo, SAP, Logo, Canias gibi alternatiflerin hangi ölçütlerle değerlendirildiği.
- Projelere nasıl başladığımızı anlatan dört adımlı çalışma modeli.

Haberler bölümünde etkinliklerimizi, projelerimizden notları ve ERP, veri ve dijital dönüşüm gündemine dair değerlendirmelerimizi paylaşacağız.

Sorularınız ve görüşme talepleriniz için iletişim formunu kullanabilirsiniz.$t$
where baslik = 'Yeni web sitemiz yayında' and (icerik is null or icerik = '');

update public.haberler set icerik = $t$Atalitix'in çalışma modelini ve çıktı paketlerini anlatan 2026 tanıtım sunumu hazır.

Sunumda dönüşüm projelerinde sık karşılaşılan beş temel sorunu ele alıyoruz: dağınık süreçler, ERP kapsam belirsizliği, manuel ve rutin işler, veriye dayalı karar eksikliği ve yapay zekâ kullanım belirsizliği.

## Çıktı paketleri
- Süreç mimarisi: süreç envanteri, hedef akış, rol/yetki ve kontrol noktaları
- ERP çözüm kapsamı: modül kapsamı, kavramsal tasarım, entegrasyon ve proje planı
- Olgunluk ve öncelik haritası: güçlü yönler, gelişim boşlukları ve hızlı kazanımlar
- Fırsat backlog'u: KPI/dashboard, veri modeli ve otomasyon adayları
- Adaptasyon planı: eğitim başlıkları, atölye kurgusu ve yaygınlaştırma planı

Sunumu talep etmek için iletişim formundan bize ulaşabilirsiniz.$t$
where baslik = '2026 tanıtım sunumumuz hazır' and (icerik is null or icerik = '');

update public.haberler set icerik = $t$Ekibimiz Odoo sertifikasyonunu tamamladı.

Atalitix olarak ERP kararını ürün listesinden değil, süreç mimarisinden başlatıyoruz. Odoo; süreç uyumu, bütçe, entegrasyon ihtiyacı, kullanıcı profili ve ölçeklenebilirlik açısından değerlendirdiğimiz ERP alternatiflerinden biri.

Kapsam çalışması Odoo'yu işaret ettiğinde; kurulum, uyarlama, veri aktarımı, kullanıcı eğitimi ve canlıya geçiş adımlarını sertifikalı ekibimizle yürütüyoruz.

## Uyguladığımız başlıca Odoo uygulamaları
- Muhasebe ve finans
- Satış, CRM ve satınalma
- Envanter, depo ve üretim (MRP)
- Kalite, bakım, proje ve insan kaynakları$t$
where baslik = 'Odoo sertifikalı danışmanlık' and (icerik is null or icerik = '');

update public.haberler set icerik = $t$ERP projelerinde başarıyı belirleyen faktör giderek daha az ürün özelliği, daha çok süreç uyumu oluyor.

Modül listeleriyle başlayan seçim süreçleri, çoğu zaman canlıya geçiş sonrasında yoğun uyarlama ihtiyacı ve kullanıcı direnciyle sonuçlanıyor. Kapsamı süreç haritasından başlatan projelerde ise hangi işin ERP içinde standartlaşacağı, hangisinin ERP dışında daha esnek bir katmanda çözüleceği en baştan netleşiyor.

## Seçimde öne çıkan sorular
- Kritik süreçlerimiz standart işleyişe ne kadar uyuyor?
- Hangi sistemlerle entegrasyon zorunlu?
- Kullanıcı profilimiz ve değişim hazırlığımız nasıl?
- Önümüzdeki yıllarda ölçek ve yapı nasıl değişecek?

Bu soruların cevabı, doğru ERP yolunu ürün tercihinden daha belirleyici hale getiriyor.$t$
where baslik = 'ERP seçiminde odak süreç uyumuna kayıyor' and (icerik is null or icerik = '');

update public.haberler set icerik = $t$Yönetim kokpiti projelerinde en sık karşılaşılan sorun teknoloji değil, tanım.

Aynı gösterge, örneğin zamanında teslim oranı veya stok devir hızı, farklı departmanlarda farklı veri kaynakları ve formüllerle hesaplandığında dashboard ekranları karar desteğinden çok tartışma konusu oluyor.

## Ortak KPI sözlüğü neleri içerir?
- Göstergenin tanımı ve formülü
- Veri kaynağı ve güncelleme sıklığı
- Sorumlusu ve hedef değeri
- Bağlı aksiyonlar ve takip döngüsü

KPI sözlüğüyle başlayan raporlama projeleri; veri kaynakları, dashboard ve aksiyon takibi katmanlarını aynı dil üzerinde birleştirerek karar hızını artırıyor.$t$
where baslik = 'Ortak KPI sözlüğü olmadan yönetim kokpiti olmaz' and (icerik is null or icerik = '');

update public.haberler set icerik = $t$Kurumlarda yapay zekâ gündemi, tek tek denemelerden yönetilebilir bir portföye doğru ilerliyor.

Fikir havuzu genellikle geniş; asıl zorluk, iş değeri yüksek ve veri hazırlığı yeterli kullanım senaryolarını seçmek. Değer filtresinde hacim, tekrar sıklığı, hata riski, veri erişimi ve standartlaşma düzeyi belirleyici oluyor.

## Pilottan kalıcı kullanıma
- Kullanım senaryosu seçimi ve önceliklendirme
- Sınırlı kapsamlı pilot ve başarı ölçütleri
- Kullanıcı kabulü ve eğitim
- KVKK, insan onayı ve risk kontrolünü kapsayan yönetişim kuralları

Süreç olgunluğu ile birlikte ele alınan yapay zekâ girişimleri, rapor olarak kalmak yerine uygulanabilir bir proje portföyüne dönüşüyor.$t$
where baslik = 'Kurumsal yapay zekâda pilottan yönetişime' and (icerik is null or icerik = '');

-- 5) Kontrol
select baslik, slug, length(icerik) as metin_uzunlugu from public.haberler order by tarih desc;
