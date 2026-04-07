const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("section[id]");
const contactForm = document.querySelector(".contact-grid form");
const toast = document.getElementById("toast");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const cart = [];
let toastTimer;

const showToast = (message) => {
    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);
    toast.querySelector(".toast-message").textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
};

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("nav-open");
        navToggle.classList.toggle("is-active", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });
}

if (navLinks.length && navToggle && navMenu) {
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("nav-open");
            navToggle.classList.remove("is-active");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });
}

if (navToggle && navMenu) {
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove("nav-open");
            navToggle.classList.remove("is-active");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        }
    });
}

if (nav) {
    window.addEventListener("scroll", () => {
        nav.classList.toggle("nav-scrolled", window.scrollY > 24);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.18
});

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});

if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = document.querySelector('.nav-menu a[href="#' + entry.target.id + '"]');

            if (!link) {
                return;
            }

            if (entry.isIntersecting) {
                navLinks.forEach((navLink) => navLink.classList.remove("active"));
                link.classList.add("active");
            }
        });
    }, {
        threshold: 0.45
    });

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("Message sent. Redirecting you to WhatsApp...");

        setTimeout(() => {
            window.location.href = "https://wa.me/234817762721?text=Hello, I want to ask about your cars.";
        }, 900);
    });
}

const formatCartCount = (count) => count === 1 ? "1 car" : count + " cars";

const parsePrice = (priceText) => Number.parseFloat(priceText.replace(/[^0-9.]/g, ""));

const renderCart = () => {
    if (!cartItems || !cartEmpty || !cartCount || !cartTotal || !checkoutButton) {
        return;
    }

    cartItems.innerHTML = "";

    if (!cart.length) {
        cartEmpty.hidden = false;
        checkoutButton.disabled = true;
        cartCount.textContent = "0 cars";
        cartTotal.textContent = "NGN 0.0M";
        return;
    }

    cartEmpty.hidden = true;
    checkoutButton.disabled = false;

    let total = 0;

    cart.forEach((item, index) => {
        total += item.priceValue;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${item.priceLabel}</p>
            </div>
            <button type="button" class="cart-remove" data-index="${index}">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = formatCartCount(cart.length);
    cartTotal.textContent = "NGN " + total.toFixed(1) + "M";
};

if (addToCartButtons.length) {
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.dataset.carName;
            const priceLabel = button.dataset.carPrice;
            const priceValue = parsePrice(priceLabel);

            cart.push({ name, priceLabel, priceValue });
            renderCart();
            showToast(name + " added to cart.");
        });
    });
}

if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".cart-remove");

        if (!removeButton) {
            return;
        }

        const index = Number.parseInt(removeButton.dataset.index, 10);
        cart.splice(index, 1);
        renderCart();
        showToast("Car removed from cart.");
    });
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (!cart.length) {
            return;
        }

        cart.length = 0;
        renderCart();
        showToast("Car successfully bought.");

        setTimeout(() => {
            window.location.href = "thank-you.html";
        }, 1200);
    });
}

renderCart();
