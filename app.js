// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalAmount = 0;

// Fetch and display products
document.addEventListener('DOMContentLoaded', function () {
    const topProductContainer = document.getElementById('top_product');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountButton = document.getElementById('apply-discount');

    // Fetch the products data from the API
    fetch('https://dipta3567.github.io/tools_assignment_api_1/products.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                // Create product display
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-4');
                productCard.innerHTML = `
          <div class="card mb-4">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.price}</p>
              <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
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
        // Clear existing cart items
        cartItemsContainer.innerHTML = '';
        totalAmount = 0;

        cart.forEach(itemId => {
            fetch('https://dipta3567.github.io/tools_assignment_api_1/products.json')
                .then(response => response.json())
                .then(data => {
                    const product = data.find(p => p.id == itemId);
                    if (product) {
                        // Add product to cart UI
                        const cartItem = document.createElement('li');
                        cartItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        cartItem.innerHTML = `
              <img src="${product.image}" alt="${product.name}" class="img-fluid" style="width: 40px; height: 40px;">
              <span>${product.name} - $${product.price}</span>
              <button class="btn btn-danger btn-sm remove-item" data-id="${product.id}">Remove</button>
            `;
                        cartItemsContainer.appendChild(cartItem);

                        // Update total amount
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

    // Apply discount
    applyDiscountButton.addEventListener('click', function () {
        const discountCode = discountCodeInput.value.trim();
        if (discountCode === 'DISCOUNT10') {
            const discountAmount = totalAmount * 0.1;
            totalAmount -= discountAmount;
            totalAmountElement.textContent = totalAmount.toFixed(2);
        } else {
            alert('Invalid discount code');
        }
    });

    // Initialize cart
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
