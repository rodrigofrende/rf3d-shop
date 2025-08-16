import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import FirebaseService from '../services/firebaseService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const userDisplayName = computed(() => user.value?.displayName || 'Usuario')
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.uid || null)

  // Initialize auth state listener
  const initAuth = () => {
    // Configurar listener de cambios de autenticación
    const unsubscribe = FirebaseService.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
      
      // Guardar en localStorage para persistencia adicional
      if (firebaseUser) {
        localStorage.setItem('user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }))
      } else {
        localStorage.removeItem('user')
      }
    })

    // Retornar función para limpiar el listener
    return unsubscribe
  }

  // Restaurar sesión desde localStorage (fallback)
  const restoreSession = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        user.value = userData
        loading.value = false
      }
    } catch (error) {
      console.error('Error restoring session:', error)
      localStorage.removeItem('user')
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      const result = await FirebaseService.signInWithGoogle()
      if (result.success) {
        user.value = result.user
      }
      return result
    } catch (error) {
      console.error('Error signing in with Google:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const result = await FirebaseService.signOut()
      if (result.success) {
        user.value = null
        localStorage.removeItem('user') // Limpiar localStorage
      }
      return result
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    userDisplayName,
    userEmail,
    userId,
    initAuth,
    restoreSession,
    signInWithGoogle,
    signOut
  }
})
