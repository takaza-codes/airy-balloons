/***************************************************
 * Функции для работы с localStorage (корзина)
 ***************************************************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const productToAdd = products.find(p => p.id === productId);
  if (productToAdd) {
    cart.push(productToAdd);
    saveCart(cart);
    console.log("Товар добавлен в корзину:", productToAdd);
    console.log("Содержимое корзины:", cart);
    // Убрали всплывающее сообщение:
    // alert("Товар добавлен в корзину!");
  } else {
    console.error("Товар не найден");
  }
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
  // Разбиваем description на строки -> делаем <li>...
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

  // Главное изображение
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

  // Навешиваем обработчик «В корзину»
  const addToCartButton = document.getElementById('addToCartBtn');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      addToCart(product.id);
      // Меняем стиль и текст кнопки после добавления
      addToCartButton.classList.add('btn--white-red');
      addToCartButton.textContent = 'Набор в корзине';
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