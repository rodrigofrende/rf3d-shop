# 🎨 3D Shop - Tienda de Productos 3D Impresos

Una aplicación web moderna y elegante para vender productos 3D impresos artesanalmente, construida con Vue 3, Vite y PrimeVue.

## ✨ Características

- 🚀 **Vue 3 + Vite** - Framework moderno y rápido
- 🎨 **PrimeVue** - Componentes UI elegantes y responsivos
- 🔐 **Autenticación con Google** - Login seguro usando Firebase
- 🛒 **Carrito de Compras** - Gestión completa de productos
- 📱 **Diseño Responsivo** - Funciona perfectamente en todos los dispositivos
- 🎯 **Filtros y Búsqueda** - Encuentra productos fácilmente
- 💳 **Integración con MercadoPago** - Pasarela de pagos (próximamente)
- 🌟 **Diseño Minimalista** - Interfaz limpia y elegante
- 🏠 **Retiro Local** - Productos disponibles para retirar en domicilio o punto común
- ❤️ **Hecho con Amor** - Cada producto impreso artesanalmente

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue 3, Vite, PrimeVue
- **Estado**: Pinia
- **Ruteo**: Vue Router
- **Autenticación**: Firebase Auth
- **Estilos**: CSS3 con diseño responsivo
- **Iconos**: PrimeIcons

## 📋 Prerrequisitos

- Node.js 20.19.0 o superior
- npm o yarn
- Cuenta de Firebase (para autenticación)

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd pokemon-3d-shop
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la autenticación con Google
   - Copia la configuración de tu proyecto
   - Edita `src/firebase-config.js` y reemplaza los valores

4. **Ejecuta la aplicación**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   - Ve a `http://localhost:5173`

## ⚙️ Configuración de Firebase (COMPLETAMENTE GRATIS)

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto"
3. Dale un nombre (ej: "pokemon-3d-shop")
4. Puedes desactivar Google Analytics
5. Haz clic en "Crear proyecto"

### 2. Configurar Autenticación
1. En el menú lateral, haz clic en "Authentication"
2. Haz clic en "Get started"
3. Ve a la pestaña "Sign-in method"
4. Haz clic en "Google" y actívalo
5. Configura tu correo de soporte
6. Haz clic en "Guardar"

### 3. Crear Base de Datos
1. En el menú lateral, haz clic en "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige la ubicación más cercana a tus usuarios
5. Haz clic en "Done"

### 4. Obtener Configuración
1. Haz clic en el ícono de engranaje ⚙️ junto a "Project Overview"
2. Selecciona "Project settings"
3. Baja hasta "Your apps" y haz clic en el ícono web `</>`
4. Registra tu app con un nombre (ej: "3D Shop Web")
5. Copia la configuración

### 5. Actualizar Archivo de Configuración
Edita `src/firebase-config.js` y reemplaza los valores:

```javascript
export const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
}
```

### 6. Reglas de Seguridad (Recomendado)
En Firestore Database > Rules, usa estas reglas básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /userCarts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /userFavorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📁 Estructura del Proyecto

```
pokemon-3d-shop/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── views/              # Páginas principales
│   │   ├── Home.vue        # Página de inicio
│   │   ├── Shop.vue        # Tienda de productos
│   │   ├── Cart.vue        # Carrito de compras
│   │   ├── Login.vue       # Página de login
│   │   └── Profile.vue     # Perfil del usuario
│   ├── stores/             # Stores de Pinia
│   │   ├── auth.js         # Store de autenticación
│   │   └── cart.js         # Store del carrito
│   ├── composables/        # Composables de Vue
│   ├── main.js             # Punto de entrada
│   ├── App.vue             # Componente principal
│   └── firebase-config.js  # Configuración de Firebase
├── public/                 # Archivos estáticos
├── package.json            # Dependencias del proyecto
└── README.md              # Este archivo
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Página de inicio con hero section
- [x] Tienda con filtros y búsqueda
- [x] Carrito de compras funcional
- [x] Autenticación con Google
- [x] Perfil de usuario
- [x] Diseño responsivo
- [x] Sistema de notificaciones
- [x] Gestión de favoritos
- [x] Historial de pedidos
- [x] **Panel de administración completo**
- [x] **Base de datos Firebase integrada**
- [x] **Gestión de productos desde Firebase**
- [x] **Sincronización de carrito en la nube**
- [x] **Sistema de favoritos persistente**

### 🚧 En Desarrollo
- [ ] Integración con MercadoPago
- [ ] Sistema de reseñas
- [ ] Chat en vivo
- [ ] Notificaciones push
- [ ] Panel de análisis de ventas

## 🎨 Personalización

### Panel de Administración
La aplicación incluye un **panel de administración completo** en `/admin` que te permite:

- **Crear productos** con formularios intuitivos
- **Editar productos** existentes
- **Eliminar productos** de forma segura
- **Ver todos los productos** en una tabla organizada
- **Buscar productos** por nombre o descripción
- **Crear productos de ejemplo** automáticamente
- **Gestionar stock** y precios
- **Configurar categorías** y tags

### Gestión de Productos
- **Sin tocar código**: Todo se gestiona desde la interfaz web
- **Base de datos en la nube**: Firebase Firestore
- **Sincronización automática**: Los cambios se reflejan inmediatamente
- **Imágenes**: Soporte para URLs de imágenes externas
- **Categorías**: Sistema de categorías predefinidas
- **Tags**: Etiquetas para búsquedas avanzadas
- **Stock**: Control de inventario para productos físicos
- **Entrega**: Productos disponibles para retirar en domicilio o punto común

### Colores y Temas
Los colores principales están definidos en CSS variables. Puedes personalizarlos editando los archivos de estilo:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ff6b6b;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
}
```

### Productos (Método Antiguo - Ya No Necesario)
**NOTA**: Ya no necesitas editar código para agregar productos. Usa el panel de administración en `/admin`.

Si quieres agregar productos programáticamente, puedes usar el servicio de Firebase:

```javascript
import FirebaseService from './services/firebaseService'

// Crear un producto
await FirebaseService.addProduct({
  name: 'Tu Producto 3D',
  description: 'Descripción del producto impreso en 3D',
  price: 29.99,
  category: 'tu-categoria',
  image: 'url-de-tu-imagen',
  rating: 5,
  reviewCount: 0,
  tags: ['tag1', 'tag2'],
  stock: 100,
  featured: true
})
```

## 🏠 Modelo de Negocio

### Productos Físicos Impresos en 3D
- **No vendemos archivos STL o modelos 3D digitales**
- **Cada producto es impreso físicamente** en nuestra impresora 3D
- **Calidad artesanal** - cada pieza es revisada y terminada a mano
- **Materiales de alta calidad** para durabilidad y acabado profesional

### Entrega y Retiro
- **Retiro local**: Los productos se retiran en nuestro domicilio o punto común acordado
- **Sin envíos por correo**: Ofrecemos un servicio personalizado y cercano
- **Tiempo de entrega**: Cada producto se imprime "con amor" - puede tomar algunos días
- **Contacto directo**: Coordinamos la entrega personalmente para mejor experiencia

### Ventajas del Modelo
- **Productos únicos**: Cada impresión es ligeramente diferente, haciéndola especial
- **Personalización**: Posibilidad de ajustar colores, tamaños y detalles
- **Soporte local**: Asistencia directa y personalizada
- **Sostenibilidad**: Control total sobre materiales y procesos

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- 📱 **Móviles** (320px - 768px)
- 💻 **Tablets** (768px - 1024px)
- 🖥️ **Desktop** (1024px+)

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Desplegar en Netlify
1. Haz push de tu código a GitHub
2. Conecta tu repositorio a Netlify
3. Configura las variables de entorno de Firebase
4. ¡Listo!

### Desplegar en Vercel
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Linting del código
```

## 🐛 Solución de Problemas

### Error de Firebase
- Verifica que tu configuración de Firebase sea correcta
- Asegúrate de que la autenticación con Google esté habilitada
- Revisa que tu dominio esté autorizado en Firebase

### Problemas de Estilos
- Verifica que PrimeVue esté correctamente importado
- Asegúrate de que los estilos de PrimeVue se carguen

### Errores de Ruteo
- Verifica que Vue Router esté configurado correctamente
- Asegúrate de que las rutas estén definidas en `main.js`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de Vue 3 y PrimeVue

## 🙏 Agradecimientos

- [Vue.js](https://vuejs.org/) - Framework progresivo
- [PrimeVue](https://primevue.org/) - Componentes UI
- [Firebase](https://firebase.google.com/) - Backend como servicio
- [Vite](https://vitejs.dev/) - Build tool moderno

---

**¡Disfruta creando tu tienda 3D! 🎉**
