-- Atalitix Supabase Recovery Script
-- Bu scripti kopyalayıp Supabase SQL Editörüne yapıştırıp çalıştırabilirsiniz.

-- DİKKAT: Bu satırlar mevcut tabloları ve içindeki TÜM KALINTI VERİLERİ SİLER!
DROP TABLE IF EXISTS public.iletisim_talepleri CASCADE;
DROP TABLE IF EXISTS public.ana_sayfa_icerik CASCADE;
DROP TABLE IF EXISTS public.isletim_haritasi_adimlari CASCADE;
DROP TABLE IF EXISTS public.isletim_haritasi_kategorileri CASCADE;
DROP TABLE IF EXISTS public.teknoloji_etiketleri CASCADE;
DROP TABLE IF EXISTS public.cozumler CASCADE;
DROP TABLE IF EXISTS public.yaklasim_adimlari CASCADE;
DROP TABLE IF EXISTS public.deneyim_maddeleri CASCADE;

-- 1. İletişim Talepleri
CREATE TABLE IF NOT EXISTS public.iletisim_talepleri (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Ana Sayfa İçerik
CREATE TABLE IF NOT EXISTS public.ana_sayfa_icerik (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_text TEXT,
    title_line1 TEXT,
    title_line2 TEXT,
    title_highlight TEXT,
    title_line3 TEXT,
    title_line4 TEXT,
    description TEXT,
    description2 TEXT,
    tagline TEXT,
    tagline_sub TEXT,
    cta_primary_text TEXT,
    cta_secondary_text TEXT,
    map_title TEXT,
    map_badge TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 3. İşletim Haritası Adımları
CREATE TABLE IF NOT EXISTS public.isletim_haritasi_adimlari (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);

-- 4. İşletim Haritası Kategorileri
CREATE TABLE IF NOT EXISTS public.isletim_haritasi_kategorileri (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_tag TEXT,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);

-- 5. Teknoloji Etiketleri
CREATE TABLE IF NOT EXISTS public.teknoloji_etiketleri (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);

-- 6. Çözümler
CREATE TABLE IF NOT EXISTS public.cozumler (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_label TEXT,
    title TEXT,
    description TEXT,
    icon_name TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);

-- 7. Yaklaşım Adımları
CREATE TABLE IF NOT EXISTS public.yaklasim_adimlari (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);

-- 8. Deneyim Maddeleri
CREATE TABLE IF NOT EXISTS public.deneyim_maddeleri (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER,
    title TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER
);


-- ==========================================
-- GERÇEK VERİLER
-- ==========================================

INSERT INTO public.ana_sayfa_icerik (badge_text, title_line1, title_line2, title_highlight, title_line3, title_line4, description, description2, tagline, tagline_sub, cta_primary_text, cta_secondary_text, map_title, map_badge, is_active)
VALUES (
    'ERP, AI ve veri odaklı dijital dönüşüm çözümleri',
    'Süreci anlar,',
    'doğru ',
    'dijital ',
    'çözümü ',
    'tasarlarız.',
    'Atalitix, şirketlerin iş süreçlerini ERP, yapay zekâ, veri analitiği ve otomasyon teknolojileriyle daha akıllı, ölçülebilir ve sürdürülebilir hale getiren teknoloji ve danışmanlık markasıdır.',
    'ERP projelerinde Odoo partnerliği yaklaşımıyla ilerler; ERP dışında kalan süreçler ise UiPath, Kuika, AI araçları, agentic robotlar, low-code/no-code çözümler veya özel yazılım ile tasarlanır.',
    'Veriden zekâya, süreçten değere.',
    'From dATA to Intelligence.',
    'Çözümleri İncele →',
    '20+ Yıllık Deneyim',
    'Sahadan sisteme, sistemden karara',
    'ATALİTİX MAP',
    true
) ON CONFLICT DO NOTHING;

INSERT INTO public.cozumler (category_label, title, description, icon_name, sort_order, is_active)
VALUES 
    ('ODOO ODAĞIYLA KURUMSAL SÜREÇ KURGUSU', 'ERP Danışmanlığı', 'ERP tarafında odağımız, Odoo partnerliği çerçevesinde şirket süreçlerinin doğru kurgulanması, kapsamın netleşmesi ve uygulanabilir proje yol haritasının oluşturulmasıdır.', 'erp', 1, true),
    ('SÜREÇ TASARIMINDAN TEKNOLOJİ PLANINA', 'Dijitalleşme Yol Haritası', 'Dijital dönüşümü araç seçimi olarak değil; süreç, rol, veri, sistem ve karar noktalarının birlikte tasarlandığı bir yolculuk olarak ele alırız.', 'roadmap', 2, true),
    ('KPI, DASHBOARD VE KARAR DESTEK', 'Veri Görselleştirme', 'Operasyon, planlama, finans ve yönetim verilerini anlaşılır dashboard''lara, KPI panellerine ve karar destek ekranlarına dönüştürürüz.', 'dashboard', 3, true),
    ('RPA, AGENTIC ROBOTLAR VE AKILLI ARAÇLAR', 'Non-ERP Otomasyon', 'ERP dışında kalan rutin işleri; UiPath, Kuika, AI araçları, agentic robotlar, low-code/no-code çözümler veya özel yazılım ile tasarlarız.', 'automation', 4, true),
    ('SAHADAN SİSTEME SADE AKIŞLAR', 'Süreç Tasarımı', 'Şirket süreçlerini uçtan uca analiz eder; sade, ölçülebilir, sistemlere uygun ve sürdürülebilir hale getiririz.', 'process', 5, true),
    ('STRATEJİ, KAPSAM VE UYGULAMA DESTEĞİ', 'Danışmanlık', 'ERP, AI, otomasyon, veri ve dijital süreç projelerinde strateji, kapsam, proje yönetimi ve uygulama desteği sunarız.', 'consulting', 6, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.yaklasim_adimlari (step_number, title, description, sort_order, is_active)
VALUES 
    (1, 'Süreci Anla', 'Mevcut iş akışını, kullanıcı deneyimini, veri kaynaklarını ve gerçek darboğazları sahadan okuyarak başlarız.', 1, true),
    (2, 'Doğru Yere Konumlandır', 'Hangi ihtiyacın ERP içinde, hangisinin ERP dışında daha doğru çözüleceğini belirleriz.', 2, true),
    (3, 'Çözüm Katmanını Seç', 'Odoo, RPA, agentic robot, AI aracı, low-code/no-code platform ya da özel yazılım alternatiflerini iş değerine göre konumlandırırız.', 3, true),
    (4, 'Uygula ve Ölç', 'Çözümü küçük, yönetilebilir adımlarla hayata geçirir; KPI, kullanım ve verimlilik etkisiyle takip ederiz.', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.isletim_haritasi_adimlari (step_number, title, description, sort_order, is_active)
VALUES 
    (1, 'İş Süreci', 'Üretim, planlama, finans, satınalma, lojistik, İK ve destek fonksiyonları', 1, true),
    (2, 'ERP Alanı', 'Odoo partnerliği çerçevesinde standartlaşacak kurumsal süreçler ve temel sistem akışı', 2, true),
    (3, 'ERP Dışı Alan', 'UiPath, Kuika, AI araçları, agentic robotlar, low-code/no-code veya özel yazılım ile çözülecek işler', 3, true),
    (4, 'Görünürlük', 'Dashboard, KPI, raporlama, aksiyon takibi ve yönetim karar desteği', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.teknoloji_etiketleri (name, sort_order, is_active)
VALUES 
    ('Odoo', 1, true),
    ('UiPath', 2, true),
    ('Kuika', 3, true),
    ('AI Tools', 4, true),
    ('Agentic Robots', 5, true),
    ('Low-Code / No-Code', 6, true),
    ('Custom Software', 7, true),
    ('Dashboards', 8, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.deneyim_maddeleri (step_number, title, sort_order, is_active)
VALUES 
    (1, '20+ yıllık üretim, otomotiv, planlama ve bilgi teknolojileri deneyimi', 1, true),
    (2, 'Saha gerçeklerini bilen süreç ve sistem bakış açısı', 2, true),
    (3, 'ERP ve ERP dışı dijital araçları birlikte konumlandırma yetkinliği', 3, true),
    (4, 'İş değeri, uygulanabilirlik ve sürdürülebilirlik odaklı yaklaşım', 4, true)
ON CONFLICT DO NOTHING;
