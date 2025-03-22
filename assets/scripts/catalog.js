// main.js

// Находим нужные элементы
const catalogEl = document.getElementById('catalog');
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModal');
const backToCatalogBtn = document.getElementById('backToCatalog');

// Функция для рендера каталога
function renderCatalog() {
  // Очищаем контейнер каталога
  catalogEl.innerHTML = '';

  products.forEach((product) => {
    // Создаём обёртку для карточки
    const productCard = document.createElement('div');
    productCard.classList.add('catalog-item');

    // Формируем HTML для мини-карточки
    productCard.innerHTML = `
      <img 
        src="${(product.images && product.images.length > 0) 
                ? product.images[0] 
                : 'assets/images/no-image.jpg'}"
        alt="${product.title}"
        class="item-image"
      />
      <h2>${product.title}</h2>
      <p class="price">${product.price}₽</p>
      <button class="btn show-details" data-id="${product.id}">Подробнее</button>
    `;

    // Добавляем карточку в каталог
    catalogEl.appendChild(productCard);
  });
}

// Функция, которая открывает модалку и подставляет данные о товаре
function openProductModal(productId) {
  // Ищем товар в массиве products
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Заполняем элементы в модалке
  document.getElementById('productTitle').textContent = product.title;
  document.getElementById('productPrice').textContent = `${product.price}₽`;
  document.getElementById('description').textContent = product.description;

  // Устанавливаем одно изображение (если есть)
  const mainImageEl = document.getElementById('mainImage');
  if (product.images && product.images.length > 0) {
    mainImageEl.src = product.images[0];
    mainImageEl.alt = product.title;
  } else {
    mainImageEl.src = 'assets/images/no-image.jpg';
    mainImageEl.alt = 'Нет изображения';
  }

  // Показываем модалку
  productModal.style.display = 'block';
}

// Инициализация
function init() {
  // Рендерим каталог
  renderCatalog();

  // Делегирование кликов по кнопкам «Подробнее»
  catalogEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('show-details')) {
      const productId = +event.target.dataset.id;
      openProductModal(productId);
    }
  });

  // Кнопки закрытия модалки
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      productModal.style.display = 'none';
    });
  }
  if (backToCatalogBtn) {
    backToCatalogBtn.addEventListener('click', () => {
      productModal.style.display = 'none';
    });
  }
}

// Запускаем
init();