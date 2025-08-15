<template>
  <div class="admin">
    <!-- Admin Header -->
    <div class="admin-header">
      <h1>Panel de Administración</h1>
      <p>Gestiona tus productos 3D desde aquí</p>
    </div>

    <!-- Admin Content -->
    <div class="admin-content">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <Button 
          label="Crear Producto de Ejemplo" 
          icon="pi pi-plus" 
          class="p-button-success"
          @click="createSampleProducts"
          :loading="creatingSamples"
        />
        <Button 
          label="Nuevo Producto" 
          icon="pi pi-plus-circle" 
          class="p-button-primary"
          @click="showNewProductForm = true"
        />
      </div>

      <!-- Products Table -->
      <div class="products-section">
        <div class="section-header">
          <h2>Productos Actuales ({{ products.length }})</h2>
          <div class="search-filter">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText 
                v-model="searchQuery" 
                placeholder="Buscar productos..." 
                class="search-input"
              />
            </span>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <ProgressSpinner />
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="no-products">
          <i class="pi pi-box" style="font-size: 3rem; color: #ccc;"></i>
          <h3>No hay productos</h3>
          <p>Crea tu primer producto para comenzar</p>
        </div>

        <div v-else class="products-table">
          <DataTable 
            :value="filteredProducts" 
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
            responsiveLayout="scroll"
            class="p-datatable-sm"
          >
            <Column field="image" header="Imagen" style="width: 80px">
              <template #body="slotProps">
                <img 
                  :src="slotProps.data.image" 
                  :alt="slotProps.data.name"
                  class="product-thumbnail"
                >
              </template>
            </Column>
            
            <Column field="name" header="Nombre" sortable>
              <template #body="slotProps">
                <div class="product-name-cell">
                  <strong>{{ slotProps.data.name }}</strong>
                  <small class="product-category">{{ slotProps.data.category }}</small>
                </div>
              </template>
            </Column>
            
            <Column field="price" header="Precio" sortable style="width: 100px">
              <template #body="slotProps">
                <span class="price">${{ slotProps.data.price }}</span>
              </template>
            </Column>
            
            <Column field="stock" header="Stock" sortable style="width: 80px">
              <template #body="slotProps">
                <span class="stock" :class="{ 'low-stock': slotProps.data.stock < 10 }">
                  {{ slotProps.data.stock }}
                </span>
              </template>
            </Column>
            
            <Column field="rating" header="Rating" sortable style="width: 120px">
              <template #body="slotProps">
                <Rating v-model="slotProps.data.rating" readonly :stars="5" :cancel="false" />
                <small>({{ slotProps.data.reviewCount }})</small>
              </template>
            </Column>
            
            <Column field="createdAt" header="Creado" sortable style="width: 120px">
              <template #body="slotProps">
                <span class="date">{{ formatDate(slotProps.data.createdAt) }}</span>
              </template>
            </Column>
            
            <Column header="Acciones" style="width: 150px">
              <template #body="slotProps">
                <div class="actions">
                  <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="editProduct(slotProps.data)"
                    v-tooltip.top="'Editar'"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    @click="deleteProduct(slotProps.data)"
                    v-tooltip.top="'Eliminar'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- New Product Dialog -->
    <Dialog 
      v-model:visible="showNewProductForm" 
      modal 
      header="Nuevo Producto" 
      :style="{ width: '600px' }"
      :closable="true"
    >
      <div class="product-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre del Producto</label>
            <InputText v-model="newProduct.name" placeholder="Ej: Pokemon Charizard 3D" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Descripción</label>
            <Textarea 
              v-model="newProduct.description" 
              rows="3" 
              placeholder="Describe tu producto..."
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Precio ($)</label>
            <InputNumber 
              v-model="newProduct.price" 
              mode="currency" 
              currency="USD" 
              :minFractionDigits="2" 
              :maxFractionDigits="2"
            />
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <Dropdown 
              v-model="newProduct.category" 
              :options="categories" 
              placeholder="Selecciona categoría"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Stock</label>
            <InputNumber v-model="newProduct.stock" :min="0" />
          </div>
          
          <div class="form-group">
            <label>Rating</label>
            <Rating v-model="newProduct.rating" :stars="5" :cancel="false" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Imagen URL</label>
            <InputText v-model="newProduct.image" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Tags (separados por coma)</label>
            <InputText v-model="newProduct.tagsInput" placeholder="pokemon, fire, dragon" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>
              <Checkbox v-model="newProduct.featured" :binary="true" />
              Producto Destacado
            </label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showNewProductForm = false" />
        <Button 
          label="Crear Producto" 
          icon="pi pi-check" 
          class="p-button-success" 
          @click="createProduct"
          :loading="creatingProduct"
        />
      </template>
    </Dialog>

    <!-- Edit Product Dialog -->
    <Dialog 
      v-model:visible="showEditProductForm" 
      modal 
      header="Editar Producto" 
      :style="{ width: '600px' }"
      :closable="true"
    >
      <div class="product-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre del Producto</label>
            <InputText v-model="editingProduct.name" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Descripción</label>
            <Textarea v-model="editingProduct.description" rows="3" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Precio ($)</label>
            <InputNumber 
              v-model="editingProduct.price" 
              mode="currency" 
              currency="USD" 
              :minFractionDigits="2" 
              :maxFractionDigits="2"
            />
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <Dropdown 
              v-model="editingProduct.category" 
              :options="categories" 
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Stock</label>
            <InputNumber v-model="editingProduct.stock" :min="0" />
          </div>
          
          <div class="form-group">
            <label>Rating</label>
            <Rating v-model="editingProduct.rating" :stars="5" :cancel="false" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Imagen URL</label>
            <InputText v-model="editingProduct.image" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Tags (separados por coma)</label>
            <InputText v-model="editingProduct.tagsInput" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>
              <Checkbox v-model="editingProduct.featured" :binary="true" />
              Producto Destacado
            </label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showEditProductForm = false" />
        <Button 
          label="Guardar Cambios" 
          icon="pi pi-check" 
          class="p-button-success" 
          @click="updateProduct"
          :loading="updatingProduct"
        />
      </template>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

import FirebaseService from '../services/firebaseService'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Rating from 'primevue/rating'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import Tooltip from 'primevue/tooltip'

const authStore = useAuthStore()


// Reactive data
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showNewProductForm = ref(false)
const showEditProductForm = ref(false)
const creatingProduct = ref(false)
const updatingProduct = ref(false)
const creatingSamples = ref(false)

// Form data
const newProduct = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  rating: 5,
  image: '',
  tagsInput: '',
  featured: false
})

const editingProduct = ref({})

// Categories
const categories = ref([
  'pokemon',
  'anime',
  'fantasy',
  'gaming',
  'sci-fi',
  'other'
])

// Computed properties
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
  )
})

// Methods
const loadProducts = async () => {
  try {
    loading.value = true
    const firebaseProducts = await FirebaseService.loadProducts()
    products.value = firebaseProducts
  } catch (error) {
    console.error('Error loading products:', error)
    console.log('Error: No se pudieron cargar los productos')
  } finally {
    loading.value = false
  }
}

const createSampleProducts = async () => {
  try {
    creatingSamples.value = true
    const result = await FirebaseService.createSampleProducts()
    
    if (result.success) {
      console.log('Éxito:', result.message)
      await loadProducts()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.error,
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error creando productos de ejemplo',
      life: 3000
    })
  } finally {
    creatingSamples.value = false
  }
}

const createProduct = async () => {
  try {
    creatingProduct.value = true
    
    // Validar campos requeridos
    if (!newProduct.value.name || !newProduct.value.description || !newProduct.value.price) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos',
        life: 3000
      })
      return
    }
    
    // Preparar datos del producto
    const productData = {
      ...newProduct.value,
      tags: newProduct.value.tagsInput ? newProduct.value.tagsInput.split(',').map(tag => tag.trim()) : [],
      reviewCount: 0
    }
    
    // Remover campos innecesarios
    delete productData.tagsInput
    
    const result = await FirebaseService.addProduct(productData)
    
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto creado exitosamente',
        life: 3000
      })
      
      // Limpiar formulario
      newProduct.value = {
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        rating: 5,
        image: '',
        tagsInput: '',
        featured: false
      }
      
      showNewProductForm.value = false
      await loadProducts()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.error,
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error creando el producto',
      life: 3000
    })
  } finally {
    creatingProduct.value = false
  }
}

const editProduct = (product) => {
  editingProduct.value = {
    ...product,
    tagsInput: product.tags ? product.tags.join(', ') : ''
  }
  showEditProductForm.value = true
}

const updateProduct = async () => {
  try {
    updatingProduct.value = true
    
    // Preparar datos para actualizar
    const updateData = {
      ...editingProduct.value,
      tags: editingProduct.value.tagsInput ? editingProduct.value.tagsInput.split(',').map(tag => tag.trim()) : []
    }
    
    // Remover campos innecesarios
    delete updateData.tagsInput
    delete updateData.id
    delete updateData.createdAt
    delete updateData.createdBy
    delete updateData.createdByEmail
    
    const result = await FirebaseService.updateProduct(editingProduct.value.id, updateData)
    
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto actualizado exitosamente',
        life: 3000
      })
      
      showEditProductForm.value = false
      await loadProducts()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.error,
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error actualizando el producto',
      life: 3000
    })
  } finally {
    updatingProduct.value = false
  }
}

const deleteProduct = async (product) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
    try {
      const result = await FirebaseService.deleteProduct(product.id)
      
      if (result.success) {
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto eliminado exitosamente',
          life: 3000
        })
        await loadProducts()
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: result.error,
          life: 3000
        })
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error eliminando el producto',
        life: 3000
      })
    }
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  
  if (date.toDate) {
    // Firebase Timestamp
    return date.toDate().toLocaleDateString('es-ES')
  }
  
  if (date instanceof Date) {
    return date.toLocaleDateString('es-ES')
  }
  
  return new Date(date).toLocaleDateString('es-ES')
}

// Lifecycle
onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    toast.add({
      severity: 'warn',
      summary: 'Acceso Restringido',
      detail: 'Debes iniciar sesión para acceder al panel de administración',
      life: 5000
    })
    return
  }
  
  await loadProducts()
})
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-header {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -2rem -2rem 2rem -2rem;
}

.admin-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.admin-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.products-section {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-input {
  min-width: 300px;
}

.loading, .no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.loading p {
  margin-top: 1rem;
}

.no-products i {
  margin-bottom: 1rem;
}

.products-table {
  padding: 0 2rem 2rem 2rem;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.product-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-category {
  color: #667eea;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.price {
  font-weight: 600;
  color: #667eea;
}

.stock {
  font-weight: 600;
  color: #27ae60;
}

.stock.low-stock {
  color: #e74c3c;
}

.date {
  color: #6c757d;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-row:first-child {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-content {
    padding: 0 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 2rem 1rem;
    margin: -1rem -1rem 1rem -1rem;
  }
  
  .admin-header h1 {
    font-size: 2rem;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .products-table {
    padding: 0 1rem 1rem 1rem;
  }
}
</style>
