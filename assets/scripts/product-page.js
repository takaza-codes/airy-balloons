// === Корзина ===
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, itemCount = 1) {
  const cart = getCart();
  const productToAdd = products.find(p => p.id === productId);
  if (productToAdd) {
    for (let i = 0; i < itemCount; i++) {
      cart.push(productToAdd);
    }
    saveCart(cart);
    showToast(`${productToAdd.title} добавлен в корзину`);
  }
}

function removeFromCart(productId) {
  const cart = getCart();
  const index = cart.findIndex(p => p.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    showToast("Товар удалён из корзины");
  }
}

function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '32px';
    toastContainer.style.right = '56px';
    toastContainer.style.width = '340px';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '16px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  function positionToastContainer() {
    const isMobile = window.innerWidth <= 440;
  
    toastContainer.style.bottom = '32px';
    toastContainer.style.width = 'calc(100% - 32px)';
    toastContainer.style.maxWidth = '340px';
    toastContainer.style.gap = '16px';
    toastContainer.style.zIndex = '9999';
  
    if (isMobile) {
      toastContainer.style.left = '50%';
      toastContainer.style.right = 'auto';
      toastContainer.style.transform = 'translateX(-50%)';
    } else {
      toastContainer.style.left = 'auto';
      toastContainer.style.right = '56px';
      toastContainer.style.transform = 'none';
    }
  }
  

  positionToastContainer(); 
  window.addEventListener('resize', positionToastContainer);

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.backgroundColor = 'rgb(242, 215, 219)';
  toast.style.color = 'rgb(30, 26, 26)';
  toast.style.padding = '16px';
  toast.style.borderRadius = '8px';
  toast.style.cursor = 'pointer';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  toast.style.textAlign = 'center';
  toast.style.fontSize = '18px';
  toast.style.transition = 'opacity 0.3s ease, transform 0.2s ease';
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';  

  toast.addEventListener('click', () => {
    toast.remove();
    clearTimeout(timer);
  });

  toastContainer.appendChild(toast);

  const timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// === Рендер карточки ===
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id');
const productPageEl = document.getElementById('productPage');
const similarContainer = document.getElementById('similarProducts');
const product = products.find(p => p.id === productId);

if (!product) {
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
} else {
  const lines = product.description.split('\n').map(line => line.trim()).filter(Boolean);
  const listItems = lines.map(line => `<li>${line}</li>`).join('');
  const mainImage = product.images?.[0] || '../assets/images/no-image.jpg';

  productPageEl.innerHTML = `
    <h2 class="product-title">${product.title}</h2>
    <div class="product-card">
      <div class="product-images">
        <div class="main-image">
          <img src="${mainImage}" alt="${product.title}" />
        </div>
      </div>
      <div class="product-info">
        <p class="product-price">${product.price}₽</p>
        <div class="order-controls" id="orderControls">
          <button class="btn" id="orderBtn">Заказать</button>
          <div class="quantity-block">
            <button class="decrement">−</button>
            <span class="quantity-num">0</span>
            <button class="increment">+</button>
          </div>
        </div>
        <div class="product-description">
          <ul>${listItems}</ul>
        </div>
      </div>
    </div>
  `;

  let quantity = 0;
  const orderControls = document.getElementById("orderControls");
  const orderBtn = document.getElementById("orderBtn");
  const quantityNum = document.querySelector(".quantity-num");
  const incrementBtn = document.querySelector(".increment");
  const decrementBtn = document.querySelector(".decrement");

  function updateQuantityDisplay() {
    quantityNum.textContent = quantity;
  }

  orderBtn.addEventListener("click", () => {
    quantity = 1;
    orderControls.classList.add("active");
    updateQuantityDisplay();
    addToCart(product.id);
  });

  incrementBtn.addEventListener("click", () => {
    quantity++;
    updateQuantityDisplay();
    addToCart(product.id);
  });

  decrementBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      updateQuantityDisplay();
      removeFromCart(product.id);
    }
    if (quantity === 0) {
      orderControls.classList.remove("active");
    }
  });

  renderSimilarProducts(product);
}

function renderSimilarProducts(currentProduct) {
  const sameCategory = products.filter(
    p => p.category === currentProduct.category && p.id !== currentProduct.id
  );

  if (!sameCategory.length) {
    similarContainer.innerHTML = '';
    return;
  }

  let html = `<h2 class="similar-title">Похожие товары</h2>`;
  html += `<div class="similar-list">`;

  sameCategory.forEach(item => {
    const imageSrc = item.images?.[0] || '../assets/photos/no-photo.jpg';
    html += `
      <div class="similar-item">
        <a href="product-page.html?id=${item.id}" class="similar-img-link">
          <img src="${imageSrc}" alt="${item.title}" class="similar-img" />
        </a>
        <h3 class="similar-item-title">${item.title}</h3>
        <p class="similar-item-price">${item.price}₽</p>
        <a href="product-page.html?id=${item.id}" class="btn btn--transparent">Подробнее</a>
      </div>
    `;
  });

  html += `</div>`;
  similarContainer.innerHTML = html;
}