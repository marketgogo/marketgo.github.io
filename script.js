// Основной файл JavaScript// В начало файла script.js добавляем:
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
        // Добавляем частицы на фон
        this.createParticles();
        
        // Инициализация Telegram WebApp
        this.initTelegram();
        
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
        
        // Добавляем эффект параллакса
        this.initParallax();
    }
    
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 15}s`;
            particle.style.opacity = `${0.1 + Math.random() * 0.3}`;
            particle.style.width = particle.style.height = `${1 + Math.random() * 3}px`;
            particle.style.background = Math.random() > 0.5 ? 'var(--neon-orange)' : 'var(--violet)';
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }
    
    initParallax() {
        let lastScrollY = window.scrollY;
        
        const updateParallax = () => {
            const scrollY = window.scrollY;
            const delta = scrollY - lastScrollY;
            
            // Параллакс для шапки
            const header = document.querySelector('.header');
            if (header && delta !== 0) {
                const translateY = Math.min(Math.max(delta * 0.5, -10), 10);
                header.style.transform = `translateY(${translateY}px)`;
                
                setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                }, 100);
            }
            
            lastScrollY = scrollY;
            requestAnimationFrame(updateParallax);
        };
        
        requestAnimationFrame(updateParallax);
    }
    
    // В метод renderProducts добавляем задержку для анимации
    renderProducts(productsToRender = null) {
        const container = document.getElementById('productsGrid');
        
        let products = productsToRender || this.products;
        
        if (this.currentCategory !== 'all') {
            products = products.filter(product => product.category === this.currentCategory);
        }
        
        products.sort((a, b) => {
            const aHasBadge = a.badge ? 1 : 0;
            const bHasBadge = b.badge ? 1 : 0;
            return bHasBadge - aHasBadge;
        });
        
        container.innerHTML = products.map((product, index) => `
            <div class="product-card" data-id="${product.id}" style="--index: ${index};">
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
        
        this.attachProductHandlers();
    }
    
    // В метод addToCart добавляем улучшенную анимацию
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
                cartId: Date.now()
            });
        }
        
        this.updateCartCount();
        this.saveToStorage();
        
        // Улучшенная анимация добавления
        this.showEnhancedNotification(`"${product.name}" добавлен в корзину`);
        
        // Анимация иконки корзины
        this.animateCartIcon();
    }
    
    animateCartIcon() {
        const cartBtn = document.getElementById('cartBtn');
        const cartCount = document.getElementById('cartCount');
        
        cartBtn.style.transform = 'scale(1.2)';
        cartCount.style.transform = 'scale(1.5)';
        
        setTimeout(() => {
            cartBtn.style.transform = '';
            cartCount.style.transform = '';
        }, 300);
    }
    
    showEnhancedNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Добавляем иконку
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem; color: var(--gold);"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
    
    // Остальной код остается таким же, как в предыдущей версии...
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
        this.initTelegram();
        
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
    
    initTelegram() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            const tg = Telegram.WebApp;
            
            // Расширяем на весь экран
            tg.expand();
            
            // Устанавливаем цвета
            tg.setHeaderColor('#1a0b2e');
            tg.setBackgroundColor('#1a0b2e');
            
            // Включаем подтверждение закрытия
            tg.enableClosingConfirmation();
            
            // Кнопка "Назад"
            tg.BackButton.onClick(() => {
                this.handleBackButton();
            });
            
            // Основная кнопка
            tg.MainButton.setText('Оформить заказ')
                .setParams({
                    color: '#ff6b35',
                    text_color: '#ffffff'
                })
                .onClick(() => {
                    this.handleMainButtonClick();
                });
            
            console.log('Telegram WebApp инициализирован');
        } else {
            console.warn('Telegram WebApp не обнаружен. Запуск в браузере.');
            this.initMockTelegram();
        }
    }
    
    initMockTelegram() {
        window.Telegram = {
            WebApp: {
                initData: '',
                initDataUnsafe: {},
                version: '6.0',
                platform: 'web',
                colorScheme: 'dark',
                
                expand: () => console.log('Expand called'),
                close: () => console.log('Close called'),
                
                setHeaderColor: (color) => console.log('Header color:', color),
                setBackgroundColor: (color) => console.log('Background color:', color),
                
                enableClosingConfirmation: () => console.log('Closing confirmation enabled'),
                
                BackButton: {
                    show: () => console.log('BackButton show'),
                    hide: () => console.log('BackButton hide'),
                    onClick: (callback) => {
                        window.mockBackButton = callback;
                    }
                },
                
                MainButton: {
                    text: 'Main Button',
                    show: () => console.log('MainButton show'),
                    hide: () => console.log('MainButton hide'),
                    showProgress: () => console.log('MainButton showProgress'),
                    hideProgress: () => console.log('MainButton hideProgress'),
                    setText: (text) => {
                        this.text = text;
                        console.log('MainButton text:', text);
                        return this;
                    },
                    setParams: (params) => {
                        console.log('MainButton params:', params);
                        return this;
                    },
                    onClick: (callback) => {
                        window.mockMainButton = callback;
                    }
                },
                
                showAlert: (message, callback) => {
                    alert(message);
                    if (callback) callback(true);
                },
                
                showConfirm: (message, callback) => {
                    const confirmed = confirm(message);
                    if (callback) callback(confirmed);
                },
                
                onEvent: (event, callback) => {
                    console.log('Event listener added:', event);
                },
                
                offEvent: (event, callback) => {
                    console.log('Event listener removed:', event);
                }
            }
        };
        
        // Добавляем кнопку "Назад" для браузера
        const backButton = document.createElement('button');
        backButton.className = 'mock-back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backButton.onclick = () => {
            if (window.mockBackButton) {
                window.mockBackButton();
            }
        };
        document.body.appendChild(backButton);
    }
    
    handleBackButton() {
        const menu = document.getElementById('sideMenu');
        const cart = document.getElementById('cartSidebar');
        
        if (menu.classList.contains('active')) {
            this.toggleSideMenu();
            return;
        }
        
        if (cart.classList.contains('active')) {
            this.toggleCart();
            return;
        }
        
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.close();
        }
    }
    
    handleMainButtonClick() {
        if (this.cart.length === 0) {
            this.showAlert('Корзина пуста');
            return;
        }
        
        this.showOrderForm();
    }
    
    showOrderForm() {
        const tg = Telegram.WebApp;
        
        const orderData = {
            products: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: Date.now()
        };
        
        tg.showConfirm('Оформить заказ?', (confirmed) => {
            if (confirmed) {
                this.sendOrder(orderData);
            }
        });
    }
    
    sendOrder(orderData) {
        const tg = Telegram.WebApp;
        
        tg.MainButton.showProgress();
        
        setTimeout(() => {
            tg.MainButton.hideProgress();
            
            this.cart = [];
            this.updateCartCount();
            this.saveToStorage();
            this.renderCart();
            
            tg.MainButton.hide();
            
            tg.showAlert('Заказ оформлен! С вами свяжется наш менеджер для подтверждения.');
            
            setTimeout(() => {
                tg.close();
            }, 3000);
            
        }, 2000);
    }
    
    async loadData() {
        // Данные товаров и категорий
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
            },
            {
                id: 7,
                name: 'Скраб для тела "Кристальный"',
                category: 'body',
                price: 2190,
                image: 'scrub',
                badge: 'NEW',
                description: 'Нежный эксфолиант с кристаллами сахара'
            },
            {
                id: 8,
                name: 'Маска для волос с кератином',
                category: 'hair',
                price: 1990,
                originalPrice: 2390,
                image: 'hair_mask',
                badge: 'SALE',
                description: 'Восстановление и укрепление волос'
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
        
        // Клик по баннерам
        document.querySelectorAll('.btn-banner').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('В полной версии здесь будет переход к акциям');
            });
        });
        
        // Клик по "Смотреть все"
        document.querySelector('.view-all').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentCategory = 'all';
            this.renderProducts();
            document.querySelector('.nav-btn[data-page="catalog"]').click();
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
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === categoryId);
        });
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === 'catalog');
        });
        
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
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        switch(page) {
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'catalog':
                this.currentCategory = 'all';
                this.renderProducts();
                window.scrollTo({ top: 400, behavior: 'smooth' });
                break;
            case 'cart':
                this.toggleCart();
                break;
            case 'favorites':
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
        
        if (this.currentCategory !== 'all') {
            products = products.filter(product => product.category === this.currentCategory);
        }
        
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
        
        this.attachProductHandlers();
    }
    
    attachProductHandlers() {
        document.querySelectorAll('.product-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                this.toggleFavorite(productId);
                btn.classList.toggle('active');
            });
        });
        
        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                this.addToCart(productId);
                
                btn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                btn.classList.add('added');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-bag"></i> В корзину';
                    btn.classList.remove('added');
                }, 2000);
            });
        });
        
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
                cartId: Date.now()
            });
        }
        
        this.updateCartCount();
        this.saveToStorage();
        
        this.showNotification(`"${product.name}" добавлен в корзину`);
    }
    
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
        
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
        
        this.attachCartHandlers();
    }
    
    attachCartHandlers() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = parseInt(e.currentTarget.dataset.id);
                const isPlus = e.currentTarget.classList.contains('plus');
                this.updateCartItemQuantity(cartId, isPlus);
            });
        });
        
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
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showAlert(message) {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.showAlert(message);
        } else {
            alert(message);
        }
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