-- 🗑️ ELIMINACIÓN SEGURA DE PEDIDO HUÉRFANO SIN ITEMS
-- Ejecutar solo después de verificar que es basura

-- PASO 1: IDENTIFICAR el pedido huérfano sin items
SELECT
    p.id,
    p.nombre_cliente,
    p.estado,
    p.created_at,
    COUNT(i.id) as items_count,
    'HUÉRFANO SIN ITEMS - CANDIDATO A ELIMINAR' as analisis
FROM public.pedidos p
LEFT JOIN public.items_pedido i ON p.id = i.pedido_id
WHERE p.user_id IS NULL AND p.usuario_anonimo_id IS NULL
GROUP BY p.id, p.nombre_cliente, p.estado, p.created_at
HAVING COUNT(i.id) = 0;

-- PASO 2: ELIMINAR (descomenta solo si estás seguro)
-- DELETE FROM public.pedidos
-- WHERE id = 'ID_DEL_PEDIDO_HUERFANO'
-- AND user_id IS NULL
-- AND usuario_anonimo_id IS NULL;

-- PASO 3: VERIFICAR que se eliminó
-- SELECT COUNT(*) as pedidos_restantes_sin_usuario
-- FROM public.pedidos
-- WHERE user_id IS NULL AND usuario_anonimo_id IS NULL;


