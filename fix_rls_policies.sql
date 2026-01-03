-- 🔧 FIX RLS POLICIES PARA USUARIOS ANÓNIMOS
-- Ejecutar en Supabase SQL Editor paso a paso

-- 0. Verificar estructura de las tablas
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('pedidos', 'items_pedido', 'usuarios_anonimos')
ORDER BY table_name, ordinal_position;

-- 1. AGREGAR COLUMNAS FALTANTES A LA TABLA PEDIDOS
ALTER TABLE public.pedidos
ADD COLUMN IF NOT EXISTS usuario_anonimo_id UUID REFERENCES public.usuarios_anonimos(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS codigo_seguimiento TEXT UNIQUE;

-- 2. Verificar estado actual de RLS en las tablas
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('pedidos', 'items_pedido', 'usuarios_anonimos');

-- 3. ELIMINAR políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir lectura para gestión de cocina" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir actualizar estados de pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir inserción de usuarios anónimos" ON public.usuarios_anonimos;
DROP POLICY IF EXISTS "Permitir lectura de usuarios anónimos por código de seguimiento" ON public.usuarios_anonimos;

-- 4. Asegurar que RLS esté habilitado
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_anonimos ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas ACTUALIZADAS para pedidos
CREATE POLICY "usuarios_autenticados_select_pedidos"
ON public.pedidos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "usuarios_anonimos_select_pedidos"
ON public.pedidos FOR SELECT
USING (codigo_seguimiento IS NOT NULL AND auth.uid() IS NULL);

CREATE POLICY "todos_insert_pedidos"
ON public.pedidos FOR INSERT
WITH CHECK (true);

CREATE POLICY "cocina_select_pedidos"
ON public.pedidos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "cocina_update_pedidos"
ON public.pedidos FOR UPDATE
TO authenticated
USING (true);

-- 6. Crear políticas para usuarios_anonimos
CREATE POLICY "todos_insert_usuarios_anonimos"
ON public.usuarios_anonimos FOR INSERT
WITH CHECK (true);

CREATE POLICY "todos_select_usuarios_anonimos"
ON public.usuarios_anonimos FOR SELECT
USING (true);

-- 7. Crear políticas para items_pedido
CREATE POLICY "usuarios_select_items"
ON public.items_pedido FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.pedidos
        WHERE pedidos.id = items_pedido.pedido_id
        AND (
            pedidos.user_id = auth.uid() OR
            (pedidos.usuario_anonimo_id IS NOT NULL AND auth.uid() IS NULL)
        )
    )
);

CREATE POLICY "todos_insert_items"
ON public.items_pedido FOR INSERT
WITH CHECK (true);

-- 8. Verificar políticas creadas
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('pedidos', 'items_pedido', 'usuarios_anonimos')
ORDER BY tablename, policyname;

-- 9. VERIFICAR DATOS EN TABLAS (para debug)
SELECT 'pedidos' as tabla, COUNT(*) as total_registros FROM public.pedidos
UNION ALL
SELECT 'usuarios_anonimos' as tabla, COUNT(*) as total_registros FROM public.usuarios_anonimos
UNION ALL
SELECT 'items_pedido' as tabla, COUNT(*) as total_registros FROM public.items_pedido;

-- 10. VERIFICAR COLUMNAS DE PEDIDOS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'pedidos'
ORDER BY ordinal_position;

-- 11. VER PEDIDOS RECIENTES CON CÓDIGO DE SEGUIMIENTO
SELECT id, codigo_seguimiento, estado, created_at, nombre_cliente
FROM public.pedidos
WHERE codigo_seguimiento IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
