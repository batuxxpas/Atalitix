-- =====================================================================
-- Atalitix — Güvenlik (RLS) + Haberler + Çözüm alt başlıkları
-- Supabase panelinde: SQL Editor → New query → bu dosyanın TAMAMINI
-- yapıştırın → Run. Tekrar çalıştırmak güvenlidir (idempotent).
-- Mevcut içerik satırlarına dokunmaz.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Yeni tablolar
-- ---------------------------------------------------------------------
create table if not exists public.haberler (
  id          uuid primary key default gen_random_uuid(),
  tur         text not null default 'bizden' check (tur in ('bizden', 'dunyadan')),
  baslik      text not null,
  ozet        text,
  kaynak_adi  text,
  link        text,
  gorsel_url  text,
  tarih       date not null default current_date,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.haberler add column if not exists gorsel_url text;

create table if not exists public.cozum_alt_basliklari (
  id          uuid primary key default gen_random_uuid(),
  cozum_id    uuid not null references public.cozumler(id) on delete cascade,
  baslik      text not null,
  aciklama    text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) Eski (geniş) politikaları temizle
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'ana_sayfa_icerik','isletim_haritasi_adimlari','isletim_haritasi_kategorileri',
        'teknoloji_etiketleri','cozumler','cozum_alt_basliklari','yaklasim_adimlari',
        'deneyim_maddeleri','haberler','iletisim_talepleri','admin_users'
      ])
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3) RLS'i aç
-- ---------------------------------------------------------------------
alter table public.ana_sayfa_icerik              enable row level security;
alter table public.isletim_haritasi_adimlari     enable row level security;
alter table public.isletim_haritasi_kategorileri enable row level security;
alter table public.teknoloji_etiketleri          enable row level security;
alter table public.cozumler                      enable row level security;
alter table public.cozum_alt_basliklari          enable row level security;
alter table public.yaklasim_adimlari             enable row level security;
alter table public.deneyim_maddeleri             enable row level security;
alter table public.haberler                      enable row level security;
alter table public.iletisim_talepleri            enable row level security;
alter table public.admin_users                   enable row level security;

-- ---------------------------------------------------------------------
-- 4) Ziyaretçi yetkileri: içerik SADECE okunur, form SADECE gönderilir
--    (Admin paneli sunucuda service_role ile çalışır, RLS'ten etkilenmez.)
-- ---------------------------------------------------------------------
revoke all on public.ana_sayfa_icerik, public.isletim_haritasi_adimlari,
              public.isletim_haritasi_kategorileri, public.teknoloji_etiketleri,
              public.cozumler, public.cozum_alt_basliklari, public.yaklasim_adimlari,
              public.deneyim_maddeleri, public.haberler,
              public.iletisim_talepleri, public.admin_users
  from anon, authenticated;

grant select on public.ana_sayfa_icerik, public.isletim_haritasi_adimlari,
               public.isletim_haritasi_kategorileri, public.teknoloji_etiketleri,
               public.cozumler, public.cozum_alt_basliklari, public.yaklasim_adimlari,
               public.deneyim_maddeleri, public.haberler
  to anon, authenticated;

grant insert on public.iletisim_talepleri to anon, authenticated;

-- Admin paneli (sunucu, service_role) yeni tablolara tam erişsin
grant all on public.haberler, public.cozum_alt_basliklari to service_role;

create policy "Herkes okuyabilir" on public.ana_sayfa_icerik              for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.isletim_haritasi_adimlari     for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.isletim_haritasi_kategorileri for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.teknoloji_etiketleri          for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.cozumler                      for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.cozum_alt_basliklari          for select to anon, authenticated using (is_active);
create policy "Herkes okuyabilir" on public.yaklasim_adimlari             for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.deneyim_maddeleri             for select to anon, authenticated using (true);
create policy "Yayındaki haberler" on public.haberler                     for select to anon, authenticated using (is_active);

create policy "Form gönderimi" on public.iletisim_talepleri for insert to anon, authenticated with check (true);

-- admin_users ve iletisim_talepleri için okuma politikası YOK → dışarıdan okunamaz.

-- ---------------------------------------------------------------------
-- 5) Çözüm alt başlıkları (sunum: 1.1, 1.2, 2.1) — tekrar eklemez
-- ---------------------------------------------------------------------
insert into public.cozum_alt_basliklari (cozum_id, baslik, aciklama, sort_order)
select c.id, v.baslik, v.aciklama, v.sira
from (values
  ('Süreç Analizi ve Hedef Süreç Tasarımı', 'ERP Kapsamı ve Kavramsal Tasarım',
   'Modül kapsamı, entegrasyon ihtiyacı ve uygun ERP yolu netleştirilir; Odoo, SAP, Logo, Canias vb. alternatifler süreç uyumuna göre değerlendirilir.', 1),
  ('Süreç Analizi ve Hedef Süreç Tasarımı', 'Odoo Uygulama',
   'Odoo''nun doğru yol olduğu projelerde kurulum, uyarlama, veri aktarımı ve canlıya geçiş sertifikalı ekibimizle yürütülür.', 2),
  ('Dijital & AI Olgunluk Değerlendirme', 'Veri, AI ve Otomasyon Fırsatları',
   'KPI, dashboard, RPA/AI kullanım senaryoları ve otomasyon backlog''u; iş değeri, veri hazırlığı ve uygulanabilirliğe göre önceliklendirilir.', 1)
) as v(cozum, baslik, aciklama, sira)
join public.cozumler c on c.title = v.cozum and c.is_active
where not exists (
  select 1 from public.cozum_alt_basliklari x where x.cozum_id = c.id and x.baslik = v.baslik
);

-- ---------------------------------------------------------------------
-- 6) Örnek haberler (görseller Supabase Storage: haberler/kapaklar) — tekrar eklemez
-- ---------------------------------------------------------------------
insert into public.haberler (tur, baslik, ozet, tarih, gorsel_url)
select v.tur, v.baslik, v.ozet, v.tarih, v.gorsel_url
from (values
  ('bizden', 'Yeni web sitemiz yayında', 'Süreç tasarımı merkezli dönüşüm yaklaşımımızı, üç çözüm alanımızı ve ERP yolu çalışmalarımızı anlatan yeni web sitemizi yayına aldık. Etkinliklerimizi ve gündem notlarımızı artık Haberler bölümünden takip edebilirsiniz.', date '2026-11-08', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/site.jpg'),
  ('bizden', '2026 tanıtım sunumumuz hazır', 'Süreç analizi, ERP kapsamı, dijital ve AI olgunluk değerlendirmesi ile eğitim ve adaptasyon başlıklarındaki çalışma modelimizi ve çıktı paketlerimizi anlatan tanıtım sunumumuz hazır. Sunumu talep etmek için bizimle iletişime geçebilirsiniz.', date '2026-11-05', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/sunum.jpg'),
  ('bizden', 'Odoo sertifikalı danışmanlık', 'Ekibimiz Odoo sertifikasyonunu tamamladı. Kapsam çalışmasının Odoo''yu işaret ettiği ERP projelerinde kurulum, uyarlama, veri aktarımı ve canlıya geçişi sertifikalı ekibimizle yürütüyoruz.', date '2026-10-29', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/odoo.jpg'),
  ('dunyadan', 'ERP seçiminde odak süreç uyumuna kayıyor', 'Şirketler ERP kararlarında modül listelerinden çok süreç uyumu, entegrasyon ihtiyacı, kullanıcı profili ve ölçeklenebilirliği sorguluyor. Kapsamı süreç haritasından başlatan projeler uyarlama ihtiyacını ve proje riskini azaltıyor.', date '2026-11-06', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/erp.jpg'),
  ('dunyadan', 'Ortak KPI sözlüğü olmadan yönetim kokpiti olmaz', 'Dashboard projelerinin önündeki en büyük engel çoğu zaman teknoloji değil; aynı göstergenin farklı departmanlarda farklı hesaplanması. Ortak KPI tanımları ve aksiyon takibiyle desteklenen ekranlar karar hızını artırıyor.', date '2026-11-02', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/kpi.jpg'),
  ('dunyadan', 'Kurumsal yapay zekâda pilottan yönetişime', 'Yapay zekâ girişimlerinde gündem; tek tek denemelerden, değer üreten kullanım senaryolarının seçilmesine, kullanıcı kabulüne ve KVKK ile uyumlu yönetişim kurallarına kayıyor.', date '2026-10-27', 'https://rhjlmhvcpjqmxjyferzi.supabase.co/storage/v1/object/public/haberler/kapaklar/ai.jpg')
) as v(tur, baslik, ozet, tarih, gorsel_url)
where not exists (select 1 from public.haberler h where h.baslik = v.baslik);

-- ---------------------------------------------------------------------
-- 7) Kontrol (Run sonrası alttaki sonuçta tüm tablolarda rls = true olmalı)
-- ---------------------------------------------------------------------
select c.relname as tablo, c.relrowsecurity as rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;
