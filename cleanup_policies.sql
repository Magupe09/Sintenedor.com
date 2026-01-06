-- 🧹 LIMPIEZA COMPLETA DE POLÍTICAS EXISTENTES
-- Ejecutar ESTO PRIMERO si hay conflictos

-- Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir lectura para gestión de cocina" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir actualizar estados de pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "usuarios_autenticados_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "usuarios_anonimos_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "todos_insert_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "cocina_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "cocina_update_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Publico puede crear pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Publico puede ver sus pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "admin_select_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "admin_update_pedidos" ON public.pedidos;

DROP POLICY IF EXISTS "Permitir inserción de usuarios anónimos" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "Permitir lectura de usuarios anónimos por código de seguimiento" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "todos_insert_usuarios_anonimos" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "todos_select_usuarios_anonimos" ON public.usuarios_anonimos;

DROP POLICY IF EXISTS "usuarios_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "todos_insert_items" ON public.items_pedido;
DROP POLICY IF EXISTS "admin_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "Publico puede crear productos de pedido" ON public.items_pedido;
DROP POLICY IF EXISTS "Publico puede ver productos de pedido" ON public.items_pedido;

-- Eliminar funciones existentes
DROP FUNCTION IF EXISTS alert_pedido_huerfano();
DROP FUNCTION IF EXISTS recuperar_pedidos_huerfanos();
DROP FUNCTION IF EXISTS mantenimiento_recuperar_huerfanos();
DROP FUNCTION IF EXISTS generate_tracking_code();

-- Eliminar triggers y constraints
DROP TRIGGER IF EXISTS trigger_alert_pedidos_huerfanos ON public.pedidos;
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_debe_tener_usuario;

-- Verificar que se eliminaron
SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
