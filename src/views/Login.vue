<template>
  <div class="login">
    <div class="login-container">
      <!-- Login Form -->
      <div class="login-form">
        <div class="form-header">
          <div class="logo">
            <i class="pi pi-cube"></i>
            <h1>3D Shop</h1>
          </div>
          <h2>Bienvenido de vuelta</h2>
          <p>Inicia sesión para acceder a tu cuenta y continuar comprando</p>
        </div>

        <div class="auth-options">
          <Button 
            label="Continuar con Google" 
            icon="pi pi-google" 
            class="p-button-lg google-btn"
            @click="signInWithGoogle"
            :loading="authStore.loading"
            :disabled="authStore.loading"
          />
          
          <div class="divider">
            <span>o</span>
          </div>
          
          <div class="guest-option">
            <p>¿No tienes cuenta?</p>
            <Button 
              label="Continuar como Invitado" 
              icon="pi pi-user" 
              class="p-button-outlined"
              @click="continueAsGuest"
            />
          </div>
        </div>

        <div class="features-preview">
          <h3>¿Por qué crear una cuenta?</h3>
          <div class="features-list">
            <div class="feature-item">
              <i class="pi pi-shopping-cart"></i>
              <span>Guarda tu carrito para más tarde</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-heart"></i>
              <span>Lista de productos favoritos</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-clock"></i>
              <span>Historial de pedidos</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-bell"></i>
              <span>Notificaciones de ofertas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Visual Side -->
      <div class="login-visual">
        <div class="visual-content">
          <div class="floating-elements">
            <div class="element element-1">
              <i class="pi pi-cube"></i>
            </div>
            <div class="element element-2">
              <i class="pi pi-star"></i>
            </div>
            <div class="element element-3">
              <i class="pi pi-heart"></i>
            </div>
            <div class="element element-4">
              <i class="pi pi-shopping-bag"></i>
            </div>
          </div>
          
          <div class="welcome-text">
            <h2>Descubre el Mundo 3D</h2>
            <p>Accede a nuestra exclusiva colección de productos 3D únicos impresos artesanalmente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Methods
const signInWithGoogle = async () => {
  try {
    const result = await authStore.signInWithGoogle()
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: `Hola ${result.user.displayName}, has iniciado sesión exitosamente`,
        life: 4000
      })
      
      // Redirect to home or intended page
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error de Autenticación',
        detail: result.error || 'No se pudo iniciar sesión con Google',
        life: 5000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error inesperado',
      life: 5000
    })
  }
}

const continueAsGuest = () => {
  toast.add({
    severity: 'info',
    summary: 'Modo Invitado',
    detail: 'Puedes explorar la tienda, pero algunas funciones estarán limitadas',
    life: 4000
  })
  
  setTimeout(() => {
    router.push('/')
  }, 1000)
}

// Lifecycle
onMounted(() => {
  // Initialize auth
  authStore.initAuth()
  
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.login-form {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.logo i {
  font-size: 2rem;
  color: #667eea;
}

.logo h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
}

.form-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
}

.auth-options {
  margin-bottom: 2rem;
}

.google-btn {
  width: 100%;
  background: #4285f4;
  border-color: #4285f4;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.google-btn:hover {
  background: #3367d6;
  border-color: #3367d6;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.guest-option {
  text-align: center;
}

.guest-option p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.features-preview {
  margin-top: auto;
}

.features-preview h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.feature-item:hover {
  background: #e9ecef;
}

.feature-item i {
  color: #667eea;
  font-size: 1.1rem;
}

.feature-item span {
  color: #495057;
  font-size: 0.9rem;
}

.login-visual {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.element {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.element-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 4s;
}

.element-4 {
  top: 40%;
  right: 40%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.welcome-text {
  position: relative;
  z-index: 2;
}

.welcome-text h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  
  .login-visual {
    display: none;
  }
  
  .login-form {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .login {
    padding: 1rem;
  }
  
  .login-container {
    border-radius: 15px;
  }
  
  .login-form {
    padding: 1.5rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .welcome-text h2 {
    font-size: 2rem;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }
  
  .form-header h2 {
    font-size: 1.3rem;
  }
  
  .google-btn {
    padding: 0.875rem;
    font-size: 1rem;
  }
}
</style>
