# 🔥 Configuración de Firebase - Variables de Entorno

## ⚠️ IMPORTANTE: Seguridad

**NUNCA subas tus credenciales reales de Firebase a un repositorio público.**

## 📋 Pasos para Configurar

### 1. Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 2. Verificar .gitignore

Asegúrate de que tu `.gitignore` incluya:

```gitignore
*.local
.env.local
.env.production
```

### 3. Reiniciar el servidor

Después de crear `.env.local`, reinicia tu servidor de desarrollo:

```bash
npm run dev
```

## 🔑 Obtener Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a Configuración del Proyecto (⚙️)
4. En la pestaña "General", busca "Tus apps"
5. Selecciona tu app web
6. Copia la configuración

## 🚨 Si ya subiste credenciales

1. **Cambia inmediatamente las claves** en Firebase Console
2. **Elimina el historial** del repositorio
3. **Implementa variables de entorno** (ya hecho)
4. **Verifica que .env.local esté en .gitignore**

## ✅ Verificación

Para verificar que todo funciona:

1. Crea `.env.local` con tus credenciales
2. Reinicia el servidor
3. Abre la consola del navegador
4. No deberías ver errores de Firebase
5. La autenticación debería funcionar
