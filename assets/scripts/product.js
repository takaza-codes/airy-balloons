// product.js

// Находим контейнер
const productPageEl = document.getElementById('productPage');

// Считываем ?id=... из URL
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id');

// Ищем товар
const product = products.find((p) => p.id === productId);

if (!product) {
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
} else {
  // Разделяем текст description по переводам строк
  // (или ищем маркеры "•" и делаем из них пункты списка)
  const lines = product.description
    .split('\n')            // Разбиваем на строки
    .map(line => line.trim())
    .filter(line => line);  // Убираем пустые строки

  // Формируем <li>...</li> для каждого пункта
  const listItems = lines.map(line => {
    // Удаляем начальный "• ", если есть
    if (line.startsWith('• ')) {
      line = line.substring(2);
    }
    return `<li>${line}</li>`;
  }).join('');

  // Собираем список
  const compositionHtml = `<ul class="composition-list">${listItems}</ul>`;

  // Генерируем финальный HTML карточки
  // Обратите внимание, что вместо product.description
  // выводим переменную compositionHtml (список)
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
        ${compositionHtml}
        <button class="btn">В корзину</button>
      </div>
    </div>
  `;
}