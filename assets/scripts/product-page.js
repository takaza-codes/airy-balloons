/***************************************************
 * 1) Функции для работы с localStorage (корзина)
 ***************************************************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Добавление товара в корзину (добавляем itemCount раз)
 * @param {number} productId - ID товара
 * @param {number} itemCount - количество
 */
function addToCart(productId, itemCount = 1) {
  const cart = getCart();
  const productToAdd = products.find(p => p.id === productId);
  if (productToAdd) {
    for (let i = 0; i < itemCount; i++) {
      cart.push(productToAdd);
    }
    saveCart(cart);
    console.log("Товар добавлен в корзину:", productToAdd, "x" + itemCount);
    console.log("Содержимое корзины:", cart);
  } else {
    console.error("Товар не найден");
  }
}

/***************************************************
 * 2) Функция для показа всплывающего сообщения (toast)
 ***************************************************/
function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.5rem';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '0.75rem 1rem';
  toast.style.borderRadius = '4px';
  toast.style.cursor = 'pointer';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  toast.addEventListener('click', () => {
    toast.remove();
    clearTimeout(timer);
  });

  toastContainer.appendChild(toast);

  const timer = setTimeout(() => {
    toast.remove();
  }, 3000);
}

/***************************************************
 * 3) Определяем элементы и получаем id товара из URL
 ***************************************************/
// Хлебные крошки: место для названия товара
const currentBreadcrumb = document.getElementById('currentBreadcrumb');

// Основная карточка товара
const productPageEl = document.getElementById('productPage');

// Блок для «Похожие товары»
const similarContainer = document.getElementById('similarProducts');

// Считываем ?id=...
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id');

/***************************************************
 * 5) Находим товар и рендерим карточку
 ***************************************************/
// Предполагается, что массив products объявлен в data.js
const product = products.find(p => p.id === productId);

if (!product) {
  // Если товар не найден
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
  currentBreadcrumb.textContent = 'Не найдено';
} else {
  // 1) Если категория есть в словаре categoryLabels, используем его значение
  // 2) Иначе берём название товара (product.title)
  const label = categoryLabels[product.category];
  currentBreadcrumb.textContent = label ? label : product.title;

  // Разбиваем описание на строки -> делаем <li>...
  const lines = product.description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  const listItems = lines.map(line => {
    if (line.startsWith('• ')) {
      line = line.substring(2);
    }
    return `<li>${line}</li>`;
  }).join('');

  const compositionHtml = `<ul>${listItems}</ul>`;

  // Главное изображение (или заглушка)
  const mainImage = (product.images && product.images.length > 0)
    ? product.images[0]
    : '../assets/images/no-image.jpg';

  productPageEl.innerHTML = `
    <div class="product-card">
      <div class="product-images">
        <div class="main-image">
          <img src="${mainImage}" alt="${product.title}" />
        </div>
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-price">${product.price}₽</p>

        <!-- Блок (контейнер) с счётчиком и кнопкой -->
        <div class="order-controls">
          <div class="quantity-block">
            <button class="decrement">−</button>
            <span class="quantity-num">1</span>
            <button class="increment">+</button>
          </div>
          <button class="btn" id="orderBtn">Заказать</button>
        </div>

        <div class="product-description">${compositionHtml}</div>
      </div>
    </div>
  `;

  // ---------------------------------------------
  // Локальная логика счётчика
  let quantity = 1;
  const decrementBtn = document.querySelector('.decrement');
  const incrementBtn = document.querySelector('.increment');
  const quantityNumEl = document.querySelector('.quantity-num');

  function updateQuantityDisplay() {
    quantityNumEl.textContent = quantity;
  }

  decrementBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      updateQuantityDisplay();
    }
  });

  incrementBtn.addEventListener('click', () => {
    quantity++;
    updateQuantityDisplay();
  });

  // ---------------------------------------------
  // Обработчик «Заказать»
  const orderBtn = document.getElementById('orderBtn');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      addToCart(product.id, quantity);
      showToast(`${product.title} (x${quantity}) успешно добавлен в корзину`);
      quantity = 1;
      updateQuantityDisplay();
    });
  }

  // ---------------------------------------------
  // Рендерим «Похожие товары»
  renderSimilarProducts(product);
}

/***************************************************
 * 6) Функция рендера «Похожие товары»
 ***************************************************/
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
    const imageSrc = (item.images && item.images.length > 0)
      ? item.images[0]
      : '../assets/photos/no-photo.jpg';

    html += `
      <div class="similar-item">
        <a href="product-page.html?id=${item.id}" class="similar-img-link">
          <img src="${imageSrc}" alt="${item.title}" class="similar-img" />
        </a>
        <h3 class="similar-item-title">${item.title}</h3>
        <p class="similar-item-price">${item.price}₽</p>
        <a href="product-page.html?id=${item.id}" class="btn btn--transparent">
          Подробнее
        </a>
      </div>
    `;
  });

  html += `</div>`;
  similarContainer.innerHTML = html;
}