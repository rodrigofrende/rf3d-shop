<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

// PrimeVue Components
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import AuthLoader from './components/AuthLoader.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const userMenu = ref()

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event)
}

const userMenuItems = computed(() => [
  {
    label: 'Mi Perfil',
    icon: 'pi pi-user',
    command: () => router.push('/profile')
  },
  {
    label: 'Mis Pedidos',
    icon: 'pi pi-shopping-bag',
    command: () => router.push('/profile')
  },
  {
    label: 'Favoritos',
    icon: 'pi pi-heart',
    command: () => router.push('/profile')
  },
  {
    label: 'Administración',
    icon: 'pi pi-cog',
    command: () => router.push('/admin'),
    visible: authStore.isAdmin
  },
  {
    separator: true
  },
  {
    label: 'Cerrar Sesión',
    icon: 'pi pi-sign-out',
    command: () => authStore.signOut()
  }
])

const subscribeNewsletter = () => {
  console.log('Suscripción al newsletter')
}
</script>

<template>
  <div id="app-layout">
    <AuthLoader />
    <Toast />
    
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/" class="logo">
            <div class="logo-icon">
              <i class="pi pi-cube"></i>
            </div>
            <div class="logo-text">
              <span class="logo-title">3D Shop</span>
              <span class="logo-subtitle">Productos 3D Impresos</span>
            </div>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <router-link to="/" class="nav-link">
            <i class="pi pi-home"></i>
            <span>Inicio</span>
          </router-link>
          <router-link to="/shop" class="nav-link">
            <i class="pi pi-shopping-bag"></i>
            <span>Tienda</span>
          </router-link>
          <router-link to="/cart" class="nav-link cart-link">
            <i class="pi pi-shopping-cart"></i>
            <span>Carrito</span>
            <Badge 
              v-if="cartStore.itemCount > 0" 
              :value="cartStore.itemCount" 
              severity="danger"
              class="cart-badge"
            />
          </router-link>
        </nav>
        
        <div class="header-right">
          <template v-if="authStore.isAuthenticated">
            <div class="user-section">
              <Button
                type="button"
                :label="authStore.userDisplayName"
                icon="pi pi-user"
                class="p-button-text p-button-secondary user-button"
                @click="toggleUserMenu"
                aria-haspopup="true"
                aria-controls="overlay_menu"
              />
              <Menu 
                ref="userMenu" 
                id="overlay_menu" 
                :model="userMenuItems" 
                :popup="true"
                class="user-menu"
              />
            </div>
          </template>
          <template v-else>
            <div class="auth-buttons">
              <Button 
                label="Iniciar Sesión" 
                icon="pi pi-sign-in" 
                class="p-button-outlined p-button-primary"
                @click="router.push('/login')"
              />
              <Button 
                label="Registrarse" 
                icon="pi pi-user-plus" 
                class="p-button-primary"
                @click="router.push('/login')"
              />
            </div>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-sections">
          <div class="footer-section">
            <div class="footer-logo">
              <div class="footer-logo-icon">
                <i class="pi pi-cube"></i>
              </div>
              <div class="footer-logo-text">
                <h3>3D Shop</h3>
                <p>Modelos 3D de calidad profesional</p>
              </div>
            </div>
            <p class="footer-description">
              Descubre nuestra colección exclusiva de modelos 3D únicos para impresión, 
              diseño y desarrollo de proyectos creativos.
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Enlaces Rápidos</h4>
            <ul class="footer-links">
              <li><router-link to="/">Inicio</router-link></li>
              <li><router-link to="/shop">Tienda</router-link></li>
              <li><router-link to="/cart">Carrito</router-link></li>
              <li><router-link to="/profile">Mi Perfil</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Categorías</h4>
            <ul class="footer-links">
              <li><router-link to="/shop?category=pokemon">Pokemon</router-link></li>
              <li><router-link to="/shop?category=anime">Anime</router-link></li>
              <li><router-link to="/shop?category=fantasy">Fantasy</router-link></li>
              <li><router-link to="/shop?category=gaming">Gaming</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Soporte</h4>
            <ul class="footer-links">
              <li><a href="#help">Centro de Ayuda</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#shipping">Envíos</a></li>
              <li><a href="#returns">Devoluciones</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Síguenos</h4>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <i class="pi pi-youtube"></i>
              </a>
            </div>
            <div class="newsletter">
              <h5>Newsletter</h5>
              <p>Suscríbete para recibir ofertas exclusivas</p>
              <div class="newsletter-input">
                <InputText 
                  placeholder="Tu email" 
                  class="newsletter-field"
                />
                <Button 
                  icon="pi pi-send" 
                  class="p-button-sm p-button-primary"
                  @click="subscribeNewsletter"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">
              &copy; 2024 3D Shop. Todos los derechos reservados.
            </p>
            <div class="footer-bottom-links">
              <a href="#privacy">Privacidad</a>
              <a href="#terms">Términos</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-6);
  height: 80px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-normal);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.logo-subtitle {
  font-size: var(--font-size-xs);
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* Navigation */
.main-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color);
  background: var(--color-gray-50);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  background: var(--color-primary);
  background: rgba(102, 126, 234, 0.1);
}

.nav-link i {
  font-size: 1.1rem;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  font-size: 0.75rem;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.user-section {
  position: relative;
}

.user-button {
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.user-button:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.user-menu {
  min-width: 220px;
  z-index: var(--z-dropdown);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-3);
}

/* Main Content */
.app-main {
  flex: 1;
  min-height: calc(100vh - 80px - 400px); /* Adjust based on header and footer height */
}

/* Footer */
.app-footer {
  background: var(--color-gray-900);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-8);
  padding: var(--spacing-16) 0 var(--spacing-8) 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.footer-logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.footer-logo-text h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-1) 0;
}

.footer-logo-text p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-400);
  margin: 0;
}

.footer-description {
  color: var(--color-gray-400);
  line-height: 1.6;
  font-size: var(--font-size-sm);
}

.footer-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: white;
  margin: 0 0 var(--spacing-3) 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.footer-links li a {
  color: #9ca3af;
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: 500;
}

.footer-links li a:hover {
  color: #2563eb;
}

.social-links {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--color-gray-800);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.newsletter h5 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-2) 0;
}

.newsletter p {
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-3) 0;
}

.newsletter-input {
  display: flex;
  gap: var(--spacing-2);
}

.newsletter-field {
  flex: 1;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid var(--color-gray-800);
  padding: var(--spacing-6) 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

.copyright {
  color: #9ca3af;
  font-size: var(--font-size-sm);
  margin: 0;
  font-weight: 500;
}

.footer-bottom-links {
  display: flex;
  gap: var(--spacing-4);
}

.footer-bottom-links a {
  color: #9ca3af;
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-normal);
  font-weight: 500;
}

.footer-bottom-links a:hover {
  color: #2563eb;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    height: 70px;
  }
  
  .main-nav {
    gap: var(--spacing-4);
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link {
    padding: var(--spacing-2);
    justify-content: center;
  }
  
  .footer-sections {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-6);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: var(--spacing-4);
    gap: var(--spacing-4);
  }
  
  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .header-right {
    order: 2;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: var(--spacing-2);
  }
  
  .footer-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
    padding: var(--spacing-12) 0 var(--spacing-6) 0;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-3);
  }
  
  .footer-bottom-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .main-nav {
    gap: var(--spacing-2);
  }
  
  .nav-link {
    padding: var(--spacing-2);
    min-width: 44px;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .newsletter-input {
    flex-direction: column;
  }
}
</style>
