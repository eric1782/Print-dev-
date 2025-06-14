Somos un equipo de estudiantes de Ingenieria en Informatica del Instituto Profesional DUOC UC, llamado Print("DEV") o simplemente DEV.
Estamos trabajando en el desarollo de una pagina web, que busca ofrecer un lugar para empresas y pymes, donde estas pueden publicar sus servicios y manegar sus agendas.
El desarrollo de la pagina web esta en proceso, pero actualmente este repositorio incluye:
- Avances del proceso del desarrollo por semanas
- Avance actual del codigo que maneja la pagina web

Para hacer que el programa actual funcione es necesario tener las siguientes herramientas implementadas en visual code con la version defifida dentro de yo-te-agendo-final/package.json :
- Tailwind
- React.js
- Node.js
- Vite

Para correr el codigo puedes el clonar este repositorio en tu escritorio, asegurate de estar dentro de la carpeta yo-te-agendo-final, y corre npm run dev


# 📚 YoTeAgendo – Frontend, backend y base de datos

Aplicación web desarrollada como parte del proyecto evaluado en clase GitHub (MICROSOFT LEARN). Este repositorio contiene el frontend y backend del proyecto, con el frontend construido con React y herramientas como Vite para un desarrollo rápido, Tailwind CSS para un diseño responsivo y modular, y React Router DOM para la gestión de rutas.
El backend de la aplicación, que gestiona la lógica de negocio, se conecta a una base de datos en Firebase para la persistencia de datos. Se han seguido buenas prácticas en la creación de componentes, rutas y diseño responsivo, asegurando la funcionalidad integral del sistema.

---

## 🚀 Objetivo del Proyecto

Desarrollar una plataforma web integral que facilite la gestión de servicios y agendas para empresas, al tiempo que optimiza la experiencia de agendamiento para sus clientes. El sistema busca establecer un punto de encuentro confiable y de fácil acceso para ambas partes, permitiendo:

* Optimizar la oferta de servicios y la organización de agendas por parte de las empresas.
* Simplificar el proceso de reserva para los clientes, permitiendo la agendación de citas o servicios de manera eficiente.
* Potenciar la búsqueda y descubrimiento de servicios, permitiendo a los usuarios encontrar empresas y ofertas que se ajusten precisamente a sus requisitos.

---

## 🧩 Estructura del Proyecto

```
yo-te-agendo-final/
│
├── nodemodules/          |# Librerias y dependencias
├── public/               |# Archivos estaticos
├── src/                  |# Directorio principal
│   ├── assets/             |# no puedo abrir este, comentar despues
│   ├── components/         |# Componenter reutilizables (Header, footer, etc.)
│   ├── pages/              |# Vistas/Paginas que se mostraran (Landing, Logins, Registros, Homes, etc.)
│   ├── App.css             |# Estilos generales de Tailwind usados en app (general)
│   ├── App.jsx             |# Orden de la interfaz de usuario
│   ├── index.css           |# Configuracion base Tailwind
│   └── main.jsx            |# Inicializacion React
├── .gitignore            |# Orden de archivos que git ignorara
├── eslint.config.js      |# Revisa errores de sintaxis
├── index.html            |# Html principal de app
├── package-lock.json     |# Registra versiones de dependencias
├── package.json          |# Define proyecto y dependencias    
├── postcss.config.js     |# Configuracion de PostCSS     
├── README.md             |# Informacion de react + vite
├── tailwind.config.js    |# Configuracion principal de Tailwind para el proyecto
└── vite.config.js        |# Configuracion de Vite
```

---

## 🛠️ Instalación local

Para clonar y ejecutar este proyecto en tu entorno local:

```bash
git clone https://github.com/eric1782/Print-dev-
cd yo-te-agendo-final
npm install
npm run dev
```

Abrir en navegador: `http://localhost:5173`

---

## 👥 Equipo de Desarrollo

| Nombre                          | 
| ------------------------------- |
| **Diego Carrillo Webar**        |
| **Eric Saavedra Maldonado**     |

---

## 🧱 Fases del Proyecto

### 🟦 FASE 1 – Planificación y creacion del mockup (semana 1 a 6)

* Planificacion de requisitos a cumplir por la aplicacion web
* Definicion de aspecto visual para el proyecto (reflejado en el mockup)
* Aprendizaje personal enfocado a aspectos implementables en el proyecto
* Creacion del mockup con las funciones principales del proyecto

---

### 🟨 FASE 2 – Desarrollo de aplicacion web directa (semana 6 a actual)

* Desarrollo de funcionalidades planteadas en el mockup
* Creación de vistas responsivas: landingpage, homes, inicios de sesion, registros, etc.
* Coordinación de diseño modificado con la implementacion de una nueva base a seguir visual
* Implementacion de base de datos externa (firebase)

---

### 🟧 FASE 3 – despliegue (futuro...)

---

## 🎯 Funcionalidades Mínimas (NO DEFINIDO TODAVIA, INFORMACION TEMPORAL DE RELLENO)

* ✅ **Landing page con redirección automática tras 5 segundos**
* ✅ **Vista principal con barra de búsqueda (filtrado por título)**
* ✅ **Vista de detalle del libro (BookDetail) con datos completos y HTML enriquecido**
* ✅ **Carrito persistente (localStorage) con posibilidad de eliminar elementos**
* ✅ **Vista de checkout con resumen, botón de confirmación y redirección**
* ✅ **Integración de React Router con rutas declarativas y dinámicas (`/book/:id`)**
* ✅ **Custom hook funcional (`useGoogleBooks`) y context global (`useCart`)**
* ✅ **Integración de API pública: Google Books API para cargar resultados reales**

---

## 🔗 API Integrada

Esta aplicación hace uso de la API pública de **Google Books**:

* Documentación: [https://developers.google.com/books/docs/v1/using](https://developers.google.com/books/docs/v1/using)
* Endpoint utilizado: `https://www.googleapis.com/books/v1/volumes?q=`

El hook personalizado `useGoogleBooks()` realiza peticiones a esta API en tiempo real y carga:

* Título del libro
* Autor/es
* Imagen
* Descripción HTML
* Páginas, editorial, calificaciones, categorías y más

---

## 🌐 Despliegue

* 🔗 URL del sitio en producción: [https://relatos-de-papel-frontend-full-satck.vercel.app](https://relatos-de-papel-frontend-full-satck.vercel.app)
* Plataforma utilizada: **Vercel**

---

## 📊 Evaluación por criterios (UNIR)

| Criterio | Descripción                        | Puntos | Cumplido                                           |
| -------- | ---------------------------------- | ------ | -------------------------------------------------- |
| C1       | 10 componentes funcionales con JSX | 0.5    | ✅                                                  |
| C2       | Uso de `useState` y `useEffect`    | 0.5    | ✅                                                  |
| C3       | Custom Hook implementado y en uso  | 1.0    | ✅ `useGoogleBooks`                                 |
| C4       | Uso correcto de React Router       | 1.0    | ✅ con rutas `/`, `/home`, `/book/:id`, `/checkout` |
| C5       | Estilo con CSS y metodología BEM   | 1.0    | ✅ con Tailwind + clases BEM en base CSS            |
| C6       | Vistas completas y funcionales     | 4.5    | ✅                                                  |

---

## 📝 Licencia

© 2025 - Proyecto académico desarrollado para la Universidad Internacional de La Rioja (UNIR).
