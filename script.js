document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.hide();
    
    // Загрузка товаров
    renderProducts('all');
    cart.updateUI();
    
    // Обработчики категорий
    document.querySelectorAll('.category').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.category);
        });
    });
    
    // Поиск
    document.getElementById('searchInput').addEventListener('input', function(e) {
        renderProducts('all', e.target.value.toLowerCase());
    });
    
    // Корзина
    document.getElementById('cartIcon').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeCart();
    });
    
    // Оформление заказа
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
});

function renderProducts(category = 'all', searchTerm = '') {
    const container = document.getElementById('productsContainer');
    
    // ... фильтрация товаров
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${getProductIcon(product)}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-volume">${product.volume}</div>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция для получения иконки
function getProductIcon(product) {
    const iconMap = {
        'shampoo': '🧴',
        'mask': '💆',
        'cream': '🧴',
        'serum': '💧',
        'scrub': '☕',
        'lotion': '🧴',
        'clay': '🪴',
        'patches': '👁️',
        'conditioner': '✨',
        'toner': '🌿',
        'oil': '🫒',
        'nightcream': '🌙'
    };
    
    return iconMap[product.image] || product.image || '🌸';
}


// Остальные функции остаются такими же как раньше
function getCategoryName(categoryId) {
    const categories = {
        'hair': 'Волосы',
        'face': 'Лицо',
        'body': 'Тело',
        'masks': 'Маски'
    };
    return categories[categoryId] || categoryId;
}

function addToCart(productId) {
    cart.addProduct(productId);
    
    // Анимация кнопки корзины
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.classList.add('added-to-cart');
    setTimeout(() => {
        cartIcon.classList.remove('added-to-cart');
    }, 300);
}

function openCart() {
    document.getElementById('cartOverlay').style.display = 'flex';
    cart.updateUI();
}

function closeCart() {
    document.getElementById('cartOverlay').style.display = 'none';
}

function checkout() {
    if (cart.getCount() === 0) {
        alert('Добавьте товары в корзину!');
        return;
    }
    
    const tg = window.Telegram.WebApp;
    const orderData = {
        items: cart.items,
        total: cart.getTotal(),
        user: tg.initDataUnsafe.user
    };
    
    // Отправляем данные в Telegram
    tg.sendData(JSON.stringify(orderData));
    
    // Показываем подтверждение
    tg.showAlert('✅ Заказ оформлен! С вами свяжется менеджер для подтверждения.');
    
    // Очищаем корзину
    cart.clear();
    closeCart();
}