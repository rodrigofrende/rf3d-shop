// Firebase Configuration - Configuración Completa
// Sigue estos pasos para configurar Firebase GRATIS:

// PASO 1: Crear Proyecto Firebase
// 1. Ve a https://console.firebase.google.com/
// 2. Haz clic en "Crear un proyecto"
// 3. Dale un nombre (ej: "pokemon-3d-shop")
// 4. Puedes desactivar Google Analytics
// 5. Haz clic en "Crear proyecto"

// PASO 2: Habilitar Autenticación
// 1. En el menú lateral, haz clic en "Authentication"
// 2. Haz clic en "Get started"
// 3. Ve a la pestaña "Sign-in method"
// 4. Haz clic en "Google" y actívalo
// 5. Configura tu correo de soporte
// 6. Haz clic en "Guardar"

// PASO 3: Crear Base de Datos
// 1. En el menú lateral, haz clic en "Firestore Database"
// 2. Haz clic en "Create database"
// 3. Selecciona "Start in test mode" (para desarrollo)
// 4. Elige la ubicación más cercana a tus usuarios
// 5. Haz clic en "Done"

// PASO 4: Habilitar Storage (opcional)
// 1. En el menú lateral, haz clic en "Storage"
// 2. Haz clic en "Get started"
// 3. Selecciona "Start in test mode"
// 4. Elige la misma ubicación que Firestore

// PASO 5: Obtener Configuración
// 1. Haz clic en el ícono de engranaje ⚙️ junto a "Project Overview"
// 2. Selecciona "Project settings"
// 3. Baja hasta "Your apps" y haz clic en el ícono web `</>`
// 4. Registra tu app con un nombre (ej: "3D Shop Web")
// 5. Copia la configuración y reemplaza los valores de abajo

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// PASO 6: Reglas de Seguridad (opcional pero recomendado)
// En Firestore Database > Rules, puedes usar estas reglas básicas:

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer productos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Usuarios pueden gestionar su propio carrito
    match /userCarts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usuarios pueden gestionar sus propios pedidos
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Usuarios pueden gestionar sus propios favoritos
    match /userFavorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
*/

// PASO 7: Estructura de la Base de Datos
// La aplicación creará automáticamente estas colecciones:
// - products: Productos de la tienda
// - userCarts: Carritos de los usuarios
// - orders: Pedidos de los usuarios
// - userFavorites: Favoritos de los usuarios

// PASO 8: Probar la Aplicación
// 1. Reemplaza los valores de arriba con tu configuración
// 2. Ejecuta: npm run dev
// 3. Ve a http://localhost:5173
// 4. Inicia sesión con Google
// 5. Ve a /admin para crear productos

// PLAN GRATUITO DE FIREBASE:
// ✅ Firestore: 1GB almacenamiento, 50k lecturas/día
// ✅ Authentication: Usuarios ilimitados
// ✅ Storage: 5GB almacenamiento
// ✅ Hosting: 10GB almacenamiento
// ✅ Todo completamente GRATIS para proyectos pequeños

// ¿Necesitas ayuda? Consulta la documentación oficial:
// https://firebase.google.com/docs/web/setup
