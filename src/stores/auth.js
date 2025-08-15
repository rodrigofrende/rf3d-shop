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

  // Initialize auth state listener
  const initAuth = () => {
    FirebaseService.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
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
    initAuth,
    signInWithGoogle,
    signOut
  }
})
