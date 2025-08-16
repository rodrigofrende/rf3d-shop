<template>
  <div v-if="authStore.loading" class="auth-loader">
    <div class="loader-content">
      <ProgressSpinner size="large" />
      <h3>Inicializando aplicación...</h3>
      <p>Verificando sesión de usuario</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import ProgressSpinner from 'primevue/progressspinner'

const authStore = useAuthStore()
</script>

<style scoped>
.auth-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
  color: white;
}

.loader-content h3 {
  margin: 1rem 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.loader-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
}
</style>
