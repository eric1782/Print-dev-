ESTRUCTURA DEL PROYECTO: 
masterbikes/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── controllers/
│   │   ├── #authController.js
│   │   └── #productController.js
│   ├── middlewares/
│   │   └── #authMiddleware.js
│   ├── models/
│   │   ├── #Product.js
│   │   └── #User.js
│   └── routes/
│       ├── #authRoutes.js
│       └── #productRoutes.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx
│       ├── api/
│       │   └── axiosConfig.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ProductModal.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           └── StockManagementPage.jsx
└── nginx/
    └── nginx.conf

todos los listos tendran un #


PROMPT PARA LA IA:
Actúa como un experto desarrollador full-stack. Necesito que generes el código completo para el Producto Mínimo Viable (PMV) de una aplicación web llamada 'MasterBikes', una empresa de servicios de arreglo, arriendo y venta de bicicletas.

Documento de Referencia del Proyecto: La propuesta del caso MasterBikes define el PMV de la siguiente manera:

Registro de Usuario (Cliente):

Los clientes podrán registrarse utilizando su correo electrónico y una contraseña.

Los clientes podrán iniciar sesión con su correo electrónico y contraseña.

Consulta y Gestión de Stock (para Técnicos y Vendedores):

Los usuarios con rol 'tecnico' o 'vendedores'podrán consultar el listado de productos y piezas.

Estos usuarios podrán agregar nuevos productos/piezas al stock (nombre, descripción, precio, stock).

Estos usuarios podrán editar la información de productos/piezas existentes, especialmente la cantidad en stock.

Estos usuarios podrán eliminar productos/piezas.

Actualización de Stock en Tiempo Real (para el sistema):

Cualquier cambio en la cantidad de un producto (por venta simulada, ajuste manual, etc., a través de la gestión de stock) debe reflejarse inmediatamente en la base de datos y, por ende, en las consultas subsecuentes.

Tecnologías a Utilizar:

Contenedores: Docker

Lenguaje/Frameworks:

Frontend: JavaScript, React, Vite, Tailwind CSS

Backend: JavaScript (Node.js con Express.js)

Base de Datos: MongoDB

Servidor Web/Reverse Proxy: Nginx

Requisitos Detallados para cada Componente del PMV:

Base de Datos (MongoDB):
Colección users:
email (String, unique, required, trim, lowercase)
password (String, required)
role (String, enum: ['cliente', 'tecnico', 'admin'], default: 'cliente')
name (String, opcional para este PMV pero bueno tenerlo)
createdAt, updatedAt (Timestamps)
Colección products:
name (String, required, unique)
description (String)
price (Number, required)
quantityInStock (Number, required, default: 0)
sku (String, opcional, unique)
category (String, opcional)
createdAt, updatedAt (Timestamps)
Backend (Node.js con Express.js):
Autenticación:
Ruta POST /api/auth/register: Registra un nuevo usuario (cliente por defecto). Hashear contraseña (bcryptjs).
Ruta POST /api/auth/login: Autentica al usuario. Devuelve un JSON Web Token (JWT) si es exitoso.
Ruta GET /api/auth/me (protegida): Devuelve información del usuario logueado (usando el JWT).
Gestión de Stock (CRUD para Productos) - Rutas protegidas (solo 'admin' o 'tecnico'):
Middleware protect: Verifica el JWT.
Middleware authorize(['admin', 'tecnico']): Verifica el rol del usuario.
Ruta POST /api/products: Crea un nuevo producto.
Ruta GET /api/products: Obtiene todos los productos (con paginación básica si es posible).
Ruta GET /api/products/:id: Obtiene un producto específico por ID.
Ruta PUT /api/products/:id: Actualiza un producto (especialmente quantityInStock, price, description).
Ruta DELETE /api/products/:id: Elimina un producto.
Estructura:
models/User.js, models/Product.js (Mongoose Schemas)
controllers/authController.js, controllers/productController.js
routes/authRoutes.js, routes/productRoutes.js
middlewares/authMiddleware.js (para protect y authorize)
server.js (o index.js): Configuración de Express, middlewares (cors, express.json), conexión a MongoDB, montaje de rutas.
Uso de dotenv para variables de entorno (MONGO_URI, JWT_SECRET, PORT).
Manejo básico de errores y respuestas JSON consistentes.
Frontend (React, Vite, Tailwind CSS):
Gestión de Estado Global:
Usar React Context API (o Zustand/Redux Toolkit si prefieres, pero Context es suficiente para este PMV) para manejar el estado de autenticación del usuario (token, datos del usuario, rol).
Páginas y Componentes:
HomePage.jsx: Página de bienvenida simple.
RegisterPage.jsx: Formulario de registro (email, password, confirm password). Llama a /api/auth/register.
LoginPage.jsx: Formulario de inicio de sesión (email, password). Llama a /api/auth/login. Almacena el JWT (localStorage) y actualiza el estado de autenticación.
StockManagementPage.jsx (Ruta protegida, visible solo para 'admin'/'tecnico'):
Muestra una tabla/lista de productos (GET /api/products).
Permite agregar nuevos productos (formulario modal o en la misma página) (POST /api/products).
Permite editar productos existentes (especialmente cantidad) (PUT /api/products/:id).
Permite eliminar productos (DELETE /api/products/:id).
Navbar.jsx:
Si no está logueado: Links a "Login", "Register".
Si está logueado como cliente: Link a "Logout".
Si está logueado como admin/tecnico: Links a "Gestión de Stock", "Logout".
Componentes reutilizables para formularios, inputs, botones con Tailwind CSS.
Routing: Usar react-router-dom para la navegación entre páginas y para proteger rutas (StockManagementPage).
Llamadas API: Usar axios (o fetch) para comunicarse con el backend. Crear un servicio base de axios con la URL base y manejo de token.
Estilos: Utilizar Tailwind CSS para todos los estilos. Asegurar que sea responsive.
Variables de entorno en Vite: VITE_API_BASE_URL=http://localhost/api (asumiendo que Nginx está en el puerto 80 del host).
Dockerización:
backend/Dockerfile: Basado en node:18-alpine, copia package.json, instala dependencias, copia el resto del código, expone el puerto del backend y ejecuta npm run dev (o npm start).
frontend/Dockerfile: Basado en node:18-alpine, copia package.json, instala dependencias, copia el resto del código, expone el puerto de Vite y ejecuta npm run dev.
docker-compose.yml:
Servicio mongo: Imagen oficial de MongoDB, volumen para persistencia, nombre de la base de datos (masterbikes).
Servicio backend: Construye desde ./backend, mapea puerto (e.g., 3001:3000), monta volumen para código fuente, define variables de entorno (MONGO_URI=mongodb://mongo:27017/masterbikes, JWT_SECRET, etc.), depende de mongo.
Servicio frontend: Construye desde ./frontend, mapea puerto (e.g., 5173:5173), monta volumen para código fuente, define CHOKIDAR_USEPOLLING=true, variable de entorno VITE_API_BASE_URL.
Servicio nginx: Imagen oficial de Nginx, mapea puerto (80:80), monta nginx/nginx.conf, depende de frontend y backend.
Define una red bridge personalizada (masterbikes-net).
nginx/nginx.conf:
Configuración básica de Nginx.
Reverse proxy para location /: Pasa al servicio frontend (servidor de desarrollo de Vite).
Reverse proxy para location /api/: Pasa al servicio backend.
Configuración para WebSockets si Vite los usa para HMR.
Instrucciones Adicionales para la Generación:

Proporciona el código completo para cada archivo, indicando claramente la ruta del archivo dentro de la estructura de directorios.

Incluye comentarios en el código para explicar la lógica clave.

Utiliza nombres de variables y funciones descriptivos.

Asegúrate de que el código sea funcional y siga las mejores prácticas para cada tecnología.

El backend debe manejar la creación del primer usuario 'admin' si no existe, o proporcionar un script/instrucción para ello. (Alternativamente, el primer usuario registrado puede ser promovido manualmente en la BD o se puede crear una ruta semilla protegida). Para el PMV, podemos asumir que el rol se asigna en el registro o se puede modificar directamente en la BD al principio.

Para la "Actualización de Stock en Tiempo Real", esto significa que las operaciones CRUD en el backend actualizan la BD, y el frontend debe re-obtener los datos o actualizar su estado local para reflejar estos cambios después de una operación exitosa (ej. después de editar la cantidad, refrescar la lista de productos).

Por favor, genera este PMV de manera completa y detallada. Si necesitas alguna aclaración antes de realizarlo, pregunta