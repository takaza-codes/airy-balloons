/***************************************************
 * Функции для работы с localStorage (корзина)
 ***************************************************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Добавление товара в корзину
 * @param {number} productId - ID товара
 */
function addToCart(productId) {
  const cart = getCart();
  const productToAdd = products.find(p => p.id === productId);
  if (productToAdd) {
    // Добавляем товар в массив
    cart.push(productToAdd);
    saveCart(cart);
    console.log("Товар добавлен в корзину:", productToAdd);
    console.log("Содержимое корзины:", cart);
  } else {
    console.error("Товар не найден");
  }
}

/***************************************************
 * Функция для показа всплывающего сообщения (toast)
 ***************************************************/
function showToast(message) {
  // Ищем или создаём контейнер для всех тостов
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    // Пример простых inline-стилей
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.5rem';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // Создаём сам тост
  const toast = document.createElement('div');
  toast.textContent = message;
  // Минимальные стили для тоста
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '0.75rem 1rem';
  toast.style.borderRadius = '4px';
  toast.style.cursor = 'pointer';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  // При клике — убрать тост раньше таймера
  toast.addEventListener('click', () => {
    toast.remove();
    clearTimeout(timer);
  });

  // Добавляем в контейнер
  toastContainer.appendChild(toast);

  // Убираем через 3 секунды
  const timer = setTimeout(() => {
    toast.remove();
  }, 3000);
}

/***************************************************
 * 1) Находим элементы, считываем ?id=...
 ***************************************************/
const productPageEl = document.getElementById('productPage');
const similarContainer = document.getElementById('similarProducts');
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id');

// Ищем товар
const product = products.find(p => p.id === productId);

/***************************************************
 * 2) Рендер карточки товара
 ***************************************************/
if (!product) {
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
} else {
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

  // Формируем HTML карточки
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
        <div class="product-description">${compositionHtml}</div>
        <button class="btn" id="addToCartBtn">В корзину</button>
      </div>
    </div>
  `;

  // Обработчик «В корзину»
  const addToCartButton = document.getElementById('addToCartBtn');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      // Добавляем товар
      addToCart(product.id);

      // Меняем стиль и текст кнопки
      addToCartButton.classList.add('btn--white-red');
      addToCartButton.textContent = 'Добавить ещё';

      // Показываем всплывающее сообщение
      showToast("Товар успешно добавлен в Корзину");
    });
  }

  // Рендерим «Похожие товары»
  renderSimilarProducts(product);
}

/***************************************************
 * 3) Функция рендера «Похожие товары»
 ***************************************************/
function renderSimilarProducts(currentProduct) {
  // 1) Ищем товары той же категории, исключаем текущий
  const sameCategory = products.filter(
    p => p.category === currentProduct.category && p.id !== currentProduct.id
  );

  if (!sameCategory.length) {
    similarContainer.innerHTML = '';
    return;
  }

  // 2) Создаём заголовок «Похожие товары»
  let html = `<h2 class="similar-title">Похожие товары</h2>`;
  html += `<div class="similar-list">`;

  // 3) Генерируем мини-карточки
  sameCategory.forEach(item => {
    const imageSrc = (item.images && item.images.length > 0)
      ? item.images[0]
      : '../assets/images/no-image.jpg';

    html += `
      <div class="similar-item">
        <!-- Кликабельная картинка -->
        <a href="product-page.html?id=${item.id}" class="similar-img-link">
          <img src="${imageSrc}" alt="${item.title}" class="similar-img" />
        </a>
        <h3 class="similar-item-title">${item.title}</h3>
        <p class="similar-item-price">${item.price}₽</p>
        <!-- Кнопка (или ссылка) "Подробнее" -->
        <a href="product-page.html?id=${item.id}" class="btn btn--transparent">
          Подробнее
        </a>
      </div>
    `;
  });

  html += `</div>`;
  similarContainer.innerHTML = html;
}