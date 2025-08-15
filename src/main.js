import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// PrimeIcons CSS - Importación correcta para Vite
import 'primeicons/primeicons.css'

// Estilos base del sistema de diseño
import './assets/base.css'
// Correcciones de contraste para mejorar la legibilidad
import './assets/contrast-fixes.css'
// Mejoras específicas para componentes PrimeVue
import './assets/primevue-overrides.css'
// Mejoras específicas para la tienda
import './assets/shop-enhancements.css'

// PrimeVue v4 - Los estilos se importan automáticamente
// No necesitamos importar CSS manualmente en v4

import App from './App.vue'
import Home from './views/Home.vue'
import Shop from './views/Shop.vue'
import Cart from './views/Cart.vue'
import Login from './views/Login.vue'
import Profile from './views/Profile.vue'
import Admin from './views/Admin.vue'

// Firebase configuration
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from './firebase-config'

// Initialize Firebase - Solo si no está ya inicializado
let firebaseApp
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp = getApps()[0]
}

export const auth = getAuth(firebaseApp)

// Router configuration
const routes = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/cart', component: Cart },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount app
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'outlined'
})
app.use(ToastService)

app.mount('#app')
