-- 🔍 VERIFICACIÓN FINAL - ¿Qué pasó con los pedidos huérfanos?

-- 1. Estado actual de pedidos por tipo
SELECT
    CASE
        WHEN user_id IS NOT NULL THEN '🔐 Autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN '👤 Anónimo'
        ELSE '❓ Huérfano'
    END as tipo,
    COUNT(*) as cantidad,
    STRING_AGG(estado, ', ') as estados
FROM public.pedidos
GROUP BY
    CASE
        WHEN user_id IS NOT NULL THEN '🔐 Autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN '👤 Anónimo'
        ELSE '❓ Huérfano'
    END
ORDER BY tipo;

-- 2. Ver si hay pedidos huérfanos restantes
SELECT
    id,
    nombre_cliente,
    estado,
    created_at,
    'PEDIDO HUÉRFANO - NECESITA ATENCIÓN' as alerta
FROM public.pedidos
WHERE user_id IS NULL AND usuario_anonimo_id IS NULL;

-- 3. Ver pedidos anónimos creados recientemente (últimas 24h)
SELECT
    ua.nombre,
    ua.telefono,
    ua.codigo_seguimiento,
    ua.created_at,
    'USUARIO ANÓNIMO CREADO POR RECUPERACIÓN' as origen
FROM public.usuarios_anonimos ua
WHERE ua.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY ua.created_at DESC;

-- 4. Resumen final
SELECT
    'Total pedidos' as metrica,
    COUNT(*) as valor
FROM public.pedidos

UNION ALL

SELECT 'Pedidos autenticados', COUNT(*)
FROM public.pedidos
WHERE user_id IS NOT NULL

UNION ALL

SELECT 'Pedidos anónimos', COUNT(*)
FROM public.pedidos
WHERE usuario_anonimo_id IS NOT NULL

UNION ALL

SELECT 'Pedidos huérfanos', COUNT(*)
FROM public.pedidos
WHERE user_id IS NULL AND usuario_anonimo_id IS NULL

UNION ALL

SELECT 'Usuarios anónimos', COUNT(*)
FROM public.usuarios_anonimos;


