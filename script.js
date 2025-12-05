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
    
    // Показываем индикатор загрузки
    container.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Загрузка...</div>';
    
    // Имитация загрузки для плавности
    setTimeout(() => {
        let filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
        
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Если нет товаров
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">😔</div>
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте изменить поиск или категорию</p>
                </div>
            `;
            return;
        }
        
        // Рендеринг товаров
        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.image}
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
        
        // Анимация появления
        const cards = container.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 300);
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