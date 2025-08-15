<template>
  <div class="cart">
    <!-- Cart Header -->
    <section class="cart-header">
      <div class="container">
        <div class="header-content">
          <div class="header-text">
            <h1 class="header-title">Tu Carrito de Compras</h1>
            <p class="header-subtitle">
              Revisa tus productos seleccionados y coordina el retiro local
            </p>
          </div>
          <div class="header-icon">
            <i class="pi pi-shopping-cart" style="font-size: 3rem; color: var(--primary-color);"></i>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="cart-content">
        <!-- Cart Items -->
        <div class="cart-main">
          <Card class="cart-items-card">
            <template #header>
              <div class="cart-items-header">
                <h2 class="cart-items-title">
                  Productos en el Carrito 
                  <span class="cart-items-count">({{ cartStore.itemCount }})</span>
                </h2>
                <Button 
                  v-if="cartStore.itemCount > 0"
                  label="Vaciar Carrito" 
                  icon="pi pi-trash" 
                  class="p-button-outlined p-button-danger"
                  @click="clearCart"
                />
              </div>
            </template>
            
            <template #content>
              <div v-if="cartStore.itemCount === 0" class="empty-cart">
                <div class="empty-cart-content">
                  <i class="pi pi-shopping-cart" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
                  <h3>Tu carrito está vacío</h3>
                  <p>Agrega algunos productos para comenzar a comprar</p>
                  <Button 
                    label="Explorar Tienda" 
                    icon="pi pi-arrow-right" 
                    class="p-button-primary"
                    @click="$router.push('/shop')"
                  />
                </div>
              </div>
              
              <div v-else class="cart-items">
                <div 
                  v-for="item in cartStore.items" 
                  :key="item.id" 
                  class="cart-item"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name">
                  </div>
                  
                  <div class="item-info">
                    <div class="item-details">
                      <h3 class="item-name">{{ item.name }}</h3>
                      <p class="item-description">{{ item.description }}</p>
                      <div class="item-category">
                        <Tag :value="item.category" severity="info" />
                      </div>
                    </div>
                    
                    <div class="item-price">
                      <span class="price-label">Precio unitario:</span>
                      <span class="price-value">${{ item.price }}</span>
                    </div>
                  </div>
                  
                  <div class="item-quantity">
                    <label class="quantity-label">Cantidad:</label>
                    <div class="quantity-controls">
                      <Button 
                        icon="pi pi-minus" 
                        class="p-button-rounded p-button-outlined p-button-sm"
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      />
                      <InputText 
                        v-model.number="item.quantity" 
                        type="number" 
                        min="1" 
                        class="quantity-input"
                        @change="updateQuantity(item.id, item.quantity)"
                      />
                      <Button 
                        icon="pi pi-plus" 
                        class="p-button-rounded p-button-outlined p-button-sm"
                        @click="updateQuantity(item.id, item.quantity + 1)"
                      />
                    </div>
                  </div>
                  
                  <div class="item-total">
                    <span class="total-label">Total:</span>
                    <span class="total-value">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                  
                  <div class="item-actions">
                    <Button 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-outlined p-button-danger"
                      @click="removeItem(item.id)"
                      v-tooltip.top="'Eliminar del carrito'"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Cart Summary -->
        <div class="cart-sidebar">
          <Card class="cart-summary-card">
            <template #header>
              <h3 class="summary-title">Resumen de Compra</h3>
            </template>
            
            <template #content>
              <div class="summary-content">
                <!-- Delivery Information -->
                <div class="delivery-info">
                  <h4 class="delivery-title">
                    <i class="pi pi-home" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    Información de Entrega
                  </h4>
                  <div class="delivery-details">
                    <div class="delivery-item">
                      <i class="pi pi-map-marker" style="color: var(--success-color);"></i>
                      <span>Retiro local en domicilio o punto común</span>
                    </div>
                    <div class="delivery-item">
                      <i class="pi pi-clock" style="color: var(--warning-color);"></i>
                      <span>Entrega en 3-5 días hábiles (hecho con amor)</span>
                    </div>
                    <div class="delivery-item">
                      <i class="pi pi-phone" style="color: var(--info-color);"></i>
                      <span>Coordinamos la entrega personalmente</span>
                    </div>
                  </div>
                </div>

                <!-- Coupon Section -->
                <div class="coupon-section">
                  <h4 class="coupon-title">Cupón de Descuento</h4>
                  <div class="coupon-input">
                    <InputText 
                      v-model="couponCode" 
                      placeholder="Ingresa tu código" 
                      class="coupon-field"
                    />
                    <Button 
                      label="Aplicar" 
                      icon="pi pi-check" 
                      class="p-button-sm p-button-primary"
                      @click="applyCoupon"
                      :disabled="!couponCode.trim()"
                    />
                  </div>
                  
                  <div v-if="couponMessage" class="coupon-message">
                    <Message 
                      :severity="couponMessageType" 
                      :text="couponMessage"
                      class="coupon-alert"
                    />
                  </div>
                </div>

                <!-- Summary Details -->
                <div class="summary-details">
                  <div class="summary-row">
                    <span class="summary-label">Subtotal:</span>
                    <span class="summary-value">${{ cartStore.totalPrice.toFixed(2) }}</span>
                  </div>
                  
                  <div v-if="discount > 0" class="summary-row discount-row">
                    <span class="summary-label">Descuento:</span>
                    <span class="summary-value discount-value">-${{ discount.toFixed(2) }}</span>
                  </div>
                  
                  <div class="summary-row total-row">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value total-value">${{ finalTotal.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="summary-actions">
                  <Button 
                    label="Coordinar Retiro" 
                    icon="pi pi-calendar" 
                    class="p-button-lg p-button-primary w-full"
                    @click="proceedToCheckout"
                    :disabled="cartStore.itemCount === 0"
                  />
                  
                  <Button 
                    label="Continuar Comprando" 
                    icon="pi pi-arrow-left" 
                    class="p-button-lg p-button-outlined w-full"
                    @click="$router.push('/shop')"
                  />
                </div>

                <!-- Security Info -->
                <div class="security-info">
                  <div class="security-item">
                    <i class="pi pi-shield" style="color: var(--success-color);"></i>
                    <span>Productos de calidad garantizada</span>
                  </div>
                  <div class="security-item">
                    <i class="pi pi-heart" style="color: var(--danger-color);"></i>
                    <span>Hecho con amor y dedicación</span>
                  </div>
                  <div class="security-item">
                    <i class="pi pi-undo" style="color: var(--success-color);"></i>
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Related Products -->
      <section v-if="cartStore.itemCount > 0" class="related-products">
        <div class="section-header">
          <h2 class="section-title">Productos Relacionados</h2>
          <p class="section-subtitle">Descubre más figuras 3D que podrían interesarte</p>
        </div>
        
        <div class="related-grid">
          <Card 
            v-for="product in relatedProducts" 
            :key="product.id" 
            class="related-card"
            @click="addToCart(product)"
          >
            <template #content>
              <div class="related-image">
                <img :src="product.image" :alt="product.name">
                <div class="related-overlay">
                  <Button 
                    icon="pi pi-shopping-cart" 
                    class="p-button-rounded p-button-primary"
                    v-tooltip.top="'Agregar al Carrito'"
                  />
                </div>
              </div>
              
              <div class="related-info">
                <h3 class="related-name">{{ product.name }}</h3>
                <p class="related-price">${{ product.price }}</p>
              </div>
            </template>
          </Card>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

// PrimeVue Components
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'

const router = useRouter()
const cartStore = useCartStore()

// Reactive data
const couponCode = ref('')
const discount = ref(0)
const couponMessage = ref('')
const couponMessageType = ref('info')

// Related products (in a real app, this would come from an API)
const relatedProducts = ref([
  {
    id: 101,
    name: 'Pokemon Mewtwo 3D Impreso',
    price: 34.99,
    image: 'https://via.placeholder.com/200x200/9b59b6/ffffff?text=Mewtwo'
  },
  {
    id: 102,
    name: 'Anime Warrior Impreso',
    price: 44.99,
    image: 'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Warrior'
  },
  {
    id: 103,
    name: 'Fantasy Unicorn Impreso',
    price: 39.99,
    image: 'https://via.placeholder.com/200x200/3498db/ffffff?text=Unicorn'
  },
  {
    id: 104,
    name: 'Gaming Robot Impreso',
    price: 54.99,
    image: 'https://via.placeholder.com/200x200/f39c12/ffffff?text=Robot'
  }
])

// Computed properties
const finalTotal = computed(() => {
  return Math.max(0, cartStore.totalPrice - discount.value)
})

// Methods
const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 1) return
  
  cartStore.updateQuantity(productId, newQuantity)
  console.log(`Cantidad actualizada para el producto ${productId}`)
}

const removeItem = (productId) => {
  cartStore.removeItem(productId)
  console.log('Producto eliminado del carrito')
}

const clearCart = () => {
  cartStore.clearCart()
  discount.value = 0
  couponCode.value = ''
  couponMessage.value = ''
  console.log('Carrito vaciado')
}

const applyCoupon = () => {
  const code = couponCode.value.toLowerCase().trim()

  // Sample coupon logic (in a real app, this would validate against a backend)
  if (code === 'welcome10') {
    discount.value = cartStore.totalPrice * 0.1
    couponMessage.value = '¡Descuento del 10% aplicado!'
    couponMessageType.value = 'success'
    console.log('Cupón del 10% aplicado exitosamente')
  } else if (code === 'free5') {
    discount.value = 5
    couponMessage.value = '¡Descuento de $5 aplicado!'
    couponMessageType.value = 'success'
    console.log('Cupón de $5 aplicado exitosamente')
  } else if (code === 'newuser20') {
    discount.value = cartStore.totalPrice * 0.2
    couponMessage.value = '¡Descuento del 20% para nuevos usuarios!'
    couponMessageType.value = 'success'
    console.log('Cupón del 20% aplicado exitosamente')
  } else {
    couponMessage.value = 'Código de cupón inválido'
    couponMessageType.value = 'error'
    discount.value = 0
    console.log('Código de cupón inválido')
  }
}

const proceedToCheckout = () => {
  console.log('Iniciando coordinación de retiro local...')
  
  // Simulate navigation delay
  setTimeout(() => {
    console.log('Sistema de coordinación de retiro se implementará próximamente')
    // Here you would typically redirect to a pickup coordination page
    // or open a modal to collect pickup details
  }, 1000)
}

const addToCart = (product) => {
  cartStore.addItem(product)
  console.log(`${product.name} se agregó al carrito`)
}

// Lifecycle
onMounted(() => {
  cartStore.initCart()
})
</script>

<style scoped>
.cart {
  min-height: 100vh;
}

/* Cart Header */
.cart-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: var(--spacing-16) 0;
  margin: -2rem -2rem 0 -2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-8);
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-3);
}

.header-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  line-height: 1.6;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-8);
  margin-top: var(--spacing-8);
}

/* Cart Items */
.cart-items-card {
  border: none;
  box-shadow: var(--shadow-lg);
}

.cart-items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

.cart-items-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.cart-items-count {
  color: var(--primary-color);
  font-weight: var(--font-weight-normal);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: var(--spacing-16) 0;
}

.empty-cart-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-cart-content i {
  margin-bottom: var(--spacing-4);
}

.empty-cart-content h3 {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
}

.empty-cart-content p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-lg);
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: var(--spacing-6);
  align-items: center;
  padding: var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-surface);
  transition: all var(--transition-normal);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.item-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-category {
  align-self: flex-start;
}

.item-price {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.price-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.price-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

.item-quantity {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  align-items: center;
}

.quantity-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.quantity-input {
  width: 60px;
  text-align: center;
}

.item-total {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  align-items: center;
}

.total-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.total-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.item-actions {
  display: flex;
  justify-content: center;
}

/* Cart Summary */
.cart-summary-card {
  border: none;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: var(--spacing-4);
}

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Delivery Information */
.delivery-info {
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-6);
}

.delivery-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
  display: flex;
  align-items: center;
}

.delivery-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Coupon Section */
.coupon-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.coupon-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.coupon-input {
  display: flex;
  gap: var(--spacing-2);
}

.coupon-field {
  flex: 1;
}

.coupon-message {
  margin-top: var(--spacing-2);
}

.coupon-alert {
  margin: 0;
}

/* Summary Details */
.summary-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.summary-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.discount-row .discount-value {
  color: var(--success-color);
}

.total-row {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-3);
  margin-top: var(--spacing-2);
}

.total-row .summary-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.total-row .total-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

/* Summary Actions */
.summary-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* Security Info */
.security-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.security-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Related Products */
.related-products {
  margin-top: var(--spacing-16);
  padding-top: var(--spacing-8);
  border-top: 1px solid var(--color-border);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
}

.related-card {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.related-image {
  height: 150px;
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-4);
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.related-card:hover .related-image img {
  transform: scale(1.1);
}

.related-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.related-card:hover .related-overlay {
  opacity: 1;
}

.related-info {
  padding: var(--spacing-3);
  text-align: center;
}

.related-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.related-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .cart-summary-card {
    position: static;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
    text-align: center;
  }
  
  .item-image {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  
  .item-info,
  .item-price,
  .item-quantity,
  .item-total,
  .item-actions {
    align-items: center;
  }
}

@media (max-width: 768px) {
  .cart-header {
    padding: var(--spacing-12) 0;
    margin: -1rem -1rem 0 -1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-4);
  }
  
  .header-title {
    font-size: var(--font-size-3xl);
  }
  
  .header-icon {
    display: none;
  }
  
  .cart-items-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
  }
  
  .related-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .coupon-input {
    flex-direction: column;
  }
  
  .summary-actions .p-button {
    width: 100%;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
