// Products Service - Carga productos desde Google Sheets
// Esta es la forma más fácil de editar productos sin tocar código

// Google Sheets ID - Reemplaza con el ID de tu hoja
const GOOGLE_SHEETS_ID = 'YOUR_SHEET_ID_HERE'
const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY_HERE'

// Estructura de la hoja de Google:
// Columna A: ID | Columna B: Nombre | Columna C: Descripción | Columna D: Precio | Columna E: Categoría | Columna F: Imagen | Columna G: Rating | Columna H: Review Count | Columna I: Tags

export class ProductsService {
  // Cargar productos desde Google Sheets
  static async loadProductsFromSheets() {
    try {
      // Por ahora, usamos datos de ejemplo mientras configuras Google Sheets
      // Una vez configurado, descomenta el código de abajo
      
      return this.getSampleProducts()
      
      // Código para Google Sheets (descomenta cuando tengas tu API key):
      /*
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Products!A2:I?key=${GOOGLE_SHEETS_API_KEY}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.values) {
        console.warn('No se encontraron productos en Google Sheets')
        return this.getSampleProducts()
      }
      
      return data.values.map((row, index) => ({
        id: parseInt(row[0]) || index + 1,
        name: row[1] || 'Producto sin nombre',
        description: row[2] || 'Sin descripción',
        price: parseFloat(row[3]) || 0,
        category: row[4] || 'general',
        image: row[5] || 'https://via.placeholder.com/300x300/ccc/666?text=Sin+Imagen',
        rating: parseInt(row[6]) || 5,
        reviewCount: parseInt(row[7]) || 0,
        tags: row[8] ? row[8].split(',').map(tag => tag.trim()) : []
      }))
      */
    } catch (error) {
      console.error('Error cargando productos:', error)
      return this.getSampleProducts()
    }
  }

  // Productos de ejemplo (se usan mientras configuras Google Sheets)
  static getSampleProducts() {
    return [
      {
        id: 1,
        name: 'Pokemon Charizard 3D',
        description: 'Figura 3D impresa de Charizard con detalles realistas, perfecta para decorar tu hogar o colección',
        price: 29.99,
        category: 'pokemon',
        image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Charizard',
        rating: 5,
        reviewCount: 128,
        tags: ['pokemon', 'fire', 'dragon']
      },
      {
        id: 2,
        name: 'Anime Hero Character',
        description: 'Personaje principal de anime impreso en 3D con pose dinámica, ideal para fans del género',
        price: 39.99,
        category: 'anime',
        image: 'https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Anime+Hero',
        rating: 4,
        reviewCount: 89,
        tags: ['anime', 'hero', 'action']
      },
      {
        id: 3,
        name: 'Fantasy Dragon',
        description: 'Dragón fantástico impreso en 3D con alas extendidas y detalles mágicos, una pieza única para tu colección',
        price: 49.99,
        category: 'fantasy',
        image: 'https://via.placeholder.com/300x300/45b7d1/ffffff?text=Fantasy+Dragon',
        rating: 5,
        reviewCount: 156,
        tags: ['fantasy', 'dragon', 'magic']
      },
      {
        id: 4,
        name: 'Gaming Mech Suit',
        description: 'Traje mecánico futurista impreso en 3D, perfecto para decorar tu espacio gaming',
        price: 59.99,
        category: 'gaming',
        image: 'https://via.placeholder.com/300x300/96ceb4/ffffff?text=Mech+Suit',
        rating: 4,
        reviewCount: 73,
        tags: ['gaming', 'mech', 'futuristic']
      },
      {
        id: 5,
        name: 'Sci-Fi Spaceship',
        description: 'Nave espacial de ciencia ficción impresa en 3D con detalles futuristas, ideal para coleccionistas',
        price: 69.99,
        category: 'scifi',
        image: 'https://via.placeholder.com/300x300/ffa726/ffffff?text=Spaceship',
        rating: 5,
        reviewCount: 94,
        tags: ['scifi', 'spaceship', 'futuristic']
      }
    ]
  }

  // Buscar productos por texto
  static searchProducts(products, query) {
    if (!query) return products
    
    const searchTerm = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Filtrar por categoría
  static filterByCategory(products, category) {
    if (!category) return products
    return products.filter(product => product.category === category)
  }

  // Filtrar por rango de precio
  static filterByPriceRange(products, minPrice, maxPrice) {
    if (!minPrice && !maxPrice) return products
    
    return products.filter(product => {
      if (minPrice && product.price < minPrice) return false
      if (maxPrice && product.price > maxPrice) return false
      return true
    })
  }

  // Ordenar productos
  static sortProducts(products, sortBy) {
    const sortedProducts = [...products]
    
    switch (sortBy) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sortedProducts.sort((a, b) => b.price - a.price)
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating)
      case 'popular':
        return sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount)
      case 'newest':
      default:
        return sortedProducts // Mantener orden original
    }
  }
}
