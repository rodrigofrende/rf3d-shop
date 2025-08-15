<template>
  <div class="shop">
    <!-- Shop Header -->
    <section class="shop-header">
      <div class="container">
        <div class="header-content">
          <div class="header-text">
            <h1 class="header-title">Nuestra Tienda de Productos 3D</h1>
            <p class="header-subtitle">
              Descubre nuestra colección exclusiva de figuras 3D únicas impresas artesanalmente, 
              listas para decorar tu hogar o colección personal
            </p>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <div class="stat-number">{{ filteredProducts.length }}</div>
              <div class="stat-label">Productos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ categories.length }}</div>
              <div class="stat-label">Categorías</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9</div>
              <div class="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Search -->
    <section class="filters-section">
      <div class="container">
        <Card class="filters-card">
          <template #content>
            <div class="filters-content">
              <div class="search-section">
                <span class="p-input-icon-left search-wrapper">
                  <i class="pi pi-search" />
                  <InputText 
                    v-model="searchQuery" 
                    placeholder="Buscar productos..." 
                    class="search-input"
                  />
                </span>
              </div>
              
              <div class="filters-row">
                <div class="filter-group">
                  <label class="filter-label">Categoría</label>
                  <Dropdown 
                    v-model="selectedCategory" 
                    :options="categories" 
                    optionLabel="name" 
                    placeholder="Todas las categorías"
                    class="filter-dropdown"
                    showClear
                  />
                </div>
                
                <div class="filter-group">
                  <label class="filter-label">Rango de Precio</label>
                  <Dropdown 
                    v-model="selectedPriceRange" 
                    :options="priceRanges" 
                    optionLabel="label" 
                    placeholder="Todos los precios"
                    class="filter-dropdown"
                    showClear
                  />
                </div>
                
                <div class="filter-group">
                  <label class="filter-label">Ordenar por</label>
                  <Dropdown 
                    v-model="sortBy" 
                    :options="sortOptions" 
                    optionLabel="label" 
                    placeholder="Más recientes"
                    class="filter-dropdown"
                  />
                </div>
                
                <div class="filter-actions">
                  <Button 
                    label="Limpiar Filtros" 
                    icon="pi pi-refresh" 
                    class="p-button-outlined p-button-secondary"
                    @click="clearFilters"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <div class="container">
        <div class="products-header">
          <div class="products-info">
            <h2 class="products-title">
              Productos 
              <span class="products-count">({{ filteredProducts.length }})</span>
            </h2>
            <p class="products-subtitle">
              {{ getFilterDescription() }}
            </p>
          </div>
          
          <div class="view-options">
            <ButtonGroup>
              <Button 
                icon="pi pi-th-large" 
                :class="{ 'p-button-primary': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                v-tooltip.top="'Vista de cuadrícula'"
              />
              <Button 
                icon="pi pi-list" 
                :class="{ 'p-button-primary': viewMode === 'list' }"
                @click="viewMode = 'list'"
                v-tooltip.top="'Vista de lista'"
              />
            </ButtonGroup>
          </div>
        </div>

        <div v-if="loading" class="loading-section">
          <ProgressSpinner size="large" />
          <p class="loading-text">Cargando productos...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="no-products">
          <div class="no-products-content">
            <i class="pi pi-search" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros de búsqueda o explorar otras categorías</p>
            <Button 
              label="Ver Todos los Productos" 
              icon="pi pi-refresh" 
              class="p-button-outlined"
              @click="clearFilters"
            />
          </div>
        </div>

        <div v-else class="products-container">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="products-grid">
            <Card 
              v-for="product in paginatedProducts" 
              :key="product.id" 
              class="product-card"
              @click="viewProduct(product)"
            >
              <template #content>
                <div class="product-image">
                  <img :src="product.image" :alt="product.name">
                  <div class="product-overlay">
                    <Button 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text overlay-btn"
                      v-tooltip.top="'Ver Detalles'"
                    />
                    <Button 
                      icon="pi pi-heart" 
                      class="p-button-rounded p-button-text overlay-btn"
                      v-tooltip.top="'Agregar a Favoritos'"
                      :class="{ 'favorited': isFavorite(product) }"
                      @click.stop="toggleFavorite(product)"
                    />
                  </div>
                  <div class="product-badges">
                    <Tag v-if="product.featured" value="Destacado" severity="warning" />
                    <Tag v-if="product.stock < 10" value="Stock Bajo" severity="danger" />
                  </div>
                </div>
                
                <div class="product-info">
                  <div class="product-category">
                    <Tag :value="product.category" severity="info" />
                  </div>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-description">{{ product.description }}</p>
                  
                  <div class="product-meta">
                    <div class="product-rating">
                      <Rating v-model="product.rating" readonly :stars="5" :cancel="false" />
                      <span class="rating-count">({{ product.reviewCount }})</span>
                    </div>
                    <div class="product-price">${{ product.price }}</div>
                  </div>
                  
                  <div class="product-actions">
                    <Button 
                      label="Agregar al Carrito" 
                      icon="pi pi-shopping-cart" 
                      class="p-button-sm p-button-primary w-full"
                      @click.stop="addToCart(product)"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- List View -->
          <div v-else class="products-list">
            <Card 
              v-for="product in paginatedProducts" 
              :key="product.id" 
              class="product-list-item"
              @click="viewProduct(product)"
            >
              <template #content>
                <div class="list-item-content">
                  <div class="list-item-image">
                    <img :src="product.image" :alt="product.name">
                  </div>
                  
                  <div class="list-item-info">
                    <div class="list-item-header">
                      <div class="list-item-category">
                        <Tag :value="product.category" severity="info" />
                      </div>
                      <h3 class="list-item-name">{{ product.name }}</h3>
                      <p class="list-item-description">{{ product.description }}</p>
                    </div>
                    
                    <div class="list-item-meta">
                      <div class="list-item-rating">
                        <Rating v-model="product.rating" readonly :stars="5" :cancel="false" />
                        <span class="rating-count">({{ product.reviewCount }})</span>
                      </div>
                      <div class="list-item-stock">
                        <i class="pi pi-box" style="margin-right: 0.5rem;"></i>
                        Stock: {{ product.stock }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="list-item-actions">
                    <div class="list-item-price">${{ product.price }}</div>
                    <div class="list-item-buttons">
                      <Button 
                        icon="pi pi-heart" 
                        class="p-button-rounded p-button-text"
                        :class="{ 'favorited': isFavorite(product) }"
                        @click.stop="toggleFavorite(product)"
                        v-tooltip.top="'Agregar a Favoritos'"
                      />
                      <Button 
                        label="Agregar al Carrito" 
                        icon="pi pi-shopping-cart" 
                        class="p-button-sm p-button-primary"
                        @click.stop="addToCart(product)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-section">
          <Paginator 
            v-model:first="first" 
            :rows="itemsPerPage" 
            :totalRecords="filteredProducts.length"
            @page="onPageChange"
            :rowsPerPageOptions="[12, 24, 48]"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

// PrimeVue Components
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import Rating from 'primevue/rating'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import Tooltip from 'primevue/tooltip'

// Services
import FirebaseService from '../services/firebaseService'

const router = useRouter()
const cartStore = useCartStore()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedPriceRange = ref(null)
const sortBy = ref(null)
const loading = ref(true)
const first = ref(0)
const itemsPerPage = ref(12)
const favorites = ref([])
const viewMode = ref('grid')

// Filter options
const categories = ref([
  { name: 'Pokemon', value: 'pokemon' },
  { name: 'Anime', value: 'anime' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: 'Gaming', value: 'gaming' },
  { name: 'Sci-Fi', value: 'sci-fi' }
])

const priceRanges = ref([
  { label: 'Todos los precios', value: null },
  { label: 'Menos de $20', value: [0, 20] },
  { label: '$20 - $50', value: [20, 50] },
  { label: '$50 - $100', value: [50, 100] },
  { label: 'Más de $100', value: [100, Infinity] }
])

const sortOptions = ref([
  { label: 'Más Recientes', value: 'newest' },
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Mejor Valorados', value: 'rating' },
  { label: 'Más Populares', value: 'popular' }
])

// Sample products data (in a real app, this would come from an API)
const products = ref([
  {
    id: 1,
    name: 'Pokemon Charizard 3D',
    description: 'Modelo 3D detallado de Charizard con texturas realistas',
    price: 29.99,
    category: 'pokemon',
    image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Charizard',
    rating: 5,
    reviewCount: 128,
    tags: ['pokemon', 'fire', 'dragon'],
    featured: true,
    stock: 15
  },
  {
    id: 2,
    name: 'Anime Hero Character',
    description: 'Personaje principal de anime con pose dinámica',
    price: 39.99,
    category: 'anime',
    image: 'https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Anime+Hero',
    rating: 4,
    reviewCount: 89,
    tags: ['anime', 'hero', 'action'],
    featured: false,
    stock: 8
  },
  {
    id: 3,
    name: 'Fantasy Dragon',
    description: 'Dragón fantástico con alas extendidas y detalles mágicos',
    price: 49.99,
    category: 'fantasy',
    image: 'https://via.placeholder.com/300x300/45b7d1/ffffff?text=Fantasy+Dragon',
    rating: 5,
    reviewCount: 156,
    tags: ['fantasy', 'dragon', 'magic'],
    featured: true,
    stock: 12
  },
  {
    id: 4,
    name: 'Gaming Mech Suit',
    description: 'Traje mecánico futurista para juegos de acción',
    price: 59.99,
    category: 'gaming',
    image: 'https://via.placeholder.com/300x300/96ceb4/ffffff?text=Mech+Suit',
    rating: 4,
    reviewCount: 73,
    tags: ['gaming', 'mech', 'futuristic'],
    featured: false,
    stock: 5
  },
  {
    id: 5,
    name: 'Sci-Fi Spaceship',
    description: 'Nave espacial con diseño futurista y luces LED',
    price: 79.99,
    category: 'sci-fi',
    image: 'https://via.placeholder.com/300x300/ffeaa7/ffffff?text=Spaceship',
    rating: 5,
    reviewCount: 94,
    tags: ['sci-fi', 'spaceship', 'futuristic'],
    featured: true,
    stock: 20
  },
  {
    id: 6,
    name: 'Pokemon Pikachu 3D',
    description: 'Modelo adorable de Pikachu con expresión amigable',
    price: 24.99,
    category: 'pokemon',
    image: 'https://via.placeholder.com/300x300/ffd93d/ffffff?text=Pikachu',
    rating: 5,
    reviewCount: 203,
    tags: ['pokemon', 'electric', 'cute'],
    featured: false,
    stock: 25
  }
])

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value.value)
  }

  // Price range filter
  if (selectedPriceRange.value && selectedPriceRange.value.value) {
    const [min, max] = selectedPriceRange.value.value
    filtered = filtered.filter(product => product.price >= min && product.price <= max)
  }

  // Sort products
  if (sortBy.value) {
    switch (sortBy.value.value) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        // Keep original order for newest
        break
    }
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = first.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedPriceRange.value = null
  sortBy.value = null
  first.value = 0
}

const onPageChange = (event) => {
  first.value = event.first
}

const getFilterDescription = () => {
  let description = 'Todos los productos'
  
  if (selectedCategory.value) {
    description = `Productos de ${selectedCategory.value.name}`
  }
  
  if (searchQuery.value) {
    description += ` que coinciden con "${searchQuery.value}"`
  }
  
  return description
}

const viewProduct = (product) => {
  console.log(`Viendo detalles de ${product.name}`)
}

const addToCart = (product) => {
  cartStore.addItem(product)
  console.log(`${product.name} se agregó al carrito`)
}

const toggleFavorite = (product) => {
  const index = favorites.value.findIndex(fav => fav.id === product.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    console.log(`${product.name} removido de favoritos`)
  } else {
    favorites.value.push(product)
    console.log(`${product.name} agregado a favoritos`)
  }
}

const isFavorite = (product) => {
  return favorites.value.some(fav => fav.id === product.id)
}

// Lifecycle
onMounted(async () => {
  try {
    // Cargar productos desde Firebase
    const firebaseProducts = await FirebaseService.loadProducts()
    
    if (firebaseProducts.length > 0) {
      products.value = firebaseProducts
    }
    // Si no hay productos en Firebase, se mantienen los de ejemplo
    
    loading.value = false
  } catch (error) {
    console.error('Error loading products:', error)
    loading.value = false
  }
  
  await cartStore.initCart()
})

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCategory, selectedPriceRange, sortBy], () => {
  first.value = 0
})
</script>

<style scoped>
.shop {
  min-height: 100vh;
}

/* Shop Header */
.shop-header {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  padding: var(--spacing-20) 0;
  margin: -2rem -2rem 0 -2rem;
  position: relative;
  overflow: hidden;
}

.shop-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-8);
  position: relative;
  z-index: 1;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.header-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.95;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 500;
}

.header-stats {
  display: flex;
  gap: var(--spacing-8);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: var(--spacing-6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
  padding: 0 var(--spacing-4);
}

.stat-item:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #ffffff;
}

/* Filters Section */
.filters-section {
  margin-top: -2rem;
  margin-bottom: var(--spacing-8);
  position: relative;
  z-index: 10;
}

.filters-card {
  border: none !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border-radius: 1rem !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
}

.filters-content {
  padding: var(--spacing-8);
}

.search-section {
  margin-bottom: var(--spacing-8);
  text-align: center;
}

.search-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  background: #ffffff !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 1rem !important;
  padding: 1rem 1rem 1rem 3rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.search-input:hover {
  border-color: #d1d5db !important;
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-1px) !important;
}

.search-input:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 25px -5px rgba(0, 0, 0, 0.1) !important;
  outline: none !important;
  transform: translateY(-2px) !important;
}

.search-wrapper .pi {
  position: absolute !important;
  left: 1.25rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: #6b7280 !important;
  font-size: 1.125rem !important;
  z-index: 1 !important;
  transition: color 0.3s ease !important;
}

.search-input:focus + .pi {
  color: #2563eb !important;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-6);
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.filter-label {
  font-weight: 600 !important;
  color: #1f2937 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  margin-bottom: 0.5rem !important;
}

.filter-dropdown {
  width: 100%;
  background: #ffffff !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.filter-dropdown:hover {
  border-color: #d1d5db !important;
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-1px) !important;
}

.filter-dropdown:not(.p-disabled).p-focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 25px -5px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) !important;
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

/* Products Section */
.products-section {
  padding: var(--spacing-8) 0;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  gap: var(--spacing-4);
}

.products-info {
  flex: 1;
}

.products-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: #1f2937;
  margin-bottom: var(--spacing-2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.products-count {
  color: #2563eb;
  font-weight: var(--font-weight-normal);
}

.products-subtitle {
  color: #374151;
  font-size: var(--font-size-base);
  font-weight: 500;
}

.view-options {
  display: flex;
  gap: var(--spacing-2);
}

/* Loading Section */
.loading-section {
  text-align: center;
  padding: var(--spacing-16) 0;
}

.loading-text {
  margin-top: var(--spacing-4);
  color: #374151;
  font-size: var(--font-size-lg);
  font-weight: 500;
}

/* No Products */
.no-products {
  text-align: center;
  padding: var(--spacing-16) 0;
}

.no-products-content {
  max-width: 500px;
  margin: 0 auto;
}

.no-products-content i {
  margin-bottom: var(--spacing-4);
}

.no-products-content h3 {
  font-size: var(--font-size-2xl);
  color: #1f2937;
  margin-bottom: var(--spacing-3);
  font-weight: 600;
}

.no-products-content p {
  color: #374151;
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-lg);
  font-weight: 500;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.product-card {
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.product-image {
  height: 250px;
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-4);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  color: white !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.overlay-btn.favorited {
  color: #ff6b6b !important;
  background: rgba(255, 107, 107, 0.2) !important;
}

.product-badges {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.product-info {
  padding: var(--spacing-4);
}

.product-category {
  margin-bottom: var(--spacing-3);
}

.product-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  color: #1f2937;
  line-height: 1.3;
}

.product-description {
  color: #374151;
  margin-bottom: var(--spacing-4);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.rating-count {
  color: #6b7280;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.product-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #2563eb;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.product-actions {
  margin-top: var(--spacing-4);
}

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.product-list-item {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.product-list-item:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-lg);
}

.list-item-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-6);
  align-items: center;
}

.list-item-image {
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.list-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.list-item-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.list-item-category {
  align-self: flex-start;
}

.list-item-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.list-item-description {
  color: #374151;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

.list-item-meta {
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
}

.list-item-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.list-item-stock {
  color: #6b7280;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.list-item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 150px;
}

.list-item-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #2563eb;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.list-item-buttons {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-8);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-6);
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .products-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-4);
  }
  
  .list-item-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
    text-align: center;
  }
  
  .list-item-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .shop-header {
    padding: var(--spacing-16) 0;
    margin: -1rem -1rem 0 -1rem;
  }
  
  .header-title {
    font-size: var(--font-size-3xl);
  }
  
  .header-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .filters-content {
    padding: var(--spacing-4);
  }
  
  .search-wrapper {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .header-stats {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .filter-actions {
    width: 100%;
  }
  
  .filter-actions .p-button {
    width: 100%;
  }
}
</style>
