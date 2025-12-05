// Интеграция с Telegram WebApp
class TelegramWebApp {
    constructor() {
        this.initTelegram();
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
            
            // Подписываемся на события
            tg.onEvent('viewportChanged', this.handleViewportChange.bind(this));
            tg.onEvent('themeChanged', this.handleThemeChange.bind(this));
            
            console.log('Telegram WebApp инициализирован');
            console.log('Платформа:', tg.platform);
            console.log('Цветовая схема:', tg.colorScheme);
            console.log('Версия:', tg.version);
        } else {
            console.warn('Telegram WebApp не обнаружен. Запуск в браузере.');
            this.initMockTelegram();
        }
    }
    
    handleBackButton() {
        // Закрываем меню/корзину если они открыты
        const menu = document.getElementById('sideMenu');
        const cart = document.getElementById('cartSidebar');
        
        if (menu.classList.contains('active')) {
            app.toggleSideMenu();
            return;
        }
        
        if (cart.classList.contains('active')) {
            app.toggleCart();
            return;
        }
        
        // Иначе закрываем приложение
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.close();
        }
    }
    
    handleMainButtonClick() {
        if (app.cart.length === 0) {
            this.showAlert('Корзина пуста');
            return;
        }
        
        this.showOrderForm();
    }
    
    showOrderForm() {
        const tg = Telegram.WebApp;
        
        // Создаем форму заказа
        const orderData = {
            products: app.cart,
            total: app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: Date.now()
        };
        
        // Показываем алерт с подтверждением
        tg.showConfirm('Оформить заказ?', (confirmed) => {
            if (confirmed) {
                // Отправляем данные
                this.sendOrder(orderData);
            }
        });
    }
    
    sendOrder(orderData) {
        // В реальном приложении здесь будет отправка на сервер
        const tg = Telegram.WebApp;
        
        // Показываем индикатор загрузки
        tg.MainButton.showProgress();
        
        // Имитация отправки
        setTimeout(() => {
            tg.MainButton.hideProgress();
            
            // Очищаем корзину
            app.cart = [];
            app.updateCartCount();
            app.saveToStorage();
            app.renderCart();
            
            // Скрываем основную кнопку
            tg.MainButton.hide();
            
            // Показываем сообщение об успехе
            tg.showAlert('Заказ оформлен! С вами свяжется наш менеджер для подтверждения.');
            
            // Закрываем приложение через 3 секунды
            setTimeout(() => {
                tg.close();
            }, 3000);
            
        }, 2000);
    }
    
    handleViewportChange(event) {
        console.log('Viewport изменился:', event);
        // Можно адаптировать интерфейс под новый размер
    }
    
    handleThemeChange() {
        const tg = Telegram.WebApp;
        console.log('Тема изменилась:', tg.colorScheme);
        
        // Обновляем CSS переменные в зависимости от темы
        if (tg.colorScheme === 'dark') {
            document.documentElement.style.setProperty('--bg-primary', 'rgba(15, 5, 29, 0.98)');
            document.documentElement.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.03)');
        } else {
            document.documentElement.style.setProperty('--bg-primary', 'rgba(255, 255, 255, 0.95)');
            document.documentElement.style.setProperty('--bg-card', 'rgba(26, 11, 46, 0.05)');
        }
    }
    
    initMockTelegram() {
        // Заглушка для разработки в браузере
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
    }
    
    // Утилиты для работы с Telegram WebApp
    static sendData(data) {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.sendData(JSON.stringify(data));
            return true;
        }
        return false;
    }
    
    static showPopup(params, callback) {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.showPopup(params, callback);
            return true;
        }
        return false;
    }
    
    static setBackgroundColor(color) {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.setBackgroundColor(color);
            return true;
        }
        return false;
    }
}

// Инициализация Telegram WebApp
document.addEventListener('DOMContentLoaded', () => {
    window.telegramApp = new TelegramWebApp();
    
    // Добавляем стили для кнопки "Назад" в браузере
    if (!window.Telegram?.WebApp?.platform || window.Telegram.WebApp.platform === 'web') {
        const style = document.createElement('style');
        style.textContent = `
            .mock-back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
                background: var(--bg-card);
                border: 1px solid var(--glass-border);
                color: var(--text-primary);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition-normal);
            }
            
            .mock-back-button:hover {
                background: var(--light-purple);
                border-color: var(--neon-orange);
            }
        `;
        document.head.appendChild(style);
        
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
});