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
## 📝 Herramientas implementadas
- Tailwind css
- React y Vite
- Firebase
- Javascript

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

Viajar en tu navegador de preferencia a: `http://localhost:5173`

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

## 🔗 API Integrada

Esta aplicación hace uso de la API pública de google, la cual nos permite el mostrar un mapa al momento de registrar la ubicacion de una empresa, directamente tomando la direccion de esta y mostrandola en un mapa de referencia.
---

---

## 📝 Licencia

© 2025 - MIT License.
Copyright (c) 2025 PrintDev

Se concede permiso por la presente, sin cargo, a cualquier persona que obtenga una copia de este software y los archivos de documentación asociados (el "Software"), para tratar el Software sin restricciones, incluyendo sin limitación los derechos de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y permitir a las personas a quienes se proporcione el Software que lo hagan, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES POR NINGUNA RECLAMACIÓN, DAÑOS U OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN CONTRACTUAL, AGRAVIO O DE OTRO TIPO, DERIVADA DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTROS TRATOS EN EL SOFTWARE.
