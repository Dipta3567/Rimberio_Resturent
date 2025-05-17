// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalAmount = 0;
let discountApplied = false; // Track discount usage

// Fetch and display products
document.addEventListener('DOMContentLoaded', function () {
    const topProductContainer = document.getElementById('top_product');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountButton = document.getElementById('apply-discount');
    const proceedCheckoutButton = document.querySelector('.btn-success.mt-4');

    // Fetch the products data from the API
    fetch('https://dipta3567.github.io/tools_assignment_api_1/products.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-4');
                productCard.innerHTML = `
                    <div class="card mb-4" style="background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 10px;">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="border-radius: 10px 10px 0 0;">
                        <div class="card-body" style="padding: 1.25rem; background-color: #ffffff;">
                            <h5 class="card-title" style="color: #2d3748; font-size: 1.2rem; font-weight: 600;">${product.name}</h5>
                            <p class="card-text" style="color: #4a5568;">$${product.price}</p>
                            <button class="btn add-to-cart" data-id="${product.id}" style="background: linear-gradient(45deg, #4caf50, #2196f3); color: white; padding: 10px 15px; border-radius: 5px; cursor: pointer; transition: all 0.3s; border: none; font-weight: bold;">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                topProductContainer.appendChild(productCard);
            });
        });

    // Add to cart functionality
    topProductContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            if (!cart.includes(productId)) {
                cart.push(productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }
    });

    // Update the cart UI
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        totalAmount = 0;

        if (cart.length === 0) {
            totalAmountElement.textContent = '0.00';
            cartCount.textContent = '0';
            return;
        }

        cart.forEach(itemId => {
            fetch('https://dipta3567.github.io/tools_assignment_api_1/products.json')
                .then(response => response.json())
                .then(data => {
                    const product = data.find(p => p.id == itemId);
                    if (product) {
                        const cartItem = document.createElement('li');
                        cartItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        cartItem.innerHTML = `
                            <img src="${product.image}" alt="${product.name}" class="img-fluid" style="width: 40px; height: 40px;">
                            <span>${product.name} - $${product.price}</span>
                            <button class="btn remove-item" data-id="${product.id}" style="background-color: #e91e63; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; border: none;">
                                Remove
                            </button>
                        `;
                        cartItemsContainer.appendChild(cartItem);

                        totalAmount += product.price;
                        totalAmountElement.textContent = totalAmount.toFixed(2);
                    }
                });
        });

        cartCount.textContent = cart.length;
    }

    // Remove item from cart
    cartItemsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-item')) {
            const productId = e.target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });

    function removeFromCart(productId) {
        cart = cart.filter(itemId => itemId != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Apply discount only once
    applyDiscountButton.addEventListener('click', function () {
        const discountCode = discountCodeInput.value.trim();
        if (discountApplied) {
            alert('Discount has already been applied.');
            return;
        }

        if (discountCode === 'DISCOUNT10') {
            const discountAmount = totalAmount * 0.1;
            totalAmount -= discountAmount;
            totalAmountElement.textContent = totalAmount.toFixed(2);
            discountApplied = true;
            alert('Discount applied successfully!');
        } else {
            alert('Invalid discount code');
        }
    });

    // Proceed to checkout
    proceedCheckoutButton.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        alert('✅ Order placed successfully! Thank you for your purchase.');

        // Clear cart and UI
        cart = [];
        localStorage.removeItem('cart');
        discountApplied = false;
        discountCodeInput.value = '';
        updateCart();
    });

    updateCart();
});

// Sidebar Toggle Logic
const viewCartButton = document.getElementById('view-cart');
const closeCartButton = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');

viewCartButton.addEventListener('click', function () {
    cartSidebar.style.transform = 'translateX(0)';
});

closeCartButton.addEventListener('click', function () {
    cartSidebar.style.transform = 'translateX(100%)';
});
