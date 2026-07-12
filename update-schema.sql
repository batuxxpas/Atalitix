-- Atalitix Supabase Schema Update
-- DİKKAT: Bu scripti Supabase panelindeki SQL Editor kısmına yapıştırıp çalıştırın.
-- Bu script, sayfadaki yeni eklenen düzenlenebilir alanlar için (örneğin "20" deneyim yılı, yaklaşım ve çözüm başlıkları) veritabanına gerekli kolonları ekler.

ALTER TABLE public.ana_sayfa_icerik
ADD COLUMN IF NOT EXISTS experience_years TEXT DEFAULT '20',
ADD COLUMN IF NOT EXISTS experience_title TEXT DEFAULT 'Yıllık üretim, otomotiv, planlama ve bilgi teknolojileri deneyimi.',
ADD COLUMN IF NOT EXISTS experience_desc TEXT DEFAULT 'Atalitix''in uzmanlığı; üretim sahası, otomotiv operasyonları, planlama disiplini ve bilgi teknolojileri geçmişinin birleşiminden gelir.',
ADD COLUMN IF NOT EXISTS approach_label TEXT DEFAULT 'YAKLAŞIM',
ADD COLUMN IF NOT EXISTS approach_title TEXT DEFAULT 'Dijital dönüşüm yolculuğu, önce süreç tasarımıdır.',
ADD COLUMN IF NOT EXISTS approach_desc TEXT DEFAULT 'ERP, AI, RPA veya low-code araçları ancak doğru süreç mimarisiyle değer üretir. Bu yüzden çalışmaya araçtan değil; iş akışı, rol, veri, karar noktası ve ölçülebilir faydadan başlarız.',
ADD COLUMN IF NOT EXISTS solutions_label TEXT DEFAULT 'ÇÖZÜM ALANLARI',
ADD COLUMN IF NOT EXISTS solutions_title TEXT DEFAULT 'ERP içinde standart, ERP dışında esnek dijital katman.',
ADD COLUMN IF NOT EXISTS solutions_desc TEXT DEFAULT 'Her süreci tek bir araca zorlamayız. Önce iş akışını ve hedeflenen değeri netleştirir, sonra çözümü doğru katmana yerleştiririz: ERP, otomasyon, AI, low-code/no-code veya özel yazılım.';
