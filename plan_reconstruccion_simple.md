# 🚀 PLAN DE RECONSTRUCCIÓN SIMPLE

## 🎯 OBJETIVO
Tener un sistema de pedidos funcional y simple que se pueda entender y mantener.

## 📋 PLAN PASO A PASO

### PASO 1: ✅ BASE DE DATOS VACÍA
- [x] Ejecutar `reset_database_complete.sql`
- [x] Ejecutar `recreate_basic_structure.sql`
- [x] Verificar que todo esté limpio

### PASO 2: 🧪 PRUEBA BÁSICA
**Objetivo:** Verificar que el proyecto se conecta a la BD vacía
- [ ] Crear un pedido de prueba desde la app
- [ ] Verificar que se guarda en la BD
- [ ] Verificar que aparece en panel de cocina

### PASO 3: 🔐 AUTENTICACIÓN SIMPLE
**Objetivo:** Usuarios registrados vs anónimos
- [ ] Usuario registrado → pedido se asocia a `user_id`
- [ ] Usuario anónimo → crear registro en `usuarios_anonimos` y asociar

### PASO 4: 👁️ VISIBILIDAD SIMPLE
**Objetivo:** Qué ve cada tipo de usuario
- [ ] Usuario registrado → ve sus propios pedidos
- [ ] Usuario anónimo → ve pedidos con su `codigo_seguimiento`
- [ ] Admin → ve todos los pedidos

### PASO 5: 📱 FUNCIONALIDADES BÁSICAS
**Objetivo:** Lo mínimo necesario
- [ ] Crear pedido (autenticado o anónimo)
- [ ] Ver estado del pedido
- [ ] Panel de cocina para admin
- [ ] Actualizar estado del pedido

### PASO 6: 🎨 MEJORAS DE UX
**Objetivo:** Hacerlo usable
- [ ] Burbuja flotante para pedidos activos
- [ ] Notificaciones en tiempo real
- [ ] Páginas de rastreo simples

## 🛠️ REGLAS PARA MANTENERLO SIMPLE

### ❌ NO HACER
- Triggers complejos
- Funciones SQL complicadas
- Políticas RLS enredadas
- Código de debug permanente

### ✅ SÍ HACER
- Código legible
- Funciones pequeñas
- Una responsabilidad por componente
- Tests básicos

## 📊 MÉTRICAS DE ÉXITO

- [ ] Crear pedido funciona
- [ ] Ver pedido funciona
- [ ] Panel de cocina funciona
- [ ] Código es entendible
- [ ] No hay bugs misteriosos

## 🚨 CHECKPOINTS

Después de cada paso:
1. ¿El código funciona?
2. ¿Se entiende qué hace?
3. ¿Se puede mantener?
4. ¿Hay tests básicos?

Si algo se complica → STOP y simplificar.


