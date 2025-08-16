import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed, watch } from 'vue'

export function useAuthGuard(requireAuth = true) {
  const authStore = useAuthStore()
  const router = useRouter()

  const isReady = computed(() => !authStore.loading)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Función para verificar acceso
  const checkAccess = () => {
    if (requireAuth && !authStore.isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  // Verificar acceso cuando cambie el estado de autenticación
  watch([isReady, isAuthenticated], ([ready, authenticated]) => {
    if (ready && requireAuth && !authenticated) {
      router.push('/login')
    }
  }, { immediate: true })

  return {
    isReady,
    isAuthenticated,
    checkAccess,
    user: computed(() => authStore.user),
    userDisplayName: computed(() => authStore.userDisplayName),
    userEmail: computed(() => authStore.userEmail),
    userId: computed(() => authStore.userId)
  }
}
