// Находим контейнер для вывода товара
const productPageEl = document.getElementById('productPage');

// Считываем параметр "id" из URL, например product.html?id=5
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id'); // преобразуем в число

// Ищем товар в массиве products
const product = products.find((p) => p.id === productId);

if (!product) {
  // Если товар не найден, показываем сообщение
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
} else {
  // Выводим карточку товара
  // Если images нет или пуст, ставим заглушку
  const mainImage = (product.images && product.images.length > 0)
    ? product.images[0]
    : 'assets/images/no-image.jpg';

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
        <p class="description">${product.description}</p>
        <button class="btn">В корзину</button>
      </div>
    </div>

    <!-- Ссылка вернуться в каталог -->
    <p><a href="catalog.html">← Вернуться в каталог</a></p>
  `;
}
