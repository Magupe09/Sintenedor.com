-- 🔍 DEBUG: ¿Por qué no se recuperaron todos los huérfanos?

-- 1. Ver huérfanos restantes detalladamente
SELECT
    id,
    nombre_cliente,
    estado,
    created_at,
    'HUÉRFANO NO RECUPERADO' as status
FROM public.pedidos
WHERE user_id IS NULL AND usuario_anonimo_id IS NULL
ORDER BY created_at DESC;

-- 2. Verificar por qué no se procesaron (estado no válido)
SELECT
    estado,
    COUNT(*) as cantidad,
    STRING_AGG(nombre_cliente, ', ') as clientes
FROM public.pedidos
WHERE user_id IS NULL AND usuario_anonimo_id IS NULL
GROUP BY estado;

-- 3. Verificar si ya existen usuarios anónimos para estos clientes
SELECT
    p.nombre_cliente,
    p.telefono_cliente,
    ua.nombre as usuario_anonimo,
    ua.telefono as telefono_anonimo,
    ua.codigo_seguimiento
FROM public.pedidos p
LEFT JOIN public.usuarios_anonimos ua ON ua.nombre = p.nombre_cliente
WHERE p.user_id IS NULL AND p.usuario_anonimo_id IS NULL;

-- 4. Ver logs de la función (si existe tabla de logs)
-- SELECT * FROM pg_stat_user_functions WHERE funcname = 'recuperar_pedidos_huerfanos';

-- 5. Verificar que la función existe
SELECT
    proname,
    pg_get_function_identity_arguments(oid) as argumentos
FROM pg_proc
WHERE proname = 'recuperar_pedidos_huerfanos';


