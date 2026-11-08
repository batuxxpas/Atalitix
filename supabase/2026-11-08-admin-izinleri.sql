-- Admin paneli (service_role) yeni tablolara erişsin
grant all on public.haberler, public.cozum_alt_basliklari to service_role;
select 'tamam' as sonuc;
