# Sistema de Gestión de Citas Médicas
## Hospital Regional del Cusco

Sistema web completo para la gestión digital de citas médicas, desarrollado para modernizar el proceso de registro de citas que actualmente se realiza de manera presencial en el Hospital Regional del Cusco.

## 🏥 Descripción del Proyecto

Este sistema permite a los pacientes programar, consultar, reprogramar y cancelar citas médicas de forma digital, eliminando las largas colas y mejorando la experiencia del usuario. Está diseñado considerando que los usuarios tienen conocimientos tecnológicos básicos a medios.

### Público Objetivo
- **Pacientes**: Personas de diversas edades que necesitan agendar citas médicas
- **Personal Administrativo**: Gestión completa de citas y reportes
- **Médicos**: Consulta de agenda y gestión de disponibilidad

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes de interfaz
- **React Router** para navegación
- **Axios** para comunicación con API

### Backend
- **Node.js** con Express
- **MySQL** con Sequelize ORM
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **Nodemailer** para envío de emails

## 📁 Estructura del Proyecto

```
PAC/Fase_3/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── pages/      # Páginas principales
│   │   ├── components/ # Componentes reutilizables
│   │   └── services/   # Servicios API
│   └── package.json
├── backend/            # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
└── .github/
    └── copilot-instructions.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd PAC/Fase_3
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones de base de datos
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar Base de Datos
1. Crear base de datos MySQL:
```sql
CREATE DATABASE sistema_citas_medicas;
```

2. Configurar credenciales en `backend/.env`

## 🚀 Ejecución

### Desarrollo
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Producción
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 📋 Funcionalidades Principales

### ✅ Implementadas (MVP)
- [x] Página de inicio informativa
- [x] Sistema de login básico
- [x] Dashboard del paciente
- [x] API REST con endpoints básicos
- [x] Configuración de base de datos
- [x] Estructura de rutas del backend

### 🔄 En Desarrollo
- [ ] Registro de usuarios
- [ ] Gestión completa de citas (CRUD)
- [ ] Integración frontend-backend
- [ ] Autenticación JWT
- [ ] Sistema de notificaciones

### 📅 Próximas Funcionalidades
- [ ] Búsqueda de médicos por especialidad
- [ ] Calendario de disponibilidad
- [ ] Sistema de recordatorios
- [ ] Panel administrativo
- [ ] Reportes y estadísticas
- [ ] Integración con seguros médicos

## 🎯 Endpoints API Disponibles

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Citas
- `GET /api/citas` - Obtener citas
- `POST /api/citas` - Crear nueva cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Cancelar cita

### Médicos
- `GET /api/medicos` - Listar médicos
- `GET /api/medicos/:id` - Obtener médico específico
- `GET /api/medicos/:id/horarios` - Horarios disponibles

### Especialidades
- `GET /api/especialidades` - Listar especialidades
- `GET /api/especialidades/:id/medicos` - Médicos por especialidad

## 🔧 Configuración de Desarrollo

### Variables de Entorno (Backend)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sistema_citas_medicas
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
```

## 🧪 Testing

### Probar la API
```bash
# Endpoint de salud
curl http://localhost:5000/api/health

# Especialidades (datos de ejemplo)
curl http://localhost:5000/api/especialidades
```

### URLs de Testing
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 Páginas Disponibles

1. **Home** (`/`) - Página de inicio con información del sistema
2. **Login** (`/login`) - Formulario de inicio de sesión
3. **Dashboard** (`/dashboard`) - Panel de control del paciente

## 🎨 Diseño UI/UX

- **Tema**: Colores médicos (azul primario, rojo secundario)
- **Responsive**: Optimizado para móviles y escritorio
- **Accesibilidad**: Considerando usuarios con conocimientos básicos
- **Material Design**: Interfaz intuitiva y familiar

## 🔐 Seguridad

- Validación de datos en frontend y backend
- Encriptación de contraseñas con bcrypt
- Autenticación JWT
- CORS configurado
- Helmet para headers de seguridad

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado para el Hospital Regional del Cusco como parte del proyecto de modernización de servicios hospitalarios.

---

**Estado del Proyecto**: 🚧 En Desarrollo Activo

**Última Actualización**: Julio 2024
