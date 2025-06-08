document.addEventListener("DOMContentLoaded", function () {
    // Check login state on page load
    const userToken = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const userGreeting = document.getElementById("user-greeting");
    
    // Check if this is a fresh login session (no cart should persist across logins)
    const lastLoginUser = localStorage.getItem("lastLoginUser");
    if (username && lastLoginUser !== username) {
        // Different user or fresh login - clear cart
        localStorage.removeItem("cart");
        localStorage.setItem("lastLoginUser", username);
    }
    
    if (userToken && username) {
        if (loginButton) loginButton.style.display = 'none';
        if (userGreeting) {
            userGreeting.style.display = 'inline';
            userGreeting.textContent = `Hi, ${username}`;
        }
        if (logoutButton) logoutButton.style.display = 'inline';
    }
    
    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('cart'); // Clear cart on logout
            localStorage.removeItem('lastLoginUser'); // Clear login tracking
            window.location.href = 'dinedivine.html';
        });
    }

    // Cart Functionality - Initialize first
    const sidebar = document.getElementById("sidebar");
    const cartBtn = document.getElementById("cart-btn");
    const cartItems = document.getElementById("cart-items");
    const totalCost = document.getElementById("total-cost");
    const totalItems = document.getElementById("total-items");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const closeBtn = document.getElementById("close-btn");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutBtn = document.querySelector(".checkout-btn");

    let cart = [];
    let total = 0;

    // Function to check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem("token") && localStorage.getItem("username");
    }

    // Load cart from localStorage if available and user is logged in
    if (isUserLoggedIn() && localStorage.getItem("cart")) {
        try {
            cart = JSON.parse(localStorage.getItem("cart"));
            updateCart();
        } catch (e) {
            console.error("Error loading cart:", e);
            cart = [];
        }
    }

    // Cart Button Click Handler - Check login first
    if (cartBtn) {
        cartBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            if (!isUserLoggedIn()) {
                alert("Please login first to view your cart!");
                window.location.href = "login.html";
                return;
            }
            
            if (sidebar) {
                sidebar.classList.add("active");
            }
        });
    }

    // Close Sidebar
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            if (sidebar) {
                sidebar.classList.remove("active");
            }
        });
    }

    // Clear Cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            cart = [];
            updateCart();
            localStorage.removeItem("cart");
        });
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            if (!isUserLoggedIn()) {
                alert("Please login to place an order!");
                window.location.href = "login.html";
                return;
            }
            
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            
            // Show order confirmation
            const orderSummary = `Your order for ${totalItems.textContent} items (Total: ${totalCost.textContent}) has been placed successfully!`;
            alert(orderSummary);
            
            // Clear cart completely
            cart = [];
            total = 0;
            updateCart();
            localStorage.removeItem("cart");
            
            // Close sidebar
            if (sidebar) {
                sidebar.classList.remove("active");
            }
        });
    }

    // Add to Cart Functionality - Get buttons after DOM is loaded
    function initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        
        addToCartButtons.forEach((button) => {
            // Remove any existing event listeners to prevent duplicates
            button.removeEventListener("click", handleAddToCart);
            button.addEventListener("click", handleAddToCart);
        });
    }

    function handleAddToCart(event) {
        const button = event.target;
        
        // Check if user is logged in first
        if (!isUserLoggedIn()) {
            alert("Please login first to add items to cart!");
            window.location.href = "login.html";
            return;
        }
        
        const item = button.closest(".menu-item, .offer-card");
        
        if (!item) {
            console.error("Could not find parent item element");
            return;
        }

        const name = item.getAttribute("data-name");
        const price = parseInt(item.getAttribute("data-price"));

        if (!name || !price) {
            console.error("Missing item data:", { name, price });
            return;
        }

        // Check if item already exists in cart
        const existingItem = cart.find((cartItem) => cartItem.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
        
        // Show sidebar
        if (sidebar) {
            sidebar.classList.add("active");
        }
        
        // Save cart to localStorage
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Error saving cart:", e);
        }

        // Show feedback
        button.textContent = "Added!";
        setTimeout(() => {
            button.textContent = "Add to Cart";
        }, 1000);
    }

    // Update Cart Function
    function updateCart() {
        if (!cartItems || !totalCost || !totalItems) {
            console.error("Cart elements not found");
            return;
        }

        cartItems.innerHTML = "";
        total = 0;
        let itemCount = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "cart-item";

            // Item Details Container
            const itemDetails = document.createElement("div");
            itemDetails.className = "cart-item-details";

            // Item Name
            const itemName = document.createElement("div");
            itemName.className = "cart-item-name";
            itemName.textContent = item.name;

            // Item Price
            const itemPrice = document.createElement("div");
            itemPrice.className = "cart-item-price";
            itemPrice.textContent = `Rs. ${item.price} x ${item.quantity}`;

            // Controls Container
            const controls = document.createElement("div");
            controls.className = "cart-item-controls";

            // Quantity Input
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.max = 99;
            quantityInput.className = "quantity-input";
            
            quantityInput.addEventListener("change", function () {
                const newQuantity = parseInt(this.value);
                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                    updateCart();
                    try {
                        localStorage.setItem("cart", JSON.stringify(cart));
                    } catch (e) {
                        console.error("Error saving cart:", e);
                    }
                }
            });

            // Remove Button
            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-item-btn";
            removeBtn.innerHTML = "&times;";
            removeBtn.title = "Remove item";
            removeBtn.addEventListener("click", function () {
                cart.splice(index, 1);
                updateCart();
                try {
                    localStorage.setItem("cart", JSON.stringify(cart));
                } catch (e) {
                    console.error("Error saving cart:", e);
                }
            });

            // Append elements
            controls.appendChild(quantityInput);
            controls.appendChild(removeBtn);
            
            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemPrice);
            
            li.appendChild(itemDetails);
            li.appendChild(controls);
            cartItems.appendChild(li);

            // Update totals
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });

        // Update display
        totalCost.textContent = `Rs. ${total}`;
        totalItems.textContent = itemCount;

        // Update cart count in navbar (only show if logged in)
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            if (isUserLoggedIn()) {
                cartCount.textContent = itemCount;
            } else {
                cartCount.textContent = "0";
            }
        }

        // Show/hide empty cart message
        if (emptyCartMessage) {
            if (cart.length === 0) {
                emptyCartMessage.style.display = "block";
            } else {
                emptyCartMessage.style.display = "none";
            }
        }
    }

    // Initialize add to cart buttons
    initializeAddToCartButtons();

    // Update cart display on page load for logged-in users
    if (isUserLoggedIn()) {
        updateCart();
    }

    // Form Handling (Login/Register)
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value.trim();
            const errorMessage = document.getElementById("errorMessage");

            if (!username || !password) {
                if (errorMessage) errorMessage.textContent = "Please fill in all fields";
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || "Login failed");
                }

                // Clear any existing cart data when logging in
                localStorage.removeItem("cart");
                
                // Set new login data
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("lastLoginUser", data.username); // Track login user
                
                // Reset cart in memory
                cart = [];
                total = 0;
                
                window.location.href = "dinedivine.html";
                
            } catch (err) {
                console.error("Login error:", err);
                if (errorMessage) {
                    errorMessage.textContent = err.message || "An error occurred during login";
                }
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const username = document.getElementById("registerUsername") || document.getElementById("regUsername");
            const password = document.getElementById("registerPassword") || document.getElementById("regPassword");
            const confirmPassword = document.getElementById("registerConfirmPassword");
            const errorMessage = document.getElementById("errorMessage");
            const successMessage = document.getElementById("successMessage");

            if (!username || !password) {
                if (errorMessage) errorMessage.textContent = "Please fill in all fields";
                return;
            }

            const usernameValue = username.value.trim();
            const passwordValue = password.value.trim();

            if (confirmPassword && passwordValue !== confirmPassword.value.trim()) {
                if (errorMessage) errorMessage.textContent = "Passwords do not match";
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        username: usernameValue, 
                        password: passwordValue 
                    }),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || "Registration failed");
                }

                if (successMessage) {
                    successMessage.textContent = "Registration successful! Redirecting to login...";
                }
                
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
                
            } catch (err) {
                console.error("Registration error:", err);
                if (errorMessage) {
                    errorMessage.textContent = err.message || "An error occurred during registration";
                }
            }
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !cartBtn.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Footer section review
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const reviewBox = document.getElementById("review-message");
            const review = reviewBox.value.trim();

            if (review) {
                const reviewList = document.getElementById("review-list");
                const reviewItem = document.createElement("p");
                reviewItem.textContent = "📝 " + review;
                reviewList.appendChild(reviewItem);
                reviewBox.value = "";
            }
        });
    }
});