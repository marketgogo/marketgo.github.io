class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('beautyCart')) || [];
    }
    
    addProduct(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.save();
        this.updateUI();
    }
    
    removeProduct(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUI();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeProduct(productId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateUI();
            }
        }
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    save() {
        localStorage.setItem('beautyCart', JSON.stringify(this.items));
    }
    
    updateUI() {
        document.getElementById('cartCount').textContent = this.getCount();
        document.getElementById('totalPrice').textContent = this.getTotal().toLocaleString();
        
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeProduct(${item.id})">×</button>
                </div>
            `).join('');
            
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999;">Корзина пуста</p>';
            }
        }
    }
    
    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    }
}

const cart = new Cart();