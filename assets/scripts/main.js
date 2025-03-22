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
    // Создаём элемент для товара
    const productCard = document.createElement('div');
    productCard.classList.add('catalog-item');

    // Заполняем простую структуру: заголовок, цена, кнопка
    productCard.innerHTML = `
      <h2>${product.title}</h2>
      <p>Цена: ${product.price}₽</p>
      <button class="btn show-details" data-id="${product.id}">Подробнее</button>
    `;

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
  document.getElementById('oldPrice').textContent = product.oldPrice + '₽';
  document.getElementById('productPrice').textContent = product.price + '₽';
  document.getElementById('discount').textContent = '-' + product.discount + '%';
  document.getElementById('composition').innerHTML = `<span>Состав:</span> ${product.composition}`;
  document.getElementById('setNumber').textContent = 'Набор №' + product.setNumber;
  document.getElementById('setPrice').textContent = product.setPrice + '₽';
  document.getElementById('description').textContent = product.description;

  // Главное фото
  const mainImage = document.getElementById('mainImage');
  mainImage.src = product.images[0] || '';
  mainImage.alt = product.title;

  // Миниатюры
  const thumbnailsEl = document.getElementById('thumbnails');
  thumbnailsEl.innerHTML = ''; // очистка
  product.images.forEach((imgSrc) => {
    const thumbImg = document.createElement('img');
    thumbImg.classList.add('thumbnail');
    thumbImg.src = imgSrc;
    thumbImg.alt = 'Миниатюра';
    thumbnailsEl.appendChild(thumbImg);

    // Клик на миниатюру -> смена главной картинки
    thumbImg.addEventListener('click', () => {
      mainImage.src = imgSrc;
    });
  });

  // Показать модалку
  productModal.style.display = 'block';
}

// Инициализация
function init() {
  // Рендерим каталог
  renderCatalog();

  // Вешаем делегирование на каталог, 
  // чтобы ловить клики на кнопки «Подробнее»
  catalogEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('show-details')) {
      const productId = +event.target.dataset.id; // считываем data-id
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
