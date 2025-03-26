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

    // Вместо кнопки «Подробнее», используем ссылку <a>, ведущую на product-page.html?id=...
    // Чтобы вставить картинку, проверяем: если images есть и не пуст, берём [0], иначе заглушку
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