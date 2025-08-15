import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import FirebaseService from '../services/firebaseService'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Computed properties
  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0))
  const isEmpty = computed(() => items.value.length === 0)

  // Add item to cart
  const addItem = async (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        ...product,
        quantity: 1
      })
    }
    
    // Save to Firebase and localStorage
    await saveToFirebase()
    saveToLocalStorage()
  }

  // Remove item from cart
  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    items.value = []
    saveToLocalStorage()
  }

  // Save cart to Firebase
  const saveToFirebase = async () => {
    try {
      const user = FirebaseService.getCurrentUser()
      if (user) {
        await FirebaseService.saveUserCart(user.uid, items.value)
      }
    } catch (error) {
      console.error('Error saving cart to Firebase:', error)
    }
  }

  // Save cart to localStorage (fallback)
  const saveToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // Load cart from Firebase
  const loadFromFirebase = async () => {
    try {
      const user = FirebaseService.getCurrentUser()
      if (user) {
        const firebaseCart = await FirebaseService.loadUserCart(user.uid)
        if (firebaseCart.length > 0) {
          items.value = firebaseCart
          return
        }
      }
    } catch (error) {
      console.error('Error loading cart from Firebase:', error)
    }
    
    // Fallback to localStorage
    loadFromLocalStorage()
  }

  // Load cart from localStorage
  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }

  // Initialize cart
  const initCart = async () => {
    await loadFromFirebase()
  }

  return {
    items,
    itemCount,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    initCart
  }
})
