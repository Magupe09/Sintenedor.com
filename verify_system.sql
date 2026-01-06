-- 🔍 VERIFICACIÓN COMPLETA: Estados de todos los pedidos

-- 1. ESTADO GENERAL DE TODOS LOS PEDIDOS
SELECT
    CASE
        WHEN user_id IS NOT NULL THEN '🔐 Autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN '👤 Anónimo'
        ELSE '❓ Huérfano'
    END as tipo_usuario,
    estado,
    COUNT(*) as cantidad,
    STRING_AGG(SUBSTRING(codigo_seguimiento, 1, 3) || '...', ', ') as codigos_ejemplo
FROM public.pedidos
GROUP BY
    CASE
        WHEN user_id IS NOT NULL THEN '🔐 Autenticado'
        WHEN usuario_anonimo_id IS NOT NULL THEN '👤 Anónimo'
        ELSE '❓ Huérfano'
    END,
    estado
ORDER BY tipo_usuario, estado;

-- 2. PEDIDOS ACTIVOS (no entregados) - Estos deberían aparecer en la app
SELECT
    id,
    nombre_cliente,
    estado,
    codigo_seguimiento,
    CASE
        WHEN user_id IS NOT NULL THEN 'Usuario registrado'
        WHEN usuario_anonimo_id IS NOT NULL THEN 'Usuario anónimo'
        ELSE 'ERROR'
    END as tipo,
    created_at
FROM public.pedidos
WHERE estado != 'entregado'
ORDER BY created_at DESC;

-- 3. PEDIDOS CON CÓDIGO DE SEGUIMIENTO (rastreables)
SELECT
    COUNT(*) as pedidos_rastreables,
    COUNT(CASE WHEN estado != 'entregado' THEN 1 END) as rastreables_activos
FROM public.pedidos
WHERE codigo_seguimiento IS NOT NULL;

-- 4. VERIFICACIÓN DE INTEGRIDAD
SELECT
    'Total pedidos' as metrica, COUNT(*) as valor FROM pedidos
UNION ALL
SELECT 'Con usuario asignado', COUNT(*) FROM pedidos WHERE user_id IS NOT NULL OR usuario_anonimo_id IS NOT NULL
UNION ALL
SELECT 'Sin usuario asignado', COUNT(*) FROM pedidos WHERE user_id IS NULL AND usuario_anonimo_id IS NULL
UNION ALL
SELECT 'Con código de seguimiento', COUNT(*) FROM pedidos WHERE codigo_seguimiento IS NOT NULL
UNION ALL
SELECT 'Usuarios anónimos', COUNT(*) FROM usuarios_anonimos;

-- 5. PEDIDOS MÁS RECIENTES CON DETALLES
SELECT
    p.id,
    p.nombre_cliente,
    p.estado,
    p.codigo_seguimiento,
    ua.nombre as usuario_anonimo,
    p.created_at,
    CASE WHEN p.estado != 'entregado' THEN '🟢 ACTIVO' ELSE '⚪ HISTÓRICO' END as status_rastreo
FROM public.pedidos p
LEFT JOIN public.usuarios_anonimos ua ON p.usuario_anonimo_id = ua.id
ORDER BY p.created_at DESC
LIMIT 10;


