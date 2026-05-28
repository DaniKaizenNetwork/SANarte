// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:8080/api/public';

// Category mapping (you can adjust this based on your backend data)
const CATEGORY_MAP = {
    1: {
        name: 'Artesanal',
        description: 'Piezas moldeadas a mano, donde la tierra cobra vida a través de técnicas ancestrales de horneado.',
        badge: 'VER MÁS',
        class: 'large',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=600&fit=crop'
    },
    2: {
        name: 'Textiles',
        description: 'Tejidos que narran historias a través de sus patrones y colores naturales.',
        badge: 'VER MÁS',
        class: 'tall',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=600&fit=crop'
    },
    3: {
        name: 'Joyería Fina',
        description: 'Detalles forjados con precisión.',
        badge: null,
        class: 'square',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    },
    4: {
        name: 'Tallado',
        description: 'Esculturas y utilitarios que respetan la forma y esencia del árbol original.',
        badge: 'VER MÁS',
        class: 'wide',
        image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&h=400&fit=crop'
    }
};

// Load categories on index page
if (document.getElementById('categoriesGrid')) {
    loadCategories();
}

async function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');

    try {
        // Fetch all products to determine which categories exist
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar categorías');

        const productos = await response.json();

        // Get unique category IDs from products
        const categoryIds = [...new Set(productos.map(p => p.categoriaId || p.categoria_id || p.idCategoria))];

        // Create category cards
        categoriesGrid.innerHTML = '';
        categoryIds.forEach((categoryId, index) => {
            const categoryInfo = CATEGORY_MAP[categoryId] || {
                name: `Categoría ${categoryId}`,
                description: 'Descubre piezas únicas hechas a mano.',
                badge: 'VER MÁS',
                class: index % 4 === 0 ? 'large' : index % 4 === 1 ? 'tall' : index % 4 === 2 ? 'square' : 'wide',
                image: `https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&h=600&fit=crop&q=80&category=${categoryId}`
            };

            const card = createCategoryCard(categoryId, categoryInfo);
            categoriesGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesGrid.innerHTML = '<p style="grid-column: span 12; text-align: center; padding: 40px;">Error al cargar las categorías. Verifica que el backend esté ejecutándose.</p>';
    }
}

function createCategoryCard(categoryId, info) {
    const card = document.createElement('div');
    card.className = `category-card ${info.class}`;
    card.onclick = () => filterByCategory(categoryId);

    card.innerHTML = `
        <img src="${info.image}" alt="${info.name}" class="category-image">
        <div class="category-overlay">
            ${info.badge ? `<span class="category-badge">${info.badge}</span>` : ''}
            <h2 class="category-title">${info.name}</h2>
            <p class="category-description">${info.description}</p>
        </div>
    `;

    return card;
}

function filterByCategory(categoryId) {
    // Redirect to a filtered catalog page or show products
    window.location.href = `catalogo.html?categoria=${categoryId}`;
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Format price
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)} USD`;
}

// Navigate to product detail
function goToProduct(productId) {
    window.location.href = `producto.html?id=${productId}`;
}
