document.addEventListener("DOMContentLoaded", () => { 

// ====================== Корзина ======================

// Функция для отправки события обновления корзины (используется в разных файлах)
function dispatchCartUpdate() {
  document.dispatchEvent(new CustomEvent("cartUpdated"));
}

// (Изменение №A) Функция для получения корзины из localStorage
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

// Функция для сохранения корзины в localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/*  
// --- Блок синхронизации между вкладками (использование BroadcastChannel) --- 

// Создаём канал для синхронизации между вкладками/страницами (Изменение №S1)
let cartChannel;
if ('BroadcastChannel' in window) {
  cartChannel = new BroadcastChannel('cartChannel');
}

// Функция для обновления корзины в других вкладках и отправки кастомного события
function updateCartAcrossTabs() {
  if (cartChannel) {
    cartChannel.postMessage('updateCart');
  }
  if (typeof dispatchCartUpdate === 'function') {
    dispatchCartUpdate();
  }
}
*/

// Если синхронизация через API отключена, оставляем updateCartAcrossTabs с вызовом только кастомного события:
function updateCartAcrossTabs() {
  dispatchCartUpdate();
}

// (Изменение №B) Функция addToCart – если товар уже есть, увеличиваем quantity, иначе добавляем объект с полем quantity = itemCount.
function addToCart(productId, itemCount = 1) {
  const cart = getCart();
  // Предполагается, что глобальный массив products определён и доступен
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += itemCount; // увеличиваем quantity
  } else {
    // Добавляем новый объект с полем quantity = itemCount
    cart.push({ ...productToAdd, quantity: itemCount });
  }

  saveCart(cart);
  showToast(`${productToAdd.title} добавлен в корзину`);
  updateCartAcrossTabs(); // уведомляем другие вкладки (через кастомное событие)
}

// (Изменение №C) Функция removeFromCart – уменьшает quantity, если >1, иначе удаляет товар.
function removeFromCart(productId) {
  const cart = getCart();
  const index = cart.findIndex(p => p.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--; // уменьшаем quantity
      showToast("Количество уменьшено");
    } else {
      cart.splice(index, 1);
      showToast("Товар удалён из корзины");
    }
    saveCart(cart);
    updateCartAcrossTabs(); // уведомляем другие вкладки (через кастомное событие)
  }
}

// Функция для отображения тост-сообщений
function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    Object.assign(toastContainer.style, {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      zIndex: '9999',
      pointerEvents: 'none'
    });
    document.body.appendChild(toastContainer);
  }

  // Удаляем старый тост, если он есть
  const oldToast = toastContainer.querySelector('.toast');
  if (oldToast) {
    oldToast.remove();
  }

  // Создаём новый тост
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    backgroundColor: 'rgb(242, 215, 219)',
    color: 'rgb(30, 26, 26)',
    padding: '16px',
    width: '320px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontSize: '18px',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    cursor: 'pointer',
    pointerEvents: 'auto',
    textAlign: 'center'
  });

  toastContainer.appendChild(toast);

  // Запускаем анимацию появления
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Убираем по клику
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    hide(toast);
  });

  // Авто‑скрытие через 3 секунды
  const timer = setTimeout(() => hide(toast), 3000);

  function hide(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    setTimeout(() => el.remove(), 300);
  }
}

// ====================== Рендер карточки товара ======================

// Получаем параметры из URL и идентификатор товара
const urlParams = new URLSearchParams(window.location.search);
const productId = +urlParams.get('id');

// Находим элементы страницы для отображения товара и похожих товаров
const productPageEl = document.getElementById('productPage');
const similarContainer = document.getElementById('similarProducts');

// Ищем товар в глобальном массиве products
const product = products.find(p => p.id === productId);

// Если товар не найден, выводим сообщение
if (!product) {
  productPageEl.innerHTML = '<p>Товар не найден!</p>';
} else {
  // Разбиваем описание товара на строки для создания списка
  const lines = product.description.split('\n').map(line => line.trim()).filter(Boolean);
  const listItems = lines.map(line => `<li>${line}</li>`).join('');
  // Определяем основное изображение товара (если нет – подставляем заглушку)
  const mainImage = product.images?.[0] || '../assets/images/no-image.jpg';

  // Формируем HTML-разметку страницы товара
  productPageEl.innerHTML = `
    <h2 class="product-title">${product.title}</h2>
    <div class="product-card">
      <div class="product-images">
        <div class="main-image">
          <img src="${mainImage}" alt="${product.title}" />
        </div>
      </div>
      <div class="product-info">
        <p class="product-price">${product.price}₽</p>
        <div class="order-controls" id="orderControls">
          <button class="btn" id="orderBtn">В корзину</button>
          <div class="quantity-block">
            <button class="decrement">−</button>
            <span class="quantity-num">0</span>
            <button class="increment">+</button>
          </div>
        </div>
        <div class="product-description">
          <ul>${listItems}</ul>
          <p>Состав набора, цвет шаров, надпись можно изменить по вашему желанию.</p>
        </div>
      </div>
    </div>
  `;

  // -------------- Логика счётчика товара --------------

  // Объявляем переменные, связанные с количеством товара и элементами управления
  let quantity = 0;
  const orderControls = document.getElementById("orderControls");
  const orderBtn = document.getElementById("orderBtn");
  const quantityNum = document.querySelector(".quantity-num");
  const incrementBtn = document.querySelector(".increment");
  const decrementBtn = document.querySelector(".decrement");

  // Функция обновления отображения количества товара
  function updateQuantityDisplay() {
    quantityNum.textContent = quantity;
  }

  // При загрузке страницы проверяем, есть ли этот товар в корзине
  const cart = getCart();
  const itemInCart = cart.find(item => item.id === productId);
  if (itemInCart) {
    quantity = itemInCart.quantity;
    orderControls.classList.add("active");
    orderBtn.style.display = 'none';
  } else {
    quantity = 0;
  }
  updateQuantityDisplay();

  // Обработчик клика по кнопке "В корзину"
  orderBtn.addEventListener("click", () => {
    quantity = 1;
    orderControls.classList.add("active");
    updateQuantityDisplay();
    orderBtn.style.display = 'none';
    addToCart(product.id, 1);
  });

  // Обработчик кнопки "+" для увеличения количества товара
  incrementBtn.addEventListener("click", () => {
    quantity++;
    updateQuantityDisplay();
    addToCart(product.id, 1);
  });

  // Обработчик кнопки "−" для уменьшения количества товара
  decrementBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      updateQuantityDisplay();
      removeFromCart(product.id);
    }
    if (quantity === 0) {
      orderControls.classList.remove("active");
      orderBtn.style.display = 'inline-block';
    }
  });

  /*  
  // --- Блок синхронизации через API (BroadcastChannel) на странице товара --- 
  // Этот блок закомментирован, так как мы отключаем межвкладочную синхронизацию через API.
  if (cartChannel) {
    cartChannel.onmessage = (event) => {
      if (event.data === 'updateCart') {
        const cart = getCart();
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
          quantity = itemInCart.quantity;
          orderControls.classList.add("active");
          orderBtn.style.display = 'none';
        } else {
          quantity = 0;
          orderControls.classList.remove("active");
          orderBtn.style.display = 'inline-block';
        }
        updateQuantityDisplay();
      }
    };
  }
  */

  // Оставляем кастомное событие "cartUpdated" для синхронизации (например, между страницей товара и страницей корзины)
  // document.addEventListener("cartUpdated", () => { ... }); // можно добавить, если требуется

  // Функция для рендера похожих товаров
  function renderSimilarProducts(currentProduct) {
    // Фильтруем товары той же категории, исключая текущий
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
      const imageSrc = item.images?.[0] || '../assets/photos/no-photo.jpg';
      html += `
        <div class="similar-item">
          <a href="product-page.html?id=${item.id}" class="similar-img-link">
            <img src="${imageSrc}" alt="${item.title}" class="similar-img" />
          </a>
          <h3 class="similar-item-title">${item.title}</h3>
          <p class="similar-item-price">${item.price}₽</p>
          <a href="product-page.html?id=${item.id}" class="btn btn--transparent">Подробнее</a>
        </div>
      `;
    });

    html += `</div>`;
    similarContainer.innerHTML = html;
  }

  // Вызываем функцию для рендера похожих товаров
  renderSimilarProducts(product);
}
});