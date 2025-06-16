<!-- Badges -->
<p align="center">
  <a href="https://sonarcloud.io/summary/new_code?id=davidc-garciae_CourierSync">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=alert_status" alt="Quality Gate Status"/>
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=reliability_rating" alt="Reliability Rating"/>
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=security_rating" alt="Security Rating"/>
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=sqale_rating" alt="Maintainability Rating"/>
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=sqale_index" alt="Technical Debt"/>
    <img src="https://sonarcloud.io/api/project_badges/measure?project=davidc-garciae_CourierSync&metric=vulnerabilities" alt="Vulnerabilities"/>
  </a>
</p>

# Dashboard Administrativo Next.js + Tailwind (Atomic Design)

Este proyecto es un dashboard administrativo avanzado construido con Next.js 15, TypeScript y Tailwind CSS, siguiendo la metodología Atomic Design. Presenta una arquitectura escalable para gestión de usuarios, pedidos, promociones y análisis de satisfacción, con una experiencia de usuario moderna, accesibilidad mejorada y despliegue automático.

## Tabla de Contenidos

- [Arquitectura y Funcionamiento](#arquitectura-y-funcionamiento)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso y Flujos Principales](#uso-y-flujos-principales)
- [Despliegue Automático](#despliegue-automático)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Arquitectura y Funcionamiento

### Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Dashboard Usuario] --> B[Componentes Atomic Design]
        C[Dashboard Admin] --> B
        B --> D[Atoms]
        B --> E[Molecules]
        B --> F[Organisms]

        D --> G[Buttons, Inputs, Icons]
        E --> H[Cards, Dropdowns, Selects]
        F --> I[Sidebar, Header, Sheets]
    end

    subgraph "Estado y Datos"
        J[Hooks Personalizados] --> K[Mock Data]
        J --> L[Auth Session]
        J --> M[User Profile]
    end

    subgraph "Despliegue"
        N[GitHub Actions] --> O[Vercel]
        P[SonarCloud] --> Q[Code Quality]
    end

    A --> J
    C --> J
    N --> A
    N --> C
```

### Flujo de Navegación del Usuario

```mermaid
flowchart TD
    A[Inicio de Sesión] --> B{¿Tipo de Usuario?}

    B -->|Usuario Regular| C[Dashboard Cliente]
    B -->|Administrador| D[Dashboard Admin]

    C --> E[Mis Compras]
    C --> F[Perfil Personal]
    C --> G[Promociones]

    D --> H[Búsqueda de Personas]
    D --> I[Búsqueda de Pedidos]
    D --> J[Panel de Control]

    H --> K[Detalle de Persona]
    K --> L[Historial de Compras]
    K --> M[Editar Información]
    K --> N[Agregar Comentarios]

    I --> O[Detalle de Pedido]
    O --> P[Cambiar Estado]
    O --> Q[Agregar Comentarios]

    style A fill:#e1f5fe
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

### Arquitectura de Componentes (Atomic Design)

```mermaid
graph LR
    subgraph "Atoms"
        A1[Button] --> A2[Input]
        A2 --> A3[Label]
        A3 --> A4[Avatar]
        A4 --> A5[Skeleton]
    end

    subgraph "Molecules"
        M1[Card] --> M2[Dropdown Menu]
        M2 --> M3[User Menu]
        M3 --> M4[Color Theme Select]
        M4 --> M5[Profile Avatar]
    end

    subgraph "Organisms"
        O1[Sidebar] --> O2[Header]
        O2 --> O3[App Sidebar]
        O3 --> O4[Sheets]
        O4 --> O5[Tables]
    end

    A1 --> M1
    A2 --> M1
    A3 --> M3
    A4 --> M5
    A5 --> O1

    M1 --> O1
    M2 --> O2
    M3 --> O3
    M4 --> O2
    M5 --> O3
```

### Flujo de Gestión de Estados

```mermaid
stateDiagram-v2
    [*] --> Inicial

    Inicial --> Autenticando: Usuario ingresa credenciales
    Autenticando --> Autenticado: Credenciales válidas
    Autenticando --> Error: Credenciales inválidas

    Autenticado --> DashboardCliente: Rol = Cliente
    Autenticado --> DashboardAdmin: Rol = Admin

    DashboardCliente --> VerPerfil: Navegar a perfil
    DashboardCliente --> VerPromociones: Ver promociones
    DashboardCliente --> VerHistorial: Ver historial compras

    DashboardAdmin --> BuscarPersonas: Buscar usuarios
    DashboardAdmin --> BuscarPedidos: Buscar pedidos
    DashboardAdmin --> VerDashboard: Ver métricas

    BuscarPersonas --> DetallePersona: Seleccionar persona
    DetallePersona --> EditarPersona: Editar información
    DetallePersona --> VerHistorialPersona: Ver historial
    DetallePersona --> AgregarComentario: Agregar comentario

    BuscarPedidos --> DetallePedido: Seleccionar pedido
    DetallePedido --> CambiarEstado: Cambiar estado
    DetallePedido --> AgregarComentarioPedido: Agregar comentario

    Error --> Inicial: Reintentar
    VerPerfil --> DashboardCliente: Volver
    EditarPersona --> DetallePersona: Guardar cambios
    CambiarEstado --> DetallePedido: Actualizar estado
```

### Flujo de Datos y Hooks

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Componente
    participant H as Hook
    participant M as Mock Data
    participant S as Estado Local

    U->>C: Interacción (click, input)
    C->>H: Llamada a hook personalizado
    H->>M: Solicitud de datos mock
    M-->>H: Datos simulados
    H->>S: Actualización de estado
    S-->>H: Estado actualizado
    H-->>C: Datos procesados
    C-->>U: UI actualizada

    Note over H,M: useAuth, useUserProfile, usePromociones
    Note over S: Loading, Error, Success states
```

## Características

- **Atomic Design:** Componentes atómicos, moleculares y organismos reutilizables.
- **Gestión de usuarios y pedidos:** Búsqueda, edición, historial, comentarios y cambio de estado.
- **Sheets atómicos:** Para comentarios, edición de estado, perfil, contraseña y registro.
- **Feedback visual:** Skeletons, toasts personalizados, animaciones en íconos (Tailwind + Radix).
- **Manejo de errores diferenciado:** 404 vs. error de carga, con reintento solo cuando aplica.
- **Breadcrumbs dinámicos** y navegación clara.
- **Despliegue automático en Vercel** vía GitHub Actions.
- **Documentación clara** y estructura profesional lista para conectar a backend real.

## Estructura del Proyecto

- `src/components/atoms/`: Elementos básicos (botones, inputs, íconos, skeletons, etc.)
- `src/components/molecules/`: Combinaciones de átomos (select, sidebar, cards, etc.)
- `src/components/organisms/`: Sheets, tablas, sidebar, header, etc.
- `src/app/`: Rutas y layouts principales (admin, dashboard, etc.)
- `.github/workflows/`: Workflows de CI/CD para despliegue automático.

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- npm o pnpm

### Pasos

1. Clona el repositorio:
   ```
   git clone <repository-url>
   ```
2. Entra al directorio del proyecto:
   ```
   cd CourierSync
   ```
3. Instala las dependencias:
   ```
   npm install
   # o
   pnpm install
   ```

## Uso y Flujos Principales

- Inicia el servidor de desarrollo:
  ```
  npnm run dev
  ```
  Accede a `http://localhost:3000`.
- Explora el dashboard administrativo, busca usuarios/pedidos, edita estados, agrega comentarios y navega entre perfiles.
- Sheets reutilizables para edición y comentarios.
- Feedback visual inmediato y manejo de errores robusto.

## Despliegue Automático

- El proyecto se despliega automáticamente en Vercel usando GitHub Actions (`.github/workflows/deploy-vercel.yml`).
- **Secrets requeridos:**
  - `VERCEL_TOKEN`: Token de acceso de Vercel.
  - `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`: IDs de organización y proyecto en Vercel.
- Configura estos secrets en tu repositorio para habilitar el despliegue automático.

## Contribución

- Forkea el repositorio y envía un Pull Request.
- Sigue la estructura atómica y las buenas prácticas del proyecto.
- (Opcional) Agrega tests automáticos o integra con un backend real.

## Licencia

MIT. Ver archivo LICENSE.

---

### Información adicional

- El sheet de información general (`AppInfoSheet`) en la pantalla de inicio explica el estado de desarrollo y credenciales de prueba.
- Los íconos y animaciones están personalizados para una mejor experiencia visual.
- El proyecto está listo para escalar y conectar a servicios reales.
