// Находим контейнер каталога
const catalogEl = document.getElementById('catalog');

// Функция для рендера списка товаров
function renderCatalog() {
  catalogEl.innerHTML = ''; // очистка на всякий случай

  products.forEach((product) => {
    // Создаём обёртку для карточки
    const itemEl = document.createElement('div');
    itemEl.classList.add('catalog-item');

    // Вместо кнопки «Подробнее», используем ссылку <a>, ведущую на product.html?id=...
    // Чтобы вставить картинку, проверяем: если images есть и не пуст, берём [0], иначе заглушку
    itemEl.innerHTML = `
      <img
        src="${(product.images && product.images.length > 0)
          ? product.images[0]
          : 'assets/images/no-image.jpg'}"
        alt="${product.title}"
        class="item-image"
      />
      <h2>${product.title}</h2>
      <p class="price">${product.price}₽</p>
      <!-- Ссылка на страницу товара (product.html), с передачей ID в query-параметре -->
      <a href="product.html?id=${product.id}" class="btn">Подробнее</a>
    `;

    catalogEl.appendChild(itemEl);
  });
}

// Запускаем при загрузке
renderCatalog();