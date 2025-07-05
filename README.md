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

## 🔗 API Integrada

Esta aplicación hace uso de la API pública de google, la cual nos permite el mostrar un mapa al momento de registrar una empresa
---

---

## 📝 Licencia

© 2025 - Proyecto académico desarrollado para la Universidad Internacional de La Rioja (UNIR).
