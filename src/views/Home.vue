<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">Productos 3D</span> Impresos con Amor
          </h1>
          <p class="hero-subtitle">
            Descubre nuestra colección exclusiva de figuras 3D únicas impresas artesanalmente, 
            listas para decorar tu hogar o colección personal
          </p>
          <div class="hero-actions">
            <Button 
              label="Explorar Tienda" 
              icon="pi pi-shopping-bag" 
              class="p-button-lg p-button-primary hero-btn-primary"
              @click="$router.push('/shop')"
            />
            <Button 
              label="Ver Catálogo" 
              icon="pi pi-images" 
              class="p-button-lg p-button-outlined p-button-secondary hero-btn-secondary"
              @click="scrollToProducts"
            />
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="floating-card card-1">
              <i class="pi pi-cube floating-icon"></i>
              <span class="floating-text">Productos 3D</span>
            </div>
            <div class="floating-card card-2">
              <i class="pi pi-star floating-icon"></i>
              <span class="floating-text">Calidad Premium</span>
            </div>
            <div class="floating-card card-3">
              <i class="pi pi-heart floating-icon"></i>
              <span class="floating-text">Hecho con Amor</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">¿Por qué elegirnos?</h2>
          <p class="section-subtitle">Ofrecemos la mejor experiencia en productos 3D impresos</p>
        </div>
        
        <div class="features-grid">
          <Card class="feature-card" v-for="feature in features" :key="feature.id">
            <template #content>
              <div class="feature-content">
                <div class="feature-icon">
                  <i :class="feature.icon"></i>
                </div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="products-section" ref="productsSection">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos Destacados</h2>
          <p class="section-subtitle">Nuestras figuras más populares</p>
        </div>
        
        <div class="products-grid">
          <Card 
            v-for="product in featuredProducts" 
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
                  />
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
        
        <div class="section-footer">
          <Button 
            label="Ver Todos los Productos" 
            icon="pi pi-arrow-right" 
            class="p-button-lg p-button-outlined"
            @click="$router.push('/shop')"
          />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explora por Categoría</h2>
          <p class="section-subtitle">Encuentra lo que buscas fácilmente</p>
        </div>
        
        <div class="categories-grid">
          <Card 
            v-for="category in categories" 
            :key="category.id" 
            class="category-card"
            @click="filterByCategory(category)"
          >
            <template #content>
              <div class="category-content">
                <div class="category-icon">
                  <i :class="category.icon"></i>
                </div>
                <h3 class="category-title">{{ category.name }}</h3>
                <p class="category-count">{{ category.count }} productos</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
          <p class="section-subtitle">Experiencias reales de usuarios satisfechos</p>
        </div>
        
        <div class="testimonials-grid">
          <Card 
            v-for="testimonial in testimonials" 
            :key="testimonial.id" 
            class="testimonial-card"
          >
            <template #content>
              <div class="testimonial-content">
                <div class="testimonial-rating">
                  <Rating v-model="testimonial.rating" readonly :stars="5" :cancel="false" />
                </div>
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <div class="testimonial-author">
                  <Avatar :image="testimonial.avatar" shape="circle" size="large" />
                  <div class="author-info">
                    <h4 class="author-name">{{ testimonial.name }}</h4>
                    <p class="author-title">{{ testimonial.title }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <Card class="cta-card">
          <template #content>
            <div class="cta-content">
              <div class="cta-text">
                <h2 class="cta-title">¿Listo para comenzar?</h2>
                <p class="cta-subtitle">
                  Únete a miles de creadores que ya confían en nuestros modelos 3D
                </p>
              </div>
              <div class="cta-actions">
                <Button 
                  label="Crear Cuenta" 
                  icon="pi pi-user-plus" 
                  class="p-button-lg p-button-primary"
                  @click="$router.push('/login')"
                />
                <Button 
                  label="Ver Demo" 
                  icon="pi pi-play" 
                  class="p-button-lg p-button-outlined p-button-secondary"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Rating from 'primevue/rating'
import Avatar from 'primevue/avatar'
import Tooltip from 'primevue/tooltip'

const router = useRouter()
const cartStore = useCartStore()
const productsSection = ref(null)

// Data
const features = ref([
  {
    id: 1,
    icon: 'pi pi-check-circle',
    title: 'Calidad Garantizada',
    description: 'Todos nuestros modelos pasan por un riguroso control de calidad antes de ser publicados.'
  },
  {
    id: 2,
    icon: 'pi pi-bolt',
    title: 'Descarga Inmediata',
    description: 'Accede a tus modelos 3D al instante después de la compra, sin esperas.'
  },
  {
    id: 3,
    icon: 'pi pi-shield',
    title: 'Licencia Comercial',
    description: 'Usa nuestros modelos en proyectos comerciales sin restricciones adicionales.'
  },
  {
    id: 4,
    icon: 'pi pi-headset',
    title: 'Soporte 24/7',
    description: 'Nuestro equipo está disponible para ayudarte con cualquier consulta o problema.'
  }
])

const featuredProducts = ref([
  {
    id: 1,
    name: 'Pokemon Charizard 3D',
    description: 'Modelo 3D detallado de Charizard con texturas realistas',
    price: 29.99,
    category: 'pokemon',
    image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Charizard',
    rating: 5,
    reviewCount: 128
  },
  {
    id: 2,
    name: 'Anime Hero Character',
    description: 'Personaje principal de anime con pose dinámica',
    price: 39.99,
    category: 'anime',
    image: 'https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Anime+Hero',
    rating: 4,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'Fantasy Dragon',
    description: 'Dragón fantástico con alas extendidas y detalles mágicos',
    price: 49.99,
    category: 'fantasy',
    image: 'https://via.placeholder.com/300x300/45b7d1/ffffff?text=Fantasy+Dragon',
    rating: 5,
    reviewCount: 156
  }
])

const categories = ref([
  { id: 1, name: 'Pokemon', icon: 'pi pi-heart', count: 45 },
  { id: 2, name: 'Anime', icon: 'pi pi-star', count: 32 },
  { id: 3, name: 'Fantasy', icon: 'pi pi-magic', count: 28 },
  { id: 4, name: 'Gaming', icon: 'pi pi-gamepad', count: 38 },
  { id: 5, name: 'Sci-Fi', icon: 'pi pi-rocket', count: 25 },
  { id: 6, name: 'Otros', icon: 'pi pi-ellipsis-h', count: 52 }
])

const testimonials = ref([
  {
    id: 1,
    rating: 5,
    text: 'Los modelos 3D son increíbles, la calidad supera mis expectativas. Definitivamente volveré a comprar.',
    name: 'María González',
    title: 'Diseñadora 3D',
    avatar: 'https://via.placeholder.com/60x60/667eea/ffffff?text=MG'
  },
  {
    id: 2,
    rating: 5,
    text: 'Excelente servicio al cliente y modelos de alta calidad. Perfecto para mis proyectos de impresión 3D.',
    name: 'Carlos Rodríguez',
    title: 'Ingeniero Mecánico',
    avatar: 'https://via.placeholder.com/60x60/764ba2/ffffff?text=CR'
  },
  {
    id: 3,
    rating: 5,
    text: 'La variedad de modelos es impresionante y los precios son muy competitivos. Altamente recomendado.',
    name: 'Ana Martínez',
    title: 'Artista Digital',
    avatar: 'https://via.placeholder.com/60x60/10b981/ffffff?text=AM'
  }
])

// Methods
const scrollToProducts = () => {
  productsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const viewProduct = (product) => {
  console.log(`Viendo detalles de ${product.name}`)
  // En una app real, navegaría a la página del producto
}

const addToCart = (product) => {
  cartStore.addItem(product)
  console.log(`${product.name} se agregó al carrito`)
}

const filterByCategory = (category) => {
  router.push({ path: '/shop', query: { category: category.name.toLowerCase() } })
}

// Lifecycle
onMounted(() => {
  cartStore.initCart()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  padding: var(--spacing-24) 0;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-16);
  align-items: center;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-extrabold);
  line-height: 1.1;
  margin-bottom: var(--spacing-6);
}

.gradient-text {
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  line-height: 1.6;
  margin-bottom: var(--spacing-8);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

/* Mejorar contraste de botones del hero */
.hero-btn-primary {
  background: #ffffff !important;
  color: #2563eb !important;
  border: 2px solid #ffffff !important;
  font-weight: 700 !important;
  text-shadow: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.hero-btn-primary:hover {
  background: #f8fafc !important;
  color: #1e40af !important;
  border-color: #f8fafc !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.hero-btn-secondary {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #7c3aed !important;
  border: 2px solid rgba(255, 255, 255, 0.9) !important;
  font-weight: 700 !important;
  text-shadow: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.hero-btn-secondary:hover {
  background: #7c3aed !important;
  color: #ffffff !important;
  border-color: #7c3aed !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-cards {
  position: relative;
  height: 100%;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(37, 99, 235, 0.3);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  color: #1f2937;
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.floating-icon {
  font-size: 2rem;
  color: #2563eb;
  font-weight: bold;
}

.floating-text {
  font-weight: 700;
  color: #1f2937;
  font-size: var(--font-size-sm);
  text-align: center;
}

.floating-card.card-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-card.card-2 {
  top: 50%;
  right: 20%;
  animation-delay: 2s;
}

.floating-card.card-3 {
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Sections */
.features-section,
.products-section,
.categories-section,
.testimonials-section,
.cta-section {
  padding: var(--spacing-20) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-16);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: #1f2937;
  margin-bottom: var(--spacing-4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: #374151;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-8);
}

.feature-card {
  text-align: center;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-4);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-3);
  color: var(--color-text-primary);
}

.feature-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

.product-card {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.product-card:hover {
  transform: translateY(-8px);
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
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
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

.section-footer {
  text-align: center;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
}

.category-card {
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-content {
  padding: var(--spacing-6);
}

.category-icon {
  font-size: 3rem;
  color: #2563eb;
  margin-bottom: var(--spacing-4);
}

.category-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  color: #1f2937;
}

.category-count {
  color: #374151;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Testimonials Grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-8);
}

.testimonial-card {
  text-align: center;
}

.testimonial-content {
  padding: var(--spacing-6);
}

.testimonial-rating {
  margin-bottom: var(--spacing-4);
}

.testimonial-text {
  font-style: italic;
  color: #374151;
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  justify-content: center;
}

.author-info {
  text-align: left;
}

.author-name {
  font-weight: var(--font-weight-semibold);
  color: #1f2937;
  margin: 0;
}

.author-title {
  color: #374151;
  font-size: var(--font-size-sm);
  margin: 0;
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background: var(--color-gray-50);
}

.cta-card {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  border: none;
}

.cta-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-8);
  padding: var(--spacing-8);
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-3);
}

.cta-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-8);
  }
  
  .hero-title {
    font-size: var(--font-size-4xl);
  }
  
  .cta-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--spacing-16) 0;
  }
  
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .floating-cards {
    display: none;
  }
  
  .features-grid,
  .products-grid,
  .categories-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: var(--font-size-3xl);
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
