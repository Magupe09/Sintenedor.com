-- 🔍 DEBUG: ¿Por qué no aparecen pedidos en panel de cocina?

-- 1. VER CONSULTA EXACTA DEL PANEL DE COCINA
-- (Simular la consulta que hace el panel)
SELECT
    COUNT(*) as pedidos_que_deberia_ver_panel
FROM public.pedidos
WHERE estado != 'cancelado'
  AND created_at >= CURRENT_DATE::timestamp; -- Solo pedidos de HOY

-- 2. VER PEDIDOS ACTIVOS DETALLADOS
SELECT
    id,
    nombre_cliente,
    estado,
    created_at,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 3600 as horas_antiguedad,
    CASE
        WHEN created_at >= CURRENT_DATE::timestamp THEN '🟢 HOY (debería aparecer)'
        ELSE '🔴 AYER o ANTES (no aparece)'
    END as visibilidad_panel
FROM public.pedidos
WHERE estado != 'entregado' AND estado != 'cancelado'
ORDER BY created_at DESC;

-- 3. VER RANGO DE FECHAS DE PEDIDOS ACTIVOS
SELECT
    MIN(created_at) as pedido_mas_antiguo_activo,
    MAX(created_at) as pedido_mas_reciente_activo,
    CURRENT_DATE as hoy,
    CURRENT_DATE - INTERVAL '1 day' as ayer
FROM public.pedidos
WHERE estado != 'entregado' AND estado != 'cancelado';

-- 4. VERIFICAR POLÍTICAS RLS PARA ADMIN
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'pedidos'
  AND (roles LIKE '%auth%' OR qual LIKE '%admin%');

-- 5. PROBAR CONSULTA DEL PANEL COMO ADMIN
-- (Simular exactamente lo que hace el código)
SELECT
    p.*,
    COUNT(i.id) as items_count
FROM public.pedidos p
LEFT JOIN public.items_pedido i ON p.id = i.pedido_id
WHERE p.estado != 'cancelado'
  AND p.created_at >= CURRENT_DATE::timestamp
GROUP BY p.id, p.user_id, p.usuario_anonimo_id, p.total, p.estado,
         p.nombre_cliente, p.telefono_cliente, p.created_at, p.codigo_seguimiento
ORDER BY p.created_at ASC;


