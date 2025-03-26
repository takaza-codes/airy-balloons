// Находим контейнер каталога
const catalogEl = document.getElementById('catalog');

// Функция для рендера списка товаров
function renderCatalog() {
  // Очищаем контейнер каталога на случай, если вызываем функцию повторно
  catalogEl.innerHTML = '';

  // Перебираем массив products
  products.forEach((product) => {
    // Создаём обёртку для карточки
    const itemEl = document.createElement('div');
    itemEl.classList.add('catalog-item');

    // Если у товара есть хотя бы одна картинка, берём product.images[0].
    // Иначе используем заглушку 'assets/images/no-image.jpg'.
    const mainImage = (product.images && product.images.length > 0)
      ? product.images[0]
      : 'assets/images/no-image.jpg';

    // Генерируем HTML-контент карточки:
    // 1. Ссылка-обёртка для картинки
    // 2. Заголовок
    // 3. Цена
    // 4. Кнопка «Подробнее»
    itemEl.innerHTML = `
      <a href="product-page.html?id=${product.id}">
        <img
          src="${mainImage}"
          alt="${product.title}"
          class="item-image"
        />
      </a>
      <h2>${product.title}</h2>
      <p class="price">${product.price}₽</p>
      <a href="product-page.html?id=${product.id}" class="btn">Подробнее</a>
    `;

    // Добавляем карточку в контейнер
    catalogEl.appendChild(itemEl);
  });
}

// Запускаем рендер каталога при загрузке
renderCatalog();