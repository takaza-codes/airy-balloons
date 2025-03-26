// ====================== Корзина ======================

// (Изменение №A) Теперь в cart мы храним объекты вида { id, title, price, images, quantity }.
// При добавлении не плодим дубликаты, а увеличиваем quantity.
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Создаём канал для синхронизации между вкладками/страницами (Изменение №S1)
const cartChannel = new BroadcastChannel('cartChannel');

function updateCartAcrossTabs() {
  cartChannel.postMessage('updateCart');
}

// (Изменение №B) Функция addToCart – если товар уже есть, увеличиваем quantity, иначе добавляем объект с quantity = itemCount.
function addToCart(productId, itemCount = 1) {
  const cart = getCart();
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += itemCount; // увеличиваем quantity
  } else {
    // Добавляем новый объект с полем quantity = itemCount
    cart.push({ ...productToAdd, quantity: itemCount });
  }

  saveCart(cart);
  showToast(`${productToAdd.title} добавлен в корзину`);
  updateCartAcrossTabs(); // отправляем сообщение для обновления в других вкладках
}

// (Изменение №C) Функция removeFromCart – уменьшает quantity, если >1, иначе удаляет товар.
function removeFromCart(productId) {
  const cart = getCart();
  const index = cart.findIndex(p => p.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--; // уменьшаем quantity
      showToast("Количество уменьшено");
    } else {
      cart.splice(index, 1);
      showToast("Товар удалён из корзины");
    }
    saveCart(cart);
    updateCartAcrossTabs(); // уведомляем другие вкладки
  }
}

// Функция для тостов (без изменений)
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

// ====================== Рендер карточки ======================
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

  // -----------------------------
  // Логика счётчика
  // -----------------------------
  let quantity = 0;
  // Объявляем переменные глобально в пределах страницы товара
  const orderControls = document.getElementById("orderControls");
  const orderBtn = document.getElementById("orderBtn");
  const quantityNum = document.querySelector(".quantity-num");
  const incrementBtn = document.querySelector(".increment");
  const decrementBtn = document.querySelector(".decrement");

  function updateQuantityDisplay() {
    quantityNum.textContent = quantity;
  }

  // (Изменение №1) При загрузке проверяем, есть ли этот товар в cart
  const cart = getCart();
  const itemInCart = cart.find(item => item.id === productId);
  if (itemInCart) {
    // Если товар уже есть, устанавливаем quantity из LocalStorage
    quantity = itemInCart.quantity;
    orderControls.classList.add("active");
    orderBtn.style.display = 'none';
  } else {
    quantity = 0;
  }
  updateQuantityDisplay();

  // (Изменение №2) При клике «Заказать» → ставим quantity = 1, скрываем кнопку «Заказать»
  orderBtn.addEventListener("click", () => {
    quantity = 1;
    orderControls.classList.add("active");
    updateQuantityDisplay();
    orderBtn.style.display = 'none';
    addToCart(product.id, 1);
  });

  // При клике "+" увеличиваем quantity и вызываем addToCart
  incrementBtn.addEventListener("click", () => {
    quantity++;
    updateQuantityDisplay();
    addToCart(product.id, 1);
  });

  // При клике "-" уменьшаем quantity и вызываем removeFromCart
  decrementBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      updateQuantityDisplay();
      removeFromCart(product.id);
    }
    if (quantity === 0) {
      orderControls.classList.remove("active");
      orderBtn.style.display = 'inline-block';
    }
  });

  renderSimilarProducts(product);
}

// (Изменение №S2) Слушаем сообщения канала для обновления страницы товара в реальном времени
cartChannel.onmessage = (event) => {
  if (event.data === 'updateCart') {
    const cart = getCart();
    const itemInCart = cart.find(item => item.id === productId);
    if (itemInCart) {
      quantity = itemInCart.quantity;
      orderControls.classList.add("active");
      orderBtn.style.display = 'none';
    } else {
      quantity = 0;
      orderControls.classList.remove("active");
      orderBtn.style.display = 'inline-block';
    }
    updateQuantityDisplay();
  }
};

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