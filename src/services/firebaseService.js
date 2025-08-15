// Firebase Service - Gestión completa de la aplicación
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Configuración de Firebase - Usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Proveedor de Google
const googleProvider = new GoogleAuthProvider()

export class FirebaseService {
  // ===== AUTENTICACIÓN =====
  
  // Iniciar sesión con Google
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      return { success: false, error: error.message }
    }
  }

  // Cerrar sesión
  static async signOut() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
  }

  // Escuchar cambios de autenticación
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }

  // Obtener usuario actual
  static getCurrentUser() {
    return auth.currentUser
  }

  // ===== PRODUCTOS =====
  
  // Cargar todos los productos
  static async loadProducts() {
    try {
      const productsRef = collection(db, 'products')
      const q = query(productsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const products = []
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return products
    } catch (error) {
      console.error('Error loading products:', error)
      return []
    }
  }

  // Cargar productos por categoría
  static async loadProductsByCategory(category) {
    try {
      const productsRef = collection(db, 'products')
      const q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const products = []
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return products
    } catch (error) {
      console.error('Error loading products by category:', error)
      return []
    }
  }

  // Buscar productos
  static async searchProducts(searchTerm) {
    try {
      const productsRef = collection(db, 'products')
      const snapshot = await getDocs(productsRef)
      
      const products = []
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() }
        
        // Búsqueda en nombre, descripción y tags
        const searchLower = searchTerm.toLowerCase()
        if (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        ) {
          products.push(product)
        }
      })
      
      return products
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Agregar nuevo producto (solo para administradores)
  static async addProduct(productData) {
    try {
      const user = getCurrentUser()
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const productWithMetadata = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.uid,
        createdByEmail: user.email
      }

      const docRef = await addDoc(collection(db, 'products'), productWithMetadata)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error adding product:', error)
      return { success: false, error: error.message }
    }
  }

  // Actualizar producto
  static async updateProduct(productId, updateData) {
    try {
      const user = getCurrentUser()
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const productRef = doc(db, 'products', productId)
      const updateWithMetadata = {
        ...updateData,
        updatedAt: new Date(),
        updatedBy: user.uid
      }

      await updateDoc(productRef, updateWithMetadata)
      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, error: error.message }
    }
  }

  // Eliminar producto
  static async deleteProduct(productId) {
    try {
      const user = getCurrentUser()
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      await deleteDoc(doc(db, 'products', productId))
      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: error.message }
    }
  }

  // ===== CARRITO =====
  
  // Guardar carrito del usuario
  static async saveUserCart(userId, cartItems) {
    try {
      const userCartRef = doc(db, 'userCarts', userId)
      await updateDoc(userCartRef, {
        items: cartItems,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      // Si no existe, crear el documento
      try {
        await addDoc(collection(db, 'userCarts'), {
          userId,
          items: cartItems,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return { success: true }
      } catch (createError) {
        console.error('Error creating user cart:', createError)
        return { success: false, error: createError.message }
      }
    }
  }

  // Cargar carrito del usuario
  static async loadUserCart(userId) {
    try {
      const userCartRef = collection(db, 'userCarts')
      const q = query(userCartRef, where('userId', '==', userId), limit(1))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const cartDoc = snapshot.docs[0]
        return cartDoc.data().items || []
      }
      
      return []
    } catch (error) {
      console.error('Error loading user cart:', error)
      return []
    }
  }

  // ===== PEDIDOS =====
  
  // Crear nuevo pedido
  static async createOrder(orderData) {
    try {
      const user = getCurrentUser()
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const orderWithMetadata = {
        ...orderData,
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'orders'), orderWithMetadata)
      return { success: true, orderId: docRef.id }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false, error: error.message }
    }
  }

  // Cargar pedidos del usuario
  static async loadUserOrders(userId) {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const orders = []
      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return orders
    } catch (error) {
      console.error('Error loading user orders:', error)
      return []
    }
  }

  // ===== FAVORITOS =====
  
  // Agregar/remover favorito
  static async toggleFavorite(userId, productId, isFavorite) {
    try {
      const favoritesRef = collection(db, 'userFavorites')
      const q = query(
        favoritesRef, 
        where('userId', '==', userId),
        where('productId', '==', productId)
      )
      const snapshot = await getDocs(q)
      
      if (isFavorite) {
        // Agregar a favoritos
        if (snapshot.empty) {
          await addDoc(favoritesRef, {
            userId,
            productId,
            createdAt: new Date()
          })
        }
      } else {
        // Remover de favoritos
        if (!snapshot.empty) {
          const favoriteDoc = snapshot.docs[0]
          await deleteDoc(favoriteDoc.ref)
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return { success: false, error: error.message }
    }
  }

  // Cargar favoritos del usuario
  static async loadUserFavorites(userId) {
    try {
      const favoritesRef = collection(db, 'userFavorites')
      const q = query(
        favoritesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const favoriteIds = snapshot.docs.map(doc => doc.data().productId)
      
      // Cargar información de los productos favoritos
      if (favoriteIds.length > 0) {
        const products = await this.loadProducts()
        return products.filter(product => favoriteIds.includes(product.id))
      }
      
      return []
    } catch (error) {
      console.error('Error loading user favorites:', error)
      return []
    }
  }

  // ===== ALMACENAMIENTO DE ARCHIVOS =====
  
  // Subir imagen de producto
  static async uploadProductImage(file, productId) {
    try {
      const storageRef = ref(storage, `products/${productId}/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return { success: true, url: downloadURL }
    } catch (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: error.message }
    }
  }

  // ===== DATOS DE EJEMPLO =====
  
  // Crear productos de ejemplo en Firebase
  static async createSampleProducts() {
    const sampleProducts = [
      {
        name: 'Pokemon Charizard 3D',
        description: 'Figura 3D impresa de Charizard con detalles realistas, perfecta para decorar tu hogar o colección',
        price: 29.99,
        category: 'pokemon',
        image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Charizard',
        rating: 5,
        reviewCount: 128,
        tags: ['pokemon', 'fire', 'dragon'],
        stock: 50,
        featured: true
      },
      {
        name: 'Anime Hero Character',
        description: 'Personaje principal de anime impreso en 3D con pose dinámica, ideal para fans del género',
        price: 39.99,
        category: 'anime',
        image: 'https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Anime+Hero',
        rating: 4,
        reviewCount: 89,
        tags: ['anime', 'hero', 'action'],
        stock: 30,
        featured: true
      },
      {
        name: 'Fantasy Dragon',
        description: 'Dragón fantástico impreso en 3D con alas extendidas y detalles mágicos, una pieza única para tu colección',
        price: 49.99,
        category: 'fantasy',
        image: 'https://via.placeholder.com/300x300/45b7d1/ffffff?text=Fantasy+Dragon',
        rating: 5,
        reviewCount: 156,
        tags: ['fantasy', 'dragon', 'magic'],
        stock: 25,
        featured: true
      }
    ]

    try {
      for (const product of sampleProducts) {
        await this.addProduct(product)
      }
      return { success: true, message: 'Productos de ejemplo creados' }
    } catch (error) {
      console.error('Error creating sample products:', error)
      return { success: false, error: error.message }
    }
  }
}

// Exportar instancias para uso directo
export { auth, db, storage }
export default FirebaseService
