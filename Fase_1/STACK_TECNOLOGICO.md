# Stack Tecnológico - Sistema de Gestión de Citas Médicas
## Hospital Regional del Cusco

---

## 🏗️ **Arquitectura General**

Este proyecto implementa una **aplicación web full-stack** para la gestión de citas médicas con:
- **Frontend**: Single Page Application (SPA) con React + TypeScript
- **Backend**: API RESTful con Node.js + Express
- **Almacenamiento**: Base de datos en memoria (desarrollo)
- **Arquitectura**: Cliente-Servidor con comunicación HTTP/REST

---

## 🔧 **BACKEND (Node.js + Express)**

### **Framework y Runtime**
- **Node.js** - Runtime de JavaScript del lado del servidor
- **Express.js** - Framework web minimalista para APIs RESTful

### **Almacenamiento de Datos**
- **Base de datos en memoria** - Simulación de BD para desarrollo sin dependencias externas
- Datos persistentes durante la ejecución del servidor
- Archivos: `src/database/memoryDB.js`

### **Seguridad y Middleware**
- **Helmet** - Protección de headers HTTP de seguridad
- **CORS** - Control de acceso entre dominios (configurado para localhost:3000)
- **express.json()** - Parsing de JSON con límite de 10MB
- **express.urlencoded()** - Parsing de datos de formularios

### **Utilidades**
- **dotenv** - Gestión de variables de entorno
- **axios** - Cliente HTTP para testing de API

### **Herramientas de Desarrollo**
- **nodemon** - Auto-restart del servidor en desarrollo
- **TypeScript** - Tipado estático (configurado)

### **Scripts Disponibles**
```json
{
  "start": "node src/server.js",
  "start:simple": "node src/server-simple.js",
  "dev": "nodemon src/server-simple.js",
  "test": "node test-api.js"
}
```

---

## ⚛️ **FRONTEND (React + TypeScript + Material-UI)**

### **Framework Principal**
- **React 19.1.1** - Librería de interfaz de usuario
- **TypeScript 4.9.5** - Tipado estático para JavaScript
- **React DOM** - Renderizado en el navegador

### **Enrutamiento y Navegación**
- **React Router DOM v7** - Navegación client-side entre páginas
- Rutas implementadas: `/`, `/citas`, `/medicos`, `/estadisticas`

### **UI Framework y Componentes**
- **Material-UI (MUI) v7** - Sistema de diseño Material Design:
  - `@mui/material` - Componentes principales (AppBar, Cards, Buttons, etc.)
  - `@mui/icons-material` - Iconografía Material Design
  - `@mui/lab` - Componentes experimentales
  - `@mui/system` - Sistema de estilos y theming

### **Estilos y CSS-in-JS**
- **Emotion** - Motor de CSS-in-JS integrado con MUI:
  - `@emotion/react` - Runtime de Emotion
  - `@emotion/styled` - Componentes estilizados

### **Comunicación HTTP**
- **axios** - Cliente HTTP para comunicación con el backend API

### **Testing Framework**
- **React Testing Library** - Testing de componentes React
- **Jest** - Framework de testing integrado
- **@testing-library/user-event** - Simulación de eventos de usuario

### **Build y Herramientas**
- **Create React App (CRA)** - Configuración de build preconfigurada
- **react-scripts 5.0.1** - Scripts de build, dev server y testing
- **workbox-webpack-plugin** - Service Worker para funcionalidades PWA

### **Métricas y Monitoreo**
- **web-vitals** - Métricas de rendimiento web (Core Web Vitals)

### **Scripts Disponibles**
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build", 
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

---

## 🌐 **Comunicación y Conectividad**

### **Protocolo de Comunicación**
- **API REST** - Arquitectura RESTful para endpoints
- **HTTP/HTTPS** - Protocolo de comunicación
- **JSON** - Formato de intercambio de datos

### **Configuración CORS**
- **Origen permitido**: `http://localhost:3000` (frontend)
- **Credentials**: Habilitado para autenticación
- **Headers**: Configuración automática por Express

### **Endpoints Principales**
```
GET    /api/health          - Estado del servidor
GET    /api/especialidades  - Listar especialidades
GET    /api/medicos         - Listar médicos
GET    /api/pacientes       - Listar pacientes
GET    /api/citas           - Listar citas
POST   /api/citas           - Crear nueva cita
PUT    /api/citas/:id       - Actualizar cita
```

---

## 🚀 **Comandos de Ejecución**

### **Backend**
```bash
cd Fase_3/backend
npm install
npm run dev        # Desarrollo con nodemon
npm start          # Producción
```

### **Frontend**
```bash
cd Fase_3/frontend
npm install
npm start          # Servidor de desarrollo
npm run build      # Build de producción
```

---

## 📁 **Estructura del Proyecto**

```
Fase_3/
├── backend/
│   ├── src/
│   │   ├── database/memoryDB.js     # BD en memoria
│   │   ├── server-simple.js         # Servidor principal
│   │   └── test-api.js             # Testing de endpoints
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Componente principal
    │   ├── pages/                  # Páginas de la aplicación
    │   └── index.tsx              # Punto de entrada
    ├── public/
    │   ├── index.html             # Template HTML
    │   └── manifest.json          # Configuración PWA
    └── package.json
```

---

## 🎯 **Características Implementadas**

### **Backend Features**
- ✅ API RESTful completa
- ✅ Base de datos en memoria con datos de ejemplo
- ✅ Middleware de seguridad (Helmet, CORS)
- ✅ Logging de requests
- ✅ Manejo de errores centralizado
- ✅ Endpoints para todas las entidades (especialidades, médicos, pacientes, citas)

### **Frontend Features**  
- ✅ Interfaz responsive con Material Design
- ✅ Navegación multi-página con React Router
- ✅ Componentes modulares y reutilizables
- ✅ TypeScript para type safety
- ✅ PWA básica (Service Worker configurado)
- ✅ Testing framework configurado

---

## 🔧 **Configuración de Desarrollo**

### **Puertos por Defecto**
- **Backend**: `localhost:5002`
- **Frontend**: `localhost:3000`

### **Variables de Entorno**
```env
PORT=5002
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📝 **Notas Técnicas**

- **No se utilizan bases de datos externas** (MongoDB/MySQL están configuradas pero no implementadas)
- **Datos en memoria se pierden** al reiniciar el servidor
- **Configuración lista para escalabilidad** a bases de datos reales
- **PWA preparada** para instalación en dispositivos móviles
- **Material Design** asegura consistencia de UX en diferentes dispositivos
