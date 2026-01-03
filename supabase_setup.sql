-- Migración para la creación de tablas de pedidos en Supabase

-- Crear tabla de Pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    usuario_anonimo_id UUID REFERENCES public.usuarios_anonimos(id) ON DELETE SET NULL,
    codigo_seguimiento TEXT UNIQUE, -- para pedidos anónimos (mismo que el del usuario anónimo)
    total NUMERIC NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente, preparando, listo, entregado, cancelado
    nombre_cliente TEXT NOT NULL,
    telefono_cliente TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Crear tabla de Usuarios Anónimos
CREATE TABLE IF NOT EXISTS public.usuarios_anonimos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT, -- opcional para marketing futuro
    codigo_seguimiento TEXT UNIQUE NOT NULL, -- código único para tracking público
    acepta_marketing BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Crear tabla de Items de Pedido
CREATE TABLE IF NOT EXISTS public.items_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
    producto_id TEXT NOT NULL,
    nombre_producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.usuarios_anonimos ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso (RLS)

-- Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Usuarios pueden ver sus propios pedidos" 
ON public.pedidos FOR SELECT 
USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propios pedidos
CREATE POLICY "Usuarios pueden insertar sus propios pedidos" 
ON public.pedidos FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- La cocina puede ver todos los pedidos (Esto requiere un rol de admin o política específica)
-- Por ahora permitiremos lectura total para simplificar la demo, en production se restringiría
CREATE POLICY "Permitir lectura para gestión de cocina" 
ON public.pedidos FOR SELECT 
TO authenticated
USING (true);

-- Permitir actualización de estados para gestión de cocina
CREATE POLICY "Permitir actualizar estados de pedidos" 
ON public.pedidos FOR UPDATE
TO authenticated
USING (true);

-- Políticas para items_pedido
CREATE POLICY "Usuarios pueden ver items de sus pedidos" 
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

CREATE POLICY "Usuarios pueden insertar items"
ON public.items_pedido FOR INSERT
WITH CHECK (true);

-- 6. Habilitar Realtime para las tablas (Esto es vital para la cocina y tracking)
-- Esto permite que los cambios en la DB se notifiquen instantáneamente a la app.
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;
ALTER PUBLICATION supabase_realtime ADD TABLE items_pedido;
ALTER PUBLICATION supabase_realtime ADD TABLE usuarios_anonimos;

-- Función para generar códigos de seguimiento únicos
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_count INTEGER;
BEGIN
    LOOP
        -- Generar código de 6 caracteres alfanumérico
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

        -- Verificar si ya existe
        SELECT COUNT(*) INTO exists_count
        FROM usuarios_anonimos
        WHERE codigo_seguimiento = code;

        -- Si no existe, salir del loop
        IF exists_count = 0 THEN
            EXIT;
        END IF;
    END LOOP;

    RETURN code;
END;
$$ LANGUAGE plpgsql;
