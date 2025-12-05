// Основной файл приложения
class MarketGoApp {
    constructor() {
        this.cart = [];
        this.favorites = new Set();
        this.products = [];
        this.categories = [];
        this.currentCategory = 'all';
        
        this.init();
    }
    
    async init() {
        // Инициализация Telegram WebApp
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.expand();
            Telegram.WebApp.setHeaderColor('#1a0b2e');
            Telegram.WebApp.setBackgroundColor('#1a0b2e');
            Telegram.WebApp.enableClosingConfirmation();
        }
        
        // Загрузка данных
        await this.loadData();
        
        // Инициализация Swiper
        this.initSwiper();
        
        // Инициализация UI
        this.initUI();
        
        // Загрузка из localStorage
        this.loadFromStorage();
        
        // Рендер данных
        this.renderCategories();
        this.renderProducts();
    }
    
    async loadData() {
        // Загрузка товаров из JSON файла
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.categories = data.categories;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            // Заглушка данных на случай ошибки
            this.loadMockData();
        }
    }
    
    loadMockData() {
        this.categories = [
            { id: 'face', name: 'Для лица', icon: 'fa-spa', count: 24 },
            { id: 'body', name: 'Для тела', icon: 'fa-hand-holding-water', count: 18 },
            { id: 'hair', name: 'Для волос', icon: 'fa-air-freshener', count: 16 },
            { id: 'sets', name: 'Наборы', icon: 'fa-gift', count: 12 },
            { id: 'new', name: 'Новинки', icon: 'fa-star', count: 8 },
            { id: 'sale', name: 'Акции', icon: 'fa-tag', count: 15 }
        ];
        
        this.products = [
            {
                id: 1,
                name: 'Сыворотка "Стеклянная кожа"',
                category: 'face',
                price: 2490,
                originalPrice: 2990,
                image: 'serum',
                badge: 'NEW',
                description: 'Осветляющая сыворотка с витамином C'
            },
            {
                id: 2,
                name: 'Ночной крем с ретинолом',
                category: 'face',
                price: 3290,
                image: 'cream',
                badge: 'HIT',
                description: 'Интенсивное восстановление кожи'
            },
            {
                id: 3,
                name: 'Масло для тела "Амбровое"',
                category: 'body',
                price: 1890,
                originalPrice: 2190,
                image: 'oil',
                badge: 'SALE',
                description: 'Увлажнение и сияние кожи'
            },
            {
                id: 4,
                name: 'Шампунь для объема',
                category: 'hair',
                price: 1590,
                image: 'shampoo',
                description: 'Питание и увеличение объема'
            },
            {
                id: 5,
                name: 'Набор "Сияние стекла"',
                category: 'sets',
                price: 5490,
                originalPrice: 6990,
                image: 'set',
                badge: '-25%',
                description: 'Полный уход для сияющей кожи'
            },
            {
                id: 6,
                name: 'Тоник с гиалуроновой кислотой',
                category: 'face',
                price: 1790,
                image: 'toner',
                description: 'Глубокое увлажнение и тонизирование'
            }
        ];
    }
    
    initSwiper() {
        new Swiper('.banner-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            speed: 800,
        });
    }
    
    initUI() {
        // Кнопка меню
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.toggleSideMenu();
        });
        
        document.getElementById('closeMenu').addEventListener('click', () => {
            this.toggleSideMenu();
        });
        
        // Кнопка корзины
        document.getElementById('cartBtn').addEventListener('click', () => {
            this.toggleCart();
        });
        
        document.getElementById('closeCart').addEventListener('click', () => {
            this.toggleCart();
        });
        
        document.getElementById('continueShopping').addEventListener('click', () => {
            this.toggleCart();
        });
        
        // Оверлей
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeAllPanels();
        });
        
        // Поиск
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
            clearSearch.classList.toggle('visible', e.target.value.length > 0);
        });
        
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.remove('visible');
            this.handleSearch('');
        });
        
        // Меню категорий
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.selectCategory(category);
                this.toggleSideMenu();
            });
        });
        
        // Нижняя навигация
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.switchPage(page);
            });
        });
    }
    
    toggleSideMenu() {
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('overlay');
        
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }
    
    toggleCart() {
        const cart = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        cart.classList.toggle('active');
        overlay.classList.toggle('active');
        
        document.body.style.overflow = cart.classList.contains('active') ? 'hidden' : '';
        
        if (cart.classList.contains('active')) {
            this.renderCart();
        }
    }
    
    closeAllPanels() {
        document.getElementById('sideMenu').classList.remove('active');
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Обновление активного пункта меню
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === categoryId);
        });
        
        // Обновление активной кнопки в нижней навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === 'catalog');
        });
        
        // Рендер товаров выбранной категории
        this.renderProducts();
    }
    
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderProducts();
            return;
        }
        
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        this.renderProducts(filteredProducts);
    }
    
    switchPage(page) {
        // Обновление активной кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        // В реальном приложении здесь будет переключение между страницами
        switch(page) {
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'catalog':
                // Показать все товары
                this.currentCategory = 'all';
                this.renderProducts();
                window.scrollTo({ top: 400, behavior: 'smooth' });
                break;
            case 'cart':
                this.toggleCart();
                break;
            case 'favorites':
                // Показать избранное
                this.showFavorites();
                break;
            case 'profile':
                alert('Страница профиля находится в разработке');
                break;
        }
    }
    
    renderCategories() {
        const container = document.getElementById('categoriesGrid');
        
        container.innerHTML = this.categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <div class="category-icon">
                    <i class="fas ${category.icon}"></i>
                </div>
                <h3 class="category-name">${category.name}</h3>
                <span class="category-count">${category.count} товаров</span>
            </div>
        `).join('');
        
        // Обработчики кликов по категориям
        container.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.selectCategory(categoryId);
            });
        });
    }
    
    renderProducts(productsToRender = null) {
        const container = document.getElementById('productsGrid');
        
        let products = productsToRender || this.products;
        
        // Фильтрация по категории
        if (this.currentCategory !== 'all') {
            products = products.filter(product => product.category === this.currentCategory);
        }
        
        // Сортируем: сначала новинки и акции
        products.sort((a, b) => {
            const aHasBadge = a.badge ? 1 : 0;
            const bHasBadge = b.badge ? 1 : 0;
            return bHasBadge - aHasBadge;
        });
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <button class="product-favorite ${this.favorites.has(product.id) ? 'active' : ''}" 
                            data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">${product.price.toLocaleString()} ₽</span>
                        ${product.originalPrice ? 
                          `<span class="original-price">${product.originalPrice.toLocaleString()} ₽</span>` : 
                          ''}
                    </div>
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        В корзину
                    </button>
                </div>
            </div>
        `).join('');
        
        // Обработчики для кнопок
        this.attachProductHandlers();
    }
    
    attachProductHandlers() {
        // Кнопки "В избранное"
        document.querySelectorAll('.product-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                this.toggleFavorite(productId);
                btn.classList.toggle('active');
            });
        });
        
        // Кнопки "В корзину"
        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                this.addToCart(productId);
                
                // Анимация добавления
                btn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                btn.classList.add('added');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-bag"></i> В корзину';
                    btn.classList.remove('added');
                }, 2000);
            });
        });
        
        // Клик по карточке товара
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-favorite') && !e.target.closest('.btn-add-to-cart')) {
                    const productId = parseInt(card.dataset.id);
                    this.showProductDetails(productId);
                }
            });
        });
    }
    
    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }
    
    toggleFavorite(productId) {
        if (this.favorites.has(productId)) {
            this.favorites.delete(productId);
        } else {
            this.favorites.add(productId);
        }
        this.saveToStorage();
    }
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                cartId: Date.now() // Уникальный ID для элемента корзины
            });
        }
        
        this.updateCartCount();
        this.saveToStorage();
        
        // Визуальная обратная связь
        this.showNotification(`"${product.name}" добавлен в корзину`);
    }
    
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
        
        // Обновить кнопку оформления заказа
        const checkoutBtn = document.querySelector('.btn-checkout');
        checkoutBtn.disabled = totalItems === 0;
    }
    
    renderCart() {
        const container = document.getElementById('cartContent');
        const totalElement = document.querySelector('.total-price');
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Ваша корзина пуста</p>
                    <button class="btn-primary" id="continueShopping">Продолжить покупки</button>
                </div>
            `;
            totalElement.textContent = '0 ₽';
            return;
        }
        
        let total = 0;
        
        container.innerHTML = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item" data-id="${item.cartId}">
                    <div class="cart-item-image"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-category">${this.getCategoryName(item.category)}</p>
                        <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${item.cartId}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.cartId}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.cartId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        totalElement.textContent = `${total.toLocaleString()} ₽`;
        
        // Добавляем обработчики для элементов корзины
        this.attachCartHandlers();
    }
    
    attachCartHandlers() {
        // Кнопки изменения количества
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = parseInt(e.currentTarget.dataset.id);
                const isPlus = e.currentTarget.classList.contains('plus');
                this.updateCartItemQuantity(cartId, isPlus);
            });
        });
        
        // Кнопки удаления
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = parseInt(e.currentTarget.dataset.id);
                this.removeFromCart(cartId);
            });
        });
    }
    
    updateCartItemQuantity(cartId, isPlus) {
        const item = this.cart.find(item => item.cartId === cartId);
        if (!item) return;
        
        if (isPlus) {
            item.quantity += 1;
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.removeFromCart(cartId);
                return;
            }
        }
        
        this.updateCartCount();
        this.saveToStorage();
        this.renderCart();
    }
    
    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.updateCartCount();
        this.saveToStorage();
        this.renderCart();
    }
    
    showProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        // В реальном приложении здесь будет модальное окно с деталями
        alert(`Детали товара:\n\n${product.name}\n\n${product.description}\n\nЦена: ${product.price} ₽`);
    }
    
    showFavorites() {
        const favoriteProducts = this.products.filter(p => this.favorites.has(p.id));
        
        if (favoriteProducts.length === 0) {
            alert('В избранном пока ничего нет');
            return;
        }
        
        this.renderProducts(favoriteProducts);
        alert('Показаны товары из избранного');
    }
    
    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, var(--gradient-purple), var(--neon-orange));
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            z-index: 2000;
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('marketgo_cart', JSON.stringify(this.cart));
            localStorage.setItem('marketgo_favorites', JSON.stringify(Array.from(this.favorites)));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const cartData = localStorage.getItem('marketgo_cart');
            const favoritesData = localStorage.getItem('marketgo_favorites');
            
            if (cartData) {
                this.cart = JSON.parse(cartData);
            }
            
            if (favoritesData) {
                this.favorites = new Set(JSON.parse(favoritesData));
            }
            
            this.updateCartCount();
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e);
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MarketGoApp();
});

// Добавляем стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        background: var(--bg-card);
        border-radius: 12px;
        margin-bottom: 10px;
        align-items: center;
    }
    
    .cart-item-image {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--gradient-purple), var(--light-purple));
        border-radius: 8px;
    }
    
    .cart-item-info {
        flex: 1;
    }
    
    .cart-item-info h4 {
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    
    .cart-item-category {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-bottom: 5px;
    }
    
    .cart-item-price {
        color: var(--neon-orange);
        font-weight: 600;
    }
    
    .cart-item-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--bg-primary);
        border-radius: 20px;
        padding: 5px;
    }
    
    .quantity-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: var(--gradient-purple);
        color: white;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quantity {
        min-width: 20px;
        text-align: center;
    }
    
    .remove-item {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 5px;
    }
`;
document.head.appendChild(style);