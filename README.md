# 🍕 SinTenedor.com

> Plataforma de pedidos online para dark kitchen con automatización completa

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![n8n](https://img.shields.io/badge/n8n-Automation-orange?style=flat-square)](https://n8n.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

## 📋 Descripción

**SinTenedor.com** es una aplicación web moderna para gestionar pedidos de una dark kitchen, diseñada para automatizar completamente el flujo de trabajo desde la recepción del pedido hasta la entrega al cliente.

### ✨ Características principales

- 🛒 **Recepción de pedidos online** - Interfaz intuitiva para clientes
- 💾 **Gestión de base de datos** - Almacenamiento seguro con PostgreSQL/Supabase
- 🔔 **Notificaciones automáticas** - Alertas a clientes, cocina y domiciliarios
- 🤖 **Automatización con n8n** - Workflows inteligentes sin plataformas externas
- 🌎 **Escalabilidad internacional** - Preparado para expansión a Perú y Chile

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- React
- CSS Modules

### Backend
- **Next.js API Routes** (`app/api`)
- PostgreSQL / Supabase
- Migrando desde Express

### Automatización
- **n8n** - Orquestación de workflows
  - Webhooks para recepción de pedidos
  - Integración con base de datos
  - Notificaciones multicanal (Email, WhatsApp, Telegram)
  - Tracking de domiciliarios

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js >= 18.x
npm >= 9.x
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Magupe09/Sintenedor.com.git

# Navegar al directorio
cd sintenedor

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
sintenedor/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── pedidos/           # Módulo de pedidos
│   └── ...
├── .docs/                 # Documentación del proyecto
│   └── project-objective.md
├── public/                # Archivos estáticos
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=your_database_url

# n8n Webhook
N8N_WEBHOOK_URL=your_n8n_webhook_url

# Otras configuraciones
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📖 Documentación

Para más información sobre el proyecto, objetivos y metodología de trabajo, consulta:

- [Objetivo del Proyecto](.docs/project-objective.md)

## 🗺️ Roadmap

- [x] Configuración inicial de Next.js
- [x] Estructura de rutas con App Router
- [ ] Integración con n8n Cloud
- [ ] Conexión a base de datos PostgreSQL/Supabase
- [ ] Sistema de notificaciones
- [ ] Panel de administración
- [ ] Expansión internacional (Perú, Chile)

## 👨‍💻 Desarrollo

Este proyecto está en desarrollo activo. Se sigue una metodología de trabajo paso a paso, priorizando el aprendizaje y la comprensión de cada componente.

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 📄 Licencia

Este proyecto es privado y está en desarrollo.

## 📧 Contacto

Para más información sobre el proyecto, contacta al equipo de desarrollo.

---

**Hecho con ❤️ para revolucionar el delivery de comida**
