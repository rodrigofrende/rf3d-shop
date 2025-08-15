<template>
  <div class="profile">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="header-content">
        <div class="user-avatar">
          <img 
            v-if="authStore.user?.photoURL" 
            :src="authStore.user.photoURL" 
            :alt="authStore.user.displayName"
          >
          <div v-else class="avatar-placeholder">
            <i class="pi pi-user"></i>
          </div>
        </div>
        <div class="user-info">
          <h1>{{ authStore.userDisplayName }}</h1>
          <p>{{ authStore.userEmail }}</p>
          <div class="user-stats">
            <div class="stat">
              <span class="stat-number">{{ orderCount }}</span>
              <span class="stat-label">Pedidos</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ favoriteCount }}</span>
              <span class="stat-label">Favoritos</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ totalSpent }}</span>
              <span class="stat-label">Total Gastado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <div class="content-grid">
        <!-- Profile Info -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Información Personal</h2>
            <Button 
              label="Editar" 
              icon="pi pi-pencil" 
              class="p-button-outlined"
              @click="editProfile"
            />
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre Completo</label>
              <span>{{ authStore.userDisplayName }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ authStore.userEmail }}</span>
            </div>
            <div class="info-item">
              <label>Miembro desde</label>
              <span>{{ memberSince }}</span>
            </div>
            <div class="info-item">
              <label>Estado de la cuenta</label>
              <span class="status verified">
                <i class="pi pi-check-circle"></i>
                Verificada
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Pedidos Recientes</h2>
            <Button 
              label="Ver Todos" 
              icon="pi pi-external-link" 
              class="p-button-text"
              @click="viewAllOrders"
            />
          </div>
          
          <div v-if="recentOrders.length === 0" class="empty-state">
            <i class="pi pi-shopping-bag" style="font-size: 3rem; color: #ccc;"></i>
            <h3>No tienes pedidos aún</h3>
            <p>¡Haz tu primer pedido y comienza a coleccionar productos 3D!</p>
            <Button 
              label="Explorar Tienda" 
              icon="pi pi-shopping-bag" 
              @click="$router.push('/shop')"
            />
          </div>
          
          <div v-else class="orders-list">
            <div 
              v-for="order in recentOrders" 
              :key="order.id" 
              class="order-item"
              @click="viewOrderDetails(order)"
            >
              <div class="order-header">
                <div class="order-id">#{{ order.id }}</div>
                <div class="order-status" :class="order.status">
                  {{ getStatusLabel(order.status) }}
                </div>
              </div>
              
              <div class="order-content">
                <div class="order-products">
                  <div 
                    v-for="product in order.products.slice(0, 3)" 
                    :key="product.id" 
                    class="product-preview"
                  >
                    <img :src="product.image" :alt="product.name">
                    <span class="product-name">{{ product.name }}</span>
                  </div>
                  <div v-if="order.products.length > 3" class="more-products">
                    +{{ order.products.length - 3 }} más
                  </div>
                </div>
                
                <div class="order-meta">
                  <div class="order-date">{{ formatDate(order.date) }}</div>
                  <div class="order-total">${{ order.total.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorites -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Productos Favoritos</h2>
            <Button 
              label="Ver Todos" 
              icon="pi pi-external-link" 
              class="p-button-text"
              @click="viewAllFavorites"
            />
          </div>
          
          <div v-if="favorites.length === 0" class="empty-state">
            <i class="pi pi-heart" style="font-size: 3rem; color: #ccc;"></i>
            <h3>No tienes favoritos aún</h3>
            <p>¡Agrega productos a tu lista de favoritos para encontrarlos fácilmente!</p>
            <Button 
              label="Explorar Tienda" 
              icon="pi pi-shopping-bag" 
              @click="$router.push('/shop')"
            />
          </div>
          
          <div v-else class="favorites-grid">
            <div 
              v-for="product in favorites.slice(0, 6)" 
              :key="product.id" 
              class="favorite-item"
              @click="viewProduct(product)"
            >
              <div class="favorite-image">
                <img :src="product.image" :alt="product.name">
                <Button 
                  icon="pi pi-heart-fill" 
                  class="p-button-rounded p-button-danger p-button-text remove-favorite"
                  @click.stop="removeFavorite(product.id)"
                  v-tooltip.top="'Remover de Favoritos'"
                />
              </div>
              <div class="favorite-info">
                <h4>{{ product.name }}</h4>
                <p>${{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Acciones de Cuenta</h2>
          </div>
          
          <div class="actions-grid">
            <Button 
              label="Cambiar Contraseña" 
              icon="pi pi-lock" 
              class="p-button-outlined action-btn"
              @click="changePassword"
            />
            <Button 
              label="Configuración de Notificaciones" 
              icon="pi pi-bell" 
              class="p-button-outlined action-btn"
              @click="notificationSettings"
            />
            <Button 
              label="Exportar Datos" 
              icon="pi pi-download" 
              class="p-button-outlined action-btn"
              @click="exportData"
            />
            <Button 
              label="Cerrar Sesión" 
              icon="pi pi-sign-out" 
              class="p-button-danger action-btn"
              @click="signOut"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Tooltip from 'primevue/tooltip'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Reactive data
const favorites = ref([])
const recentOrders = ref([])

// Computed properties
const orderCount = computed(() => recentOrders.value.length)
const favoriteCount = computed(() => favorites.value.length)
const totalSpent = computed(() => {
  return recentOrders.value.reduce((total, order) => total + order.total, 0).toFixed(2)
})

const memberSince = computed(() => {
  if (authStore.user?.metadata?.creationTime) {
    const date = new Date(authStore.user.metadata.creationTime)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    })
  }
  return 'Reciente'
})

// Sample data (in a real app, this would come from an API)
const sampleOrders = [
  {
    id: 'ORD001',
    date: new Date('2024-01-15'),
    status: 'delivered',
    total: 89.97,
    products: [
      { id: 1, name: 'Pokemon Charizard 3D', image: 'https://via.placeholder.com/100x100/ff6b6b/ffffff?text=Charizard' },
      { id: 2, name: 'Anime Hero Character', image: 'https://via.placeholder.com/100x100/4ecdc4/ffffff?text=Anime+Hero' }
    ]
  },
  {
    id: 'ORD002',
    date: new Date('2024-01-10'),
    status: 'shipped',
    total: 49.99,
    products: [
      { id: 3, name: 'Fantasy Dragon', image: 'https://via.placeholder.com/100x100/45b7d1/ffffff?text=Fantasy+Dragon' }
    ]
  }
]

const sampleFavorites = [
  { id: 4, name: 'Gaming Mech Suit', price: 59.99, image: 'https://via.placeholder.com/150x150/96ceb4/ffffff?text=Mech+Suit' },
  { id: 5, name: 'Sci-Fi Spaceship', price: 79.99, image: 'https://via.placeholder.com/150x150/ffeaa7/ffffff?text=Spaceship' },
  { id: 6, name: 'Pokemon Pikachu 3D', price: 24.99, image: 'https://via.placeholder.com/150x150/ffd93d/ffffff?text=Pikachu' }
]

// Methods
const editProfile = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Editor de perfil se implementará próximamente',
    life: 3000
  })
}

const viewAllOrders = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Vista completa de pedidos se implementará próximamente',
    life: 3000
  })
}

const viewAllFavorites = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Vista completa de favoritos se implementará próximamente',
    life: 3000
  })
}

const viewOrderDetails = (order) => {
  toast.add({
    severity: 'info',
    summary: 'Pedido',
    detail: `Viendo detalles del pedido ${order.id}`,
    life: 3000
  })
}

const viewProduct = (product) => {
  router.push(`/shop?product=${product.id}`)
}

const removeFavorite = (productId) => {
  const index = favorites.value.findIndex(fav => fav.id === productId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    toast.add({
      severity: 'success',
      summary: 'Favorito Removido',
      detail: 'El producto se removió de tus favoritos',
      life: 3000
    })
  }
}

const changePassword = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Cambio de contraseña se implementará próximamente',
    life: 3000
  })
}

const notificationSettings = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Configuración de notificaciones se implementará próximamente',
    life: 3000
  })
}

const exportData = () => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad',
    detail: 'Exportación de datos se implementará próximamente',
    life: 3000
  })
}

const signOut = async () => {
  try {
    await authStore.signOut()
    toast.add({
      severity: 'success',
      summary: 'Sesión Cerrada',
      detail: 'Has cerrado sesión exitosamente',
      life: 3000
    })
    router.push('/')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cerrar sesión',
      life: 3000
    })
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'processing': 'Procesando',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const formatDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Initialize auth if not already done
  if (!authStore.user) {
    authStore.initAuth()
  }
  
  // Load sample data
  recentOrders.value = sampleOrders
  favorites.value = sampleFavorites
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin: -2rem -2rem 2rem -2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255,255,255,0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
}

.user-info h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.user-info p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 1.5rem 0;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  gap: 2rem;
}

.profile-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
}

.info-item span {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.status.verified {
  color: #27ae60;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-state h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.empty-state p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-item:hover {
  border-color: #667eea;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-weight: 600;
  color: #2c3e50;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.delivered {
  background: #d4edda;
  color: #155724;
}

.order-status.shipped {
  background: #cce5ff;
  color: #004085;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-products {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.product-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.product-preview img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.product-name {
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-products {
  font-size: 0.8rem;
  color: #6c757d;
  font-style: italic;
}

.order-meta {
  text-align: right;
}

.order-date {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.order-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.favorite-item {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.favorite-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-favorite {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255,255,255,0.9) !important;
}

.favorite-info {
  padding: 1rem;
  text-align: center;
}

.favorite-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2c3e50;
}

.favorite-info p {
  margin: 0;
  font-weight: 600;
  color: #667eea;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  width: 100%;
  padding: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    padding: 2rem 0;
    margin: -1rem -1rem 1rem -1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
  }
  
  .user-info h1 {
    font-size: 2rem;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .profile-content {
    padding: 0 1rem;
  }
  
  .profile-section {
    padding: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .order-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .order-products {
    justify-content: center;
  }
  
  .order-meta {
    text-align: center;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .user-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profile-section {
    padding: 1rem;
  }
}
</style>
