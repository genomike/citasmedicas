# Diagramas UML - Sistema de Gestión de Citas Médicas

Este directorio contiene los diagramas UML necesarios para el diseño de la aplicación de gestión de citas médicas del Hospital Regional del Cusco.

## Diagramas Incluidos

### 1. Diagrama de Casos de Uso (`casos_de_uso.puml`)
Define los diferentes casos de uso del sistema para cada tipo de actor:
- **Paciente**: Registro, búsqueda de médicos, programación de citas
- **Personal Administrativo**: Gestión completa de citas y reportes
- **Médico**: Consulta de agenda y gestión de disponibilidad

### 2. Diagrama de Clases (`diagrama_clases.puml`)
Muestra la estructura de clases del sistema con:
- Jerarquía de usuarios (Paciente, Médico, Personal Administrativo)
- Clases principales: Cita, Especialidad, HorarioAtencion
- Clases de soporte: SeguroMedico, Pago, Notificacion

### 3. Diagrama de Secuencia (`secuencia_registro_cita.puml`)
Detalla el flujo de interacciones para el proceso de registro de una cita médica, incluyendo:
- Autenticación del usuario
- Verificación de disponibilidad
- Validación de seguro médico
- Confirmación y notificación

### 4. Diagrama de Actividades (`diagrama_actividades.puml`)
Representa el flujo del proceso de negocio para el registro de citas, mostrando:
- Decisiones del sistema
- Flujos alternativos
- Validaciones requeridas

### 5. Diagrama Entidad-Relación (`diagrama_entidad_relacion.puml`)
Define la estructura de la base de datos con:
- 11 entidades principales
- Relaciones entre entidades
- Claves primarias y foráneas
- Tipos de datos y restricciones

### 6. Diagrama de Componentes (`diagrama_componentes.puml`)
Muestra la arquitectura del sistema en capas:
- Capa de Presentación (Web/Móvil)
- Capa de Negocio (Servicios)
- Capa de Datos (Repositorios)
- Servicios Externos

### 7. Diagrama de Despliegue (`diagrama_despliegue.puml`)
Define la infraestructura técnica necesaria:
- Servidores web con balanceador de carga
- Base de datos con réplica
- Servidor de cache Redis
- Integración con servicios externos

## Cómo Visualizar los Diagramas

### Opción 1: VS Code con PlantUML Extension
1. Instalar la extensión "PlantUML" en VS Code
2. Abrir cualquier archivo `.puml`
3. Usar `Ctrl+Shift+P` y ejecutar "PlantUML: Preview Current Diagram"

### Opción 2: PlantUML Online
1. Ir a http://www.plantuml.com/plantuml/uml/
2. Copiar el contenido del archivo `.puml`
3. Pegar en el editor online

### Opción 3: PlantUML Local
1. Instalar Java y PlantUML
2. Ejecutar: `java -jar plantuml.jar archivo.puml`

## Consideraciones de Diseño

### Seguridad
- Autenticación basada en roles
- Encriptación de contraseñas
- Validación de acceso por tipo de usuario

### Escalabilidad
- Arquitectura en capas separadas
- Cache Redis para optimizar consultas
- Réplica de base de datos para lectura

### Usabilidad
- Interfaz intuitiva para usuarios con conocimientos básicos
- Notificaciones automáticas por SMS/Email
- Acceso desde web y móvil

### Integración
- API REST para comunicación entre capas
- Integración con servicios externos (SMS, Email, Pagos)
- Validación automática de seguros médicos

## Tecnologías Sugeridas

### Frontend
- **Web**: React.js o Vue.js
- **Móvil**: React Native o Flutter

### Backend
- **API**: Node.js con Express o Spring Boot (Java)
- **Base de Datos**: MySQL 8.0+
- **Cache**: Redis

### Infraestructura
- **Balanceador**: Nginx
- **Contenedores**: Docker
- **Nube**: AWS, Google Cloud o Azure

## Próximos Pasos

1. **Fase 3**: Implementación del prototipo
2. **Fase 4**: Desarrollo completo
3. **Fase 5**: Pruebas y despliegue

Este diseño UML proporciona una base sólida para el desarrollo de la aplicación, considerando las necesidades específicas del Hospital Regional del Cusco y las características del público objetivo identificado.
