# Objetivo del Proyecto SinTenedor.com

**Fecha de creación:** 2025-12-07  
**Última actualización:** 2025-12-07

---

## 🔥 1. ¿Qué estoy construyendo?

Estoy creando **SinTenedor.com**, una app para una dark kitchen donde quiero:

- Recibir pedidos online.
- Guardar pedidos en una base de datos.
- Notificar al cliente y al domiciliario automáticamente.
- Integrar automatizaciones usando n8n.
- Más adelante replicar el modelo en Perú y Chile.

**Objetivo principal:** Todo debe estar automatizado, sin pago a plataformas externas, y usando herramientas modernas pero accesibles.

---

## ⚙️ 2. ¿Qué tecnologías estoy usando?

### Frontend
- **Next.js (App Router)** — recién instalado.
- Estoy en proceso de aprender Next.js (nivel básico).
- No estoy usando React Router ni rutas antiguas, solo el App Router.

### Backend
- **API Routes de Next.js** (`app/api/.../route.js`)
- **PostgreSQL / Supabase** (aún por configurar para producción).
- Antes tenía un backend en Express, pero estoy migrando todo a Next.js.

### Automatización
- **n8n** para:
  - Recibir pedidos vía Webhook.
  - Guardarlos en BD.
  - Enviar notificaciones (email / WhatsApp / Telegram).
  - Llevar tracking del domiciliario.
  - Expandir el sistema a otros países.

---

## 📁 3. Estructura actual del proyecto Next.js

La estructura del proyecto ya está establecida y conocida.

---

## 🎯 4. ¿Qué quiero lograr ahora mismo?

### 👉 Objetivo actual:
Conectar **Next.js → Webhook de n8n** para que cada pedido que haga un usuario se envíe automáticamente a n8n.

Esto permitirá después:
- Insertar el pedido en BD.
- Notificar a cocina.
- Notificar al domiciliario.
- Notificar al cliente.
- Registrar métricas.

---

## 📌 5. Punto EXACTO donde voy

### YA HE LOGRADO:
- ✅ Instalar Next.js correctamente.
- ✅ Entender rutas en el App Router.
- ✅ Crear el archivo: `app/pedidos/new/route.js` que envía un POST a un webhook n8n.
- ✅ Comprender que aún NO tengo una cuenta de n8n Cloud.
- ✅ Comprender que el siguiente paso es crear el Webhook en n8n pero aún no lo he hecho.

---

## 🚀 6. Lo que necesito ahora

Necesito que me guíen muy despacio y con pasos pequeños para seguir con:

### Siguiente paso exacto:
Crear mi cuenta en n8n Cloud → Crear mi primer Webhook → Probar la conexión desde Next.js.

**Requisitos:**
- Que me acompañen paso a paso, sin adelantar 5 cosas a la vez.
- No quiero que asuman nada ni que actúen como ventarrón.
- Solo un paso o dos pasos por turno.

---

## 🧘‍♂️ 7. Modo de trabajo (muy importante)

### Reglas de colaboración:
1. ❌ **No te adelantes.**
2. ✅ Dame máximo **1–2 pasos por mensaje**.
3. ❌ **No me des código que aún no necesito.**
4. ✅ **Siempre recuérdame en qué parte exacta estoy del proceso.**
5. ✅ **Haz preguntas si necesitas saber algo antes de avanzar.**
6. ❌ **Evita suponer que ya tengo herramientas configuradas.**
7. ✅ **Tu misión es ayudarme a aprender mientras construyo.**

---

## 🙏 8. Conclusión

Con toda esta información, ayúdame a continuar **EXACTAMENTE donde me quedé:**

**Crear el webhook en n8n para conectar mi Next.js.**

---

## 📝 Notas adicionales

Este documento sirve como referencia base para todas las tareas futuras del proyecto. Cualquier decisión técnica o de arquitectura debe considerar los objetivos y el contexto aquí descritos.
