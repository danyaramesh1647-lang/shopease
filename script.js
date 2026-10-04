// product data
const products = [
  { id: 1, name: "Cotton T-Shirt", price: 499, category: "clothing", image: "images/product1.jpg" },
  { id: 2, name: "Wireless Headphones", price: 1999, category: "electronics", image: "images/product2.jpg" },
  { id: 3, name: "Analog Watch", price: 1499, category: "accessories", image: "images/product3.jpg" },
  { id: 4, name: "College Backpack", price: 899, category: "accessories", image: "images/product4.jpg" },
  { id: 5, name: "Running Sneakers", price: 2499, category: "clothing", image: "images/product5.jpg" },
  { id: 6, name: "Sunglasses", price: 699, category: "accessories", image: "images/product6.jpg" }
];

// get elements
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const overlay = document.getElementById("overlay");
const cartItemsBox = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clearBtn = document.getElementById("clear-btn");

// load cart from localStorage
let cart = JSON.parse(localStorage.getItem("shopease-cart")) || [];
let currentCategory = "all";

function saveCart() {
  localStorage.setItem("shopease-cart", JSON.stringify(cart));
}

// show products
function showProducts() {
  const text = searchInput.value.toLowerCase();

  const filtered = products.filter(function (p) {
    const matchCategory = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(text);
    return matchCategory && matchSearch;
  });

  productList.innerHTML = "";

  if (filtered.length === 0) {
    productList.innerHTML = '<p class="no-result">No products found.</p>';
    return;
  }

  filtered.forEach(function (p) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML =
      '<img src="' + p.image + '" alt="' + p.name + '">' +
      '<div class="product-info">' +
        "<h3>" + p.name + "</h3>" +
        '<p class="price">Rs. ' + p.price + "</p>" +
        '<button class="add-btn" data-id="' + p.id + '">Add to Cart</button>' +
      "</div>";
    productList.appendChild(card);
  });
}

// add to cart
function addToCart(id) {
  const existing = cart.find(function (item) {
    return item.id === id;
  });

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart();
  showCart();
}

// change quantity
function changeQty(id, change) {
  const item = cart.find(function (i) {
    return i.id === id;
  });
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  saveCart();
  showCart();
}

// remove item
function removeItem(id) {
  cart = cart.filter(function (i) {
    return i.id !== id;
  });
  saveCart();
  showCart();
}

// show cart
function showCart() {
  cartItemsBox.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsBox.innerHTML = "<p>Your cart is empty.</p>";
  }

  cart.forEach(function (item) {
    const product = products.find(function (p) {
      return p.id === item.id;
    });

    total += product.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML =
      '<img src="' + product.image + '" alt="' + product.name + '">' +
      '<div class="cart-item-info">' +
        "<div>" + product.name + "</div>" +
        "<div>Rs. " + product.price + "</div>" +
        '<div class="qty-box">' +
          '<button data-action="minus" data-id="' + product.id + '">-</button>' +
          "<span>" + item.qty + "</span>" +
          '<button data-action="plus" data-id="' + product.id + '">+</button>' +
        "</div>" +
      "</div>" +
      '<button class="remove-btn" data-action="remove" data-id="' + product.id + '">Remove</button>';
    cartItemsBox.appendChild(div);
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;
}

// open / close cart
function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

// events
productList.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-btn")) {
    addToCart(Number(e.target.dataset.id));
  }
});

cartItemsBox.addEventListener("click", function (e) {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  if (action === "plus") changeQty(id, 1);
  if (action === "minus") changeQty(id, -1);
  if (action === "remove") removeItem(id);
});

searchInput.addEventListener("input", showProducts);

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    showProducts();
  });
});

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);

clearBtn.addEventListener("click", function () {
  cart = [];
  saveCart();
  showCart();
});

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for shopping with ShopEase! Total: Rs. " + cartTotal.textContent);
  cart = [];
  saveCart();
  showCart();
  closeCartPanel();
});

// start
showProducts();
showCart();