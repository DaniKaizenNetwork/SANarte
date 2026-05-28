// Load catalog when page loads
document.addEventListener('DOMContentLoaded', () => {
    const categoryId = getUrlParameter('categoria');
    if (categoryId) {
        loadProductsByCategory(categoryId);
    } else {
        loadAllProducts();
    }
});

async function loadAllProducts() {
    const catalogGrid = document.getElementById('catalogGrid');
    const catalogTitle = document.getElementById('catalogTitle');

    catalogTitle.textContent = 'Todos los Productos';

    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        catalogGrid.innerHTML = '<div class="loading">Error al cargar los productos. Verifica que el backend esté ejecutándose.</div>';
    }
}

async function loadProductsByCategory(categoryId) {
    const catalogGrid = document.getElementById('catalogGrid');
    const catalogTitle = document.getElementById('catalogTitle');

    const categoryName = getCategoryName(parseInt(categoryId));
    catalogTitle.textContent = categoryName;

    try {
        const response = await fetch(`${API_BASE_URL}/productos/categoria/${categoryId}`);
        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        catalogGrid.innerHTML = '<div class="loading">Error al cargar los productos de esta categoría.</div>';
    }
}

function displayProducts(products) {
    const catalogGrid = document.getElementById('catalogGrid');

    if (products.length === 0) {
        catalogGrid.innerHTML = '<div class="loading">No hay productos disponibles.</div>';
        return;
    }

    catalogGrid.innerHTML = '';
    products.forEach(product => {
        const card = createProductCard(product);
        catalogGrid.appendChild(card);
    });
}

function getCategoryName(categoryId) {
    const categoryNames = {
        1: 'Cerámica Tradicional',
        2: 'Textiles Artesanales',
        3: 'Joyería Fina',
        4: 'Tallado en Madera'
    };

    return categoryNames[categoryId] || 'Productos Artesanales';
}
