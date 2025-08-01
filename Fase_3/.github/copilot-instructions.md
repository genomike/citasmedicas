<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sistema de Gestión de Citas Médicas - Hospital Regional del Cusco

## Contexto del Proyecto
Este es un sistema completo de gestión de citas médicas desarrollado para modernizar el proceso de registro que actualmente se realiza de manera presencial en el Hospital Regional del Cusco.

## Arquitectura del Proyecto

### Frontend (React + TypeScript)
- **Ubicación**: `/frontend/`
- **Framework**: React 18 con TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Ubicación**: `/backend/`
- **Framework**: Express.js v4
- **Database**: MySQL con Sequelize ORM
- **Authentication**: JWT
- **Security**: bcryptjs, helmet, cors

## Público Objetivo
- **Pacientes**: Personas con conocimientos tecnológicos básicos a medios
- **Personal Administrativo**: Gestión completa del sistema
- **Médicos**: Consulta de agenda y disponibilidad

## Consideraciones UX/UI

### Diseño
- **Colores**: Azul médico (#1976d2) como primario, rojo emergencia (#dc004e) como secundario
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Interfaces simples para usuarios con conocimientos básicos

## APIs Disponibles
- `GET /api/health` - Estado del servidor
- `GET /api/especialidades` - Especialidades médicas
- Endpoints de auth, citas, médicos y pacientes en desarrollo

## Configuración
- **Backend**: Puerto 5001 (Express v4)
- **Frontend**: Puerto 3000 (React)
- **Base de datos**: MySQL

## Notas Importantes
- Usar Express v4, NO v5 por compatibilidad
- Priorizar simplicidad en UI
- Sistema en desarrollo activo
Este proyecto es un sistema de gestión de citas médicas para el Hospital Regional del Cusco, diseñado para modernizar el proceso de registro de citas médicas que actualmente se realiza de manera presencial.

## Arquitectura del Proyecto
- **Frontend**: React con TypeScript, Material-UI para componentes
- **Backend**: Node.js con Express, MySQL con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de datos**: MySQL

## Público Objetivo
- Pacientes del hospital (diversas edades y niveles tecnológicos)
- Personal administrativo del hospital
- Médicos y especialistas

## Funcionalidades Principales
1. **Autenticación**: Registro e inicio de sesión por roles
2. **Gestión de Citas**: Crear, consultar, reprogramar y cancelar citas
3. **Gestión de Médicos**: Consultar especialidades y horarios disponibles
4. **Gestión de Pacientes**: Perfiles y historiales médicos
5. **Notificaciones**: SMS y email para confirmaciones
6. **Reportes**: Para personal administrativo

## Reglas de Desarrollo

### Frontend (React)
- Usar TypeScript para type safety
- Usar Material-UI para componentes consistentes
- Implementar responsive design para móviles
- Manejar estados con React Hooks
- Usar axios para comunicación con API

### Backend (Node.js)
- Usar Express para el servidor HTTP
- Implementar middleware de seguridad (helmet, cors)
- Usar Sequelize ORM para interacción con base de datos
- Implementar validación de datos con express-validator
- Manejar autenticación con JWT
- Usar bcryptjs para hash de contraseñas

### Base de Datos
- Usar convención snake_case para nombres de tablas y columnas
- Implementar timestamps (created_at, updated_at) en todas las tablas
- Usar foreign keys apropiadas para relaciones
- Implementar índices para mejorar performance

### Seguridad
- Validar todas las entradas del usuario
- Implementar rate limiting para APIs
- Usar HTTPS en producción
- Sanitizar datos antes de insertar en base de datos
- Implementar roles y permisos apropiados

### Usabilidad
- Diseñar interfaces intuitivas para usuarios con conocimientos básicos
- Implementar mensajes de error claros y útiles
- Proporcionar feedback visual para acciones del usuario
- Asegurar accesibilidad web (WCAG)

## Estructura de Directorios

### Backend (/backend)
```
src/
├── config/         # Configuraciones (database, etc.)
├── controllers/    # Lógica de controladores
├── middleware/     # Middlewares personalizados
├── models/         # Modelos de Sequelize
├── routes/         # Definición de rutas
└── services/       # Lógica de negocio
```

### Frontend (/frontend)
```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas principales
├── services/       # Servicios API
├── hooks/          # Custom hooks
├── utils/          # Utilidades
└── contexts/       # Context providers
```

## Estados de Cita
- PROGRAMADA: Cita creada pero no confirmada
- CONFIRMADA: Cita confirmada por el paciente
- CANCELADA: Cita cancelada
- REPROGRAMADA: Cita movida a nueva fecha/hora
- ATENDIDA: Cita completada
- NO_ASISTIO: Paciente no se presentó

## Roles de Usuario
- PACIENTE: Puede crear y gestionar sus propias citas
- MEDICO: Puede ver su agenda y gestionar disponibilidad
- ADMIN: Personal administrativo con acceso completo

## Consideraciones Especiales
- El sistema debe ser accesible para usuarios con conocimientos tecnológicos básicos
- Implementar notificaciones para recordar citas
- Considerar integración con sistemas de seguro médico
- Optimizar para dispositivos móviles (responsive design)
