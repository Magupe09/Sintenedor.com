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

-- Políticas de items_pedido
DROP POLICY IF EXISTS "usuarios_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "todos_insert_items" ON public.items_pedido;
DROP POLICY IF EXISTS "admin_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "usuarios_select_items" ON public.items_pedido;
DROP POLICY IF EXISTS "todos_insert_items" ON public.items_pedido;
DROP POLICY IF EXISTS "admin_select_items" ON public.items_pedido;

-- 4. Asegurar que RLS esté habilitado
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_anonimos ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas ACTUALIZADAS para pedidos
-- Política para usuarios autenticados normales (solo sus pedidos)
CREATE POLICY "usuarios_autenticados_select_pedidos"
ON public.pedidos FOR SELECT
USING (auth.uid() = user_id AND auth.jwt() ->> 'email' != 'maonvacation@gmail.com');

-- Política para usuarios anónimos
CREATE POLICY "usuarios_anonimos_select_pedidos"
ON public.pedidos FOR SELECT
USING (codigo_seguimiento IS NOT NULL AND auth.uid() IS NULL);

-- Política para admins (pueden ver todos los pedidos)
CREATE POLICY "admin_select_pedidos"
ON public.pedidos FOR SELECT
USING (auth.jwt() ->> 'email' = 'maonvacation@gmail.com');

-- Insert para todos
CREATE POLICY "todos_insert_pedidos"
ON public.pedidos FOR INSERT
WITH CHECK (true);

-- Update para admins
CREATE POLICY "admin_update_pedidos"
ON public.pedidos FOR UPDATE
USING (auth.jwt() ->> 'email' = 'maonvacation@gmail.com');

-- 6. Crear políticas para usuarios_anonimos
CREATE POLICY "todos_insert_usuarios_anonimos"
ON public.usuarios_anonimos FOR INSERT
WITH CHECK (true);

CREATE POLICY "todos_select_usuarios_anonimos"
ON public.usuarios_anonimos FOR SELECT
USING (true);

-- 7. Crear políticas para items_pedido
-- Política para usuarios normales
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

-- Política para admins (pueden ver todos los items)
CREATE POLICY "admin_select_items"
ON public.items_pedido FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.pedidos
        WHERE pedidos.id = items_pedido.pedido_id
        AND (auth.jwt() ->> 'email') = 'maonvacation@gmail.com'
    )
);

CREATE POLICY "todos_insert_items"
ON public.items_pedido FOR INSERT
WITH CHECK (true);

-- 9. Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
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

-- 9. DIAGNÓSTICO COMPLETO DE PEDIDOS
-- Ver todos los pedidos
SELECT
    id,
    user_id,
    usuario_anonimo_id,
    codigo_seguimiento,
    estado,
    created_at,
    nombre_cliente
FROM public.pedidos
ORDER BY created_at DESC
LIMIT 10;

-- 10. Ver pedidos por tipo
SELECT
    CASE
        WHEN user_id IS NOT NULL THEN 'Usuario autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN 'Usuario anónimo'
        ELSE 'Sin usuario'
    END as tipo_usuario,
    COUNT(*) as cantidad
FROM public.pedidos
GROUP BY
    CASE
        WHEN user_id IS NOT NULL THEN 'Usuario autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN 'Usuario anónimo'
        ELSE 'Sin usuario'
    END;

-- 11. Ver pedidos con código de seguimiento
SELECT id, codigo_seguimiento, estado, created_at, nombre_cliente
FROM public.pedidos
WHERE codigo_seguimiento IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- 12. VER PEDIDOS HUÉRFANOS (sin usuario asignado)
SELECT id, user_id, usuario_anonimo_id, codigo_seguimiento, estado, created_at, nombre_cliente
FROM public.pedidos
WHERE user_id IS NULL AND usuario_anonimo_id IS NULL
ORDER BY created_at DESC;

-- 15. SISTEMA DE PREVENCIÓN - CONSTRAINTS Y TRIGGERS

-- A. Limpiar constraints, triggers y funciones existentes
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_debe_tener_usuario;
DROP TRIGGER IF EXISTS trigger_alert_pedidos_huerfanos ON public.pedidos;
DROP FUNCTION IF EXISTS alert_pedido_huerfano();
DROP FUNCTION IF EXISTS recuperar_pedidos_huerfanos();
DROP FUNCTION IF EXISTS mantenimiento_recuperar_huerfanos();
DROP FUNCTION IF EXISTS generate_tracking_code();

-- B. Constraint para evitar pedidos huérfanos (primero verificar que no hay existentes)
DO $$
BEGIN
    -- Solo agregar constraint si no hay pedidos huérfanos
    IF NOT EXISTS (
        SELECT 1 FROM public.pedidos
        WHERE user_id IS NULL AND usuario_anonimo_id IS NULL
    ) THEN
        ALTER TABLE public.pedidos
        ADD CONSTRAINT pedidos_debe_tener_usuario
        CHECK (user_id IS NOT NULL OR usuario_anonimo_id IS NOT NULL);
        RAISE NOTICE '✅ Constraint agregado: pedidos_debe_tener_usuario';
    ELSE
        RAISE NOTICE '⚠️ No se puede agregar constraint, aún hay pedidos huérfanos';
    END IF;
END $$;

-- C. Trigger para alertar sobre pedidos huérfanos
CREATE OR REPLACE FUNCTION alert_pedido_huerfano()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo alertar si es un pedido huérfano real
    IF NEW.user_id IS NULL AND NEW.usuario_anonimo_id IS NULL THEN
        RAISE WARNING '🚨 PEDIDO HUÉRFANO CREADO: ID %, Cliente: %',
            NEW.id, NEW.nombre_cliente;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_alert_pedidos_huerfanos
    AFTER INSERT ON public.pedidos
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL AND NEW.usuario_anonimo_id IS NULL)
    EXECUTE FUNCTION alert_pedido_huerfano();

-- 13. RECUPERACIÓN DE PEDIDOS HUÉRFANOS
-- Convertir pedidos huérfanos en pedidos anónimos válidos

-- Paso 1: Crear usuarios anónimos para pedidos huérfanos
INSERT INTO public.usuarios_anonimos (
    nombre,
    telefono,
    codigo_seguimiento,
    acepta_marketing,
    created_at
)
SELECT
    nombre_cliente,
    telefono_cliente,
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)), -- Código único
    false, -- No acepta marketing por defecto
    created_at
FROM public.pedidos
WHERE user_id IS NULL
  AND usuario_anonimo_id IS NULL
  AND estado IN ('pendiente', 'preparando', 'listo'); -- Solo activos

-- Paso 2: Función para recuperar pedidos huérfanos
CREATE OR REPLACE FUNCTION recuperar_pedidos_huerfanos()
RETURNS TABLE (
    pedido_id UUID,
    usuario_creado_id UUID,
    codigo_asignado TEXT
) AS $$
DECLARE
    pedido_record RECORD;
    nuevo_usuario_id UUID;
    codigo_generado TEXT;
BEGIN
    -- Crear tabla temporal para resultados
    CREATE TEMP TABLE resultados (
        pedido_id UUID,
        usuario_creado_id UUID,
        codigo_asignado TEXT
    );

    -- Procesar cada pedido huérfano
    FOR pedido_record IN
        SELECT id, nombre_cliente, telefono_cliente, created_at
        FROM public.pedidos
        WHERE user_id IS NULL
          AND usuario_anonimo_id IS NULL
          AND estado IN ('pendiente', 'preparando', 'listo')
        ORDER BY created_at
    LOOP
        -- Generar código único
        LOOP
            codigo_generado := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.usuarios_anonimos
                WHERE codigo_seguimiento = codigo_generado
            );
        END LOOP;

        -- Crear usuario anónimo
        INSERT INTO public.usuarios_anonimos (
            nombre,
            telefono,
            codigo_seguimiento,
            acepta_marketing,
            created_at
        )
        VALUES (
            pedido_record.nombre_cliente,
            pedido_record.telefono_cliente,
            codigo_generado,
            false,
            pedido_record.created_at
        )
        RETURNING id INTO nuevo_usuario_id;

        -- Vincular pedido con usuario anónimo
        UPDATE public.pedidos
        SET usuario_anonimo_id = nuevo_usuario_id,
            codigo_seguimiento = codigo_generado
        WHERE id = pedido_record.id;

        -- Registrar resultado
        INSERT INTO resultados VALUES (pedido_record.id, nuevo_usuario_id, codigo_generado);
    END LOOP;

    RETURN QUERY SELECT * FROM resultados;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar recuperación y ver resultados
SELECT * FROM recuperar_pedidos_huerfanos();

-- 14. ANÁLISIS COMPLETO DE PEDIDOS (después de recuperación)
SELECT
    id,
    user_id,
    usuario_anonimo_id,
    codigo_seguimiento,
    estado,
    created_at,
    nombre_cliente,
    CASE
        WHEN user_id IS NOT NULL THEN '🔐 Autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN '👤 Anónimo'
        ELSE '❓ Huérfano (Sin usuario)'
    END as tipo,
    CASE
        WHEN codigo_seguimiento IS NOT NULL THEN '✅ Rastreado'
        ELSE '❌ No rastreado'
    END as rastreo
FROM public.pedidos
ORDER BY created_at DESC;

-- 14. VER SI LOS PEDIDOS HUÉRFANOS TIENEN ITEMS
SELECT
    p.id as pedido_id,
    p.nombre_cliente,
    p.estado,
    p.created_at,
    COUNT(i.id) as items_count
FROM public.pedidos p
LEFT JOIN public.items_pedido i ON p.id = i.pedido_id
WHERE p.user_id IS NULL AND p.usuario_anonimo_id IS NULL
GROUP BY p.id, p.nombre_cliente, p.estado, p.created_at
ORDER BY p.created_at DESC;

-- 16. FUNCIÓN DE MANTENIMIENTO AUTOMÁTICO
CREATE OR REPLACE FUNCTION mantenimiento_recuperar_huerfanos()
RETURNS TABLE (
    procesados INTEGER,
    recuperados INTEGER,
    mensaje TEXT
) AS $$
DECLARE
    total_procesados INTEGER := 0;
    total_recuperados INTEGER := 0;
    resultado_msg TEXT := '';
BEGIN
    -- Contar huérfanos
    SELECT COUNT(*) INTO total_procesados
    FROM public.pedidos
    WHERE user_id IS NULL AND usuario_anonimo_id IS NULL;

    IF total_procesados = 0 THEN
        RETURN QUERY SELECT 0, 0, 'No hay pedidos huérfanos para recuperar'::TEXT;
        RETURN;
    END IF;

    -- Intentar recuperar
    BEGIN
        SELECT COUNT(*) INTO total_recuperados
        FROM recuperar_pedidos_huerfanos();

        resultado_msg := format('Recuperados %s de %s pedidos huérfanos', total_recuperados, total_procesados);
        RETURN QUERY SELECT total_procesados, total_recuperados, resultado_msg;
    EXCEPTION WHEN OTHERS THEN
        resultado_msg := format('Error en recuperación: %s', SQLERRM);
        RETURN QUERY SELECT total_procesados, 0, resultado_msg;
    END;
END;
$$ LANGUAGE plpgsql;

-- Probar función de mantenimiento (sin ejecutar realmente)
-- SELECT * FROM mantenimiento_recuperar_huerfanos();
