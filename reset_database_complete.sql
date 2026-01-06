-- 🚨 RESET COMPLETO DE LA BASE DE DATOS
-- ⚠️  ATENCIÓN: ESTO ELIMINA TODOS LOS DATOS

-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS RLS
DROP POLICY IF EXISTS "Publico puede crear pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Publico puede ver sus pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "admin_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "admin_update_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "todos_insert_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "usuarios_anonimos_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "usuarios_autenticados_select_pedidos" ON public.pedidos;

DROP POLICY IF EXISTS "Publico puede crear productos de pedido" ON public.items_pedido;
DROP POLICY IF EXISTS "Publico puede ver productos de pedido" ON public.items_pedido;
DROP POLICY IF EXISTS "admin_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "admin_update_items" ON public.items_pedido;

DROP POLICY IF EXISTS "admin_select_usuarios_anonimos" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "admin_insert_usuarios_anonimos" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "public_insert_usuarios_anonimos" ON public.usuarios_anonimos;

-- PASO 2: ELIMINAR TRIGGERS Y FUNCIONES
DROP TRIGGER IF EXISTS alert_pedido_huerfano ON public.pedidos;
DROP FUNCTION IF EXISTS alert_pedido_huerfano();
DROP FUNCTION IF EXISTS recuperar_pedidos_huerfanos();
DROP FUNCTION IF EXISTS recuperar_todos_pedidos_huerfanos();
DROP FUNCTION IF EXISTS generate_tracking_code();

-- PASO 3: ELIMINAR CONSTRAINTS
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_debe_tener_usuario;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS fk_pedidos_usuario_anonimo;

-- PASO 4: ELIMINAR TODOS LOS DATOS
DELETE FROM public.items_pedido;
DELETE FROM public.pedidos;
DELETE FROM public.usuarios_anonimos;

-- PASO 5: ELIMINAR TABLAS (si queremos empezar completamente desde cero)
-- ⚠️  DESCOMENTA ESTAS LÍNEAS SOLO SI QUIERES ELIMINAR LAS TABLAS COMPLETAMENTE
-- DROP TABLE IF EXISTS public.items_pedido;
-- DROP TABLE IF EXISTS public.pedidos;
-- DROP TABLE IF EXISTS public.usuarios_anonimos;

-- PASO 6: DESHABILITAR RLS EN LAS TABLAS RESTANTES
ALTER TABLE public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_anonimos DISABLE ROW LEVEL SECURITY;

-- PASO 7: VERIFICACIÓN
SELECT
    'pedidos' as tabla, COUNT(*) as registros FROM public.pedidos
UNION ALL
SELECT 'items_pedido', COUNT(*) FROM public.items_pedido
UNION ALL
SELECT 'usuarios_anonimos', COUNT(*) FROM public.usuarios_anonimos
UNION ALL
SELECT 'politicas_rls', COUNT(*) FROM pg_policies WHERE schemaname = 'public'
UNION ALL
SELECT 'triggers', COUNT(*) FROM pg_trigger WHERE tgname LIKE '%pedido%'
UNION ALL
SELECT 'funciones', COUNT(*) FROM pg_proc WHERE proname LIKE '%pedido%' OR proname LIKE '%tracking%';

-- RESULTADO ESPERADO:
-- pedidos: 0
-- items_pedido: 0
-- usuarios_anonimos: 0
-- politicas_rls: 0
-- triggers: 0
-- funciones: 0


