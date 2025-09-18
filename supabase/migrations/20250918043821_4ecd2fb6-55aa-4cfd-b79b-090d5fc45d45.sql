-- Check current view properties
SELECT 
  schemaname, 
  viewname, 
  definition,
  pg_catalog.pg_get_viewdef(c.oid, true) as full_definition
FROM pg_views v
JOIN pg_class c ON c.relname = v.viewname
WHERE viewname = 'medicos_publicos';