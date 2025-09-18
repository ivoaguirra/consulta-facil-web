-- Find and identify all views in the database
SELECT 
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views 
WHERE schemaname IN ('public', 'auth', 'storage')
ORDER BY schemaname, viewname;