// Load product details when page loads
document.addEventListener('DOMContentLoaded', () => {
    const productId = getUrlParameter('id');
    if (productId) {
        loadProductDetails(productId);
    } else {
        document.getElementById('productName').textContent = 'Producto no encontrado';
    }
});

async function loadProductDetails(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');

        const product = await response.json();
        displayProductDetails(product);

        // Load related products from same category
        if (product.categoriaId || product.categoria_id || product.idCategoria) {
            const categoryId = product.categoriaId || product.categoria_id || product.idCategoria;
            loadRelatedProducts(categoryId, productId);
        }
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('productName').textContent = 'Error al cargar el producto';
        document.getElementById('productDescription').innerHTML = '<p>No se pudo cargar la información del producto. Verifica que el backend esté ejecutándose.</p>';
    }
}

function displayProductDetails(product) {
    // Update product name
    document.getElementById('productName').textContent = product.nombre || product.name || 'Producto';

    // Update category badge
    const categoryName = getCategoryName(product.categoriaId || product.categoria_id || product.idCategoria);
    document.getElementById('productCategory').textContent = categoryName.toUpperCase();

    // Update price
    const price = product.precio || product.price || 0;
    document.getElementById('productPrice').textContent = formatPrice(price);

    // Update description
    const description = product.descripcion || product.description || 'Descripción no disponible';
    document.getElementById('productDescription').innerHTML = `<p>${description}</p>`;

    // Update materials
    const materials = product.materiales || product.materials || 'No especificado';
    document.getElementById('productMaterials').textContent = materials;

    // Update dimensions
    const dimensions = product.dimensiones || product.dimensions || 'No especificado';
    document.getElementById('productDimensions').textContent = dimensions;

    // Update availability
    const stock = product.stock || product.disponibilidad || 0;
    const availabilityText = stock > 0 ? `${stock} ${stock === 1 ? 'Pieza Única Disponible' : 'Piezas Disponibles'}` : 'Agotado';
    document.getElementById('productAvailability').textContent = availabilityText;

    // Update images
    updateProductImages(product);
}

function updateProductImages(product) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailsContainer = document.getElementById('thumbnails');

    // Get image URLs from product
    // Adjust these field names based on your API response structure
    const images = [];

    if (product.imagenPrincipal || product.imagen || product.image) {
        images.push(product.imagenPrincipal || product.imagen || product.image);
    }

    if (product.imagenes || product.images) {
        const additionalImages = product.imagenes || product.images;
        if (Array.isArray(additionalImages)) {
            images.push(...additionalImages);
        }
    }

    // If no images from API, use placeholder
    if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=800&fit=crop');
        images.push('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop');
        images.push('https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&h=800&fit=crop');
    }

    // Set main image
    mainImage.src = images[0];
    mainImage.alt = product.nombre || 'Producto';

    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    images.forEach((imageUrl, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${imageUrl}" alt="Vista ${index + 1}">`;
        thumbnail.onclick = () => selectImage(imageUrl, thumbnail);
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function selectImage(imageUrl, thumbnailElement) {
    // Update main image
    document.getElementById('mainProductImage').src = imageUrl;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

async function loadRelatedProducts(categoryId, currentProductId) {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/categoria/${categoryId}`);
        if (!response.ok) throw new Error('Error al cargar productos relacionados');

        const products = await response.json();

        // Filter out current product and limit to 3
        const relatedProducts = products
            .filter(p => (p.id || p.idProducto) !== parseInt(currentProductId))
            .slice(0, 3);

        displayRelatedProducts(relatedProducts);
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

function displayRelatedProducts(products) {
    const container = document.getElementById('relatedProducts');
    container.innerHTML = '';

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const productId = product.id || product.idProducto;
    const productName = product.nombre || product.name || 'Producto';
    const productPrice = product.precio || product.price || 0;
    const categoryName = getCategoryName(product.categoriaId || product.categoria_id || product.idCategoria);
    const imageUrl = product.imagenPrincipal || product.imagen || product.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop';

    card.innerHTML = `
        <div class="product-card-image">
            <img src="${imageUrl}" alt="${productName}">
        </div>
        <div class="product-card-info">
            <h3 class="product-card-title">${productName}</h3>
            <p class="product-card-category">${categoryName}</p>
            <p class="product-card-price">${formatPrice(productPrice)}</p>
        </div>
    `;

    card.onclick = () => goToProduct(productId);

    return card;
}

function getCategoryName(categoryId) {
    const categoryNames = {
        1: 'Cerámica Tradicional',
        2: 'Textiles Artesanales',
        3: 'Joyería Fina',
        4: 'Tallado en Madera'
    };

    return categoryNames[categoryId] || 'Artesanía';
}
