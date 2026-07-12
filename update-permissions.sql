-- Atalitix Supabase İzin Güncellemesi
-- DİKKAT: Bu scripti Supabase panelindeki SQL Editor kısmına yapıştırıp çalıştırın.
-- Bu işlem, veritabanı tablolarına uygulamanın (ve admin servisinin) erişim (kayıt/güncelleme) yetkilerini onarır.

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
