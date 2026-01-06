-- 🏗️ RECREACIÓN DE ESTRUCTURA BÁSICA
-- Solo lo mínimo necesario para que funcione el proyecto

-- PASO 1: RECREAR TABLAS BÁSICAS (si las eliminamos)
-- ⚠️  DESCOMENTA SOLO SI ELIMINAMOS LAS TABLAS EN EL RESET

-- CREATE TABLE IF NOT EXISTS public.usuarios_anonimos (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     nombre TEXT NOT NULL,
--     telefono TEXT,
--     email TEXT,
--     codigo_seguimiento TEXT UNIQUE,
--     acepta_marketing BOOLEAN DEFAULT false,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS public.pedidos (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
--     usuario_anonimo_id UUID REFERENCES public.usuarios_anonimos(id) ON DELETE SET NULL,
--     nombre_cliente TEXT NOT NULL,
--     telefono_cliente TEXT,
--     total DECIMAL(10,2) NOT NULL DEFAULT 0,
--     estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado')),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS public.items_pedido (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
--     nombre_producto TEXT NOT NULL,
--     cantidad INTEGER NOT NULL CHECK (cantidad > 0),
--     precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- PASO 2: POLÍTICAS RLS SIMPLES Y FUNCIONALES
-- Permitir que TODO EL MUNDO lea y escriba (temporalmente simple)
ALTER TABLE public.usuarios_anonimos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;

-- Políticas básicas: permitir todo por ahora
CREATE POLICY "permitir_todo_usuarios_anonimos" ON public.usuarios_anonimos FOR ALL USING (true);
CREATE POLICY "permitir_todo_pedidos" ON public.pedidos FOR ALL USING (true);
CREATE POLICY "permitir_todo_items" ON public.items_pedido FOR ALL USING (true);

-- PASO 3: HABILITAR REALTIME PARA LAS TABLAS
-- Esto permite actualizaciones en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.items_pedido;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usuarios_anonimos;

-- PASO 4: VERIFICACIÓN
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('pedidos', 'items_pedido', 'usuarios_anonimos');

SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public';


