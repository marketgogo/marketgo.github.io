const products = [
    {
        id: 1,
        name: "Шампунь увлажняющий",
        category: "hair",
        price: 1490,
        description: "Для сухих и поврежденных волос с кератином",
        image: "🌸",
        volume: "250 мл"
    },
    {
        id: 2,
        name: "Маска для волос питательная",
        category: "hair",
        price: 1890,
        description: "Восстанавливающая маска с аргановым маслом",
        image: "💆‍♀️",
        volume: "200 мл"
    },
    {
        id: 3,
        name: "Крем для лица с гиалуроновой кислотой",
        category: "face",
        price: 2290,
        description: "Интенсивное увлажнение на 24 часа",
        image: "🧴",
        volume: "50 мл"
    },
    {
        id: 4,
        name: "Сыворотка с витамином C",
        category: "face",
        price: 2990,
        description: "Осветляет и выравнивает тон кожи",
        image: "💧",
        volume: "30 мл"
    },
    {
        id: 5,
        name: "Скраб для тела кофейный",
        category: "body",
        price: 1290,
        description: "Антицеллюлитный эффект, тонизирует кожу",
        image: "☕",
        volume: "300 г"
    },
    {
        id: 6,
        name: "Увлажняющий лосьон для тела",
        category: "body",
        price: 1590,
        description: "Легкая текстура, быстро впитывается",
        image: "🧴",
        volume: "400 мл"
    },
    {
        id: 7,
        name: "Глиняная маска для лица",
        category: "masks",
        price: 1790,
        description: "Очищает поры, матирует кожу",
        image: "🪴",
        volume: "100 г"
    },
    {
        id: 8,
        name: "Патчи под глаза с коллагеном",
        category: "masks",
        price: 890,
        description: "Уменьшает темные круги и отеки",
        image: "👁️",
        volume: "10 пар"
    },
    {
        id: 9,
        name: "Кондиционер для объема",
        category: "hair",
        price: 1390,
        description: "Придает волосам объем и блеск",
        image: "✨",
        volume: "250 мл"
    },
    {
        id: 10,
        name: "Тоник для лица",
        category: "face",
        price: 1190,
        description: "Восстанавливает pH баланс кожи",
        image: "🌿",
        volume: "200 мл"
    },
    {
        id: 11,
        name: "Масло для волос аргановое",
        category: "hair",
        price: 2490,
        description: "Защита от термического воздействия",
        image: "🫒",
        volume: "100 мл"
    },
    {
        id: 12,
        name: "Ночной крем регенерирующий",
        category: "face",
        price: 3290,
        description: "Восстановление кожи во время сна",
        image: "🌙",
        volume: "50 мл"
    }
];

const categories = [
    { id: 'all', name: 'Все товары' },
    { id: 'hair', name: 'Для волос' },
    { id: 'face', name: 'Для лица' },
    { id: 'body', name: 'Для тела' },
    { id: 'masks', name: 'Маски' }
];

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
    
    // Открытие/закрытие корзины
    document.getElementById('cartIcon').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeCart();
    });
    
    // Поиск
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        renderProducts('all', searchTerm);
    });
    
    // Оформление заказа
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
});

function renderProducts(category = 'all', searchTerm = '') {
    const container = document.getElementById('productsContainer');
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(p => p.category === category);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
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

function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
}

function addToCart(productId) {
    cart.addProduct(productId);
    
    // Анимация добавления
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
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
    
    // Можно отправить данные на сервер
    tg.sendData(JSON.stringify(orderData));
    
    // Или показать сообщение
    tg.showAlert('Заказ оформлен! С вами свяжется менеджер для подтверждения.');
    
    cart.clear();
    closeCart();
}