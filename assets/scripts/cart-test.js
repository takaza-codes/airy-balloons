/************************************************************
 * 1) ЛОГИКА КОРЗИНЫ
 ************************************************************/

// Получаем элементы интерфейса
const cartList = document.getElementById('cartList');
const totalItemsDisplay = document.getElementById('totalItems');
const totalSumDisplay = document.getElementById('totalSum');

// Чтение корзины из localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Сохранение корзины
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Отрисовка корзины (упрощённо)
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = '<div>В корзине пока пусто!</div>';
    totalItemsDisplay.textContent = 0;
    totalSumDisplay.textContent = '0 ₽';
    return;
  }

  // Очищаем список перед рендером
  cartList.innerHTML = '';

  let totalItems = 0;
  let totalSum = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('cartItem');

    // Если нет поля quantity, берём 1 по умолчанию
    const quantity = item.quantity || 1;
    const itemSum = item.price * quantity;

    li.innerHTML = `
      <div class="itemImage"><img src="${item.images}" alt="Товар" /></div>
      <p class="itemName">${item.title}</p>
      <div class="itemCounter">
        <button class="decrement" data-index="${index}">−</button>
        <span class="quantity">${quantity}</span>
        <button class="increment" data-index="${index}">+</button>
      </div>
      <h4 class="price">${itemSum}</h4>
      <button class="removeBtn" data-index="${index}">Удалить</button>
    `;

    cartList.appendChild(li);

    totalItems += quantity;
    totalSum += itemSum;
  });

  totalItemsDisplay.textContent = totalItems;
  totalSumDisplay.textContent = totalSum + ' ₽';

  // Навешиваем обработчики +, -, Удалить
  addCartItemListeners();
}

function addCartItemListeners() {
  const cart = getCart();

  // Кнопки + (increment)
  document.querySelectorAll('.increment').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart[index].quantity = (cart[index].quantity || 1) + 1;
      saveCart(cart);
      renderCart();
    });
  });

  // Кнопки - (decrement)
  document.querySelectorAll('.decrement').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const currentQty = cart[index].quantity || 1;
      if (currentQty > 1) {
        cart[index].quantity = currentQty - 1;
        saveCart(cart);
        renderCart();
      }
    });
  });

  // Кнопки Удалить
  document.querySelectorAll('.removeBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

// При загрузке страницы рендерим корзину
document.addEventListener('DOMContentLoaded', renderCart);

/************************************************************
 * 2) ВАЛИДАЦИЯ ФОРМЫ И ОТПРАВКА ДАННЫХ
 ************************************************************/

const orderForm = document.forms.orderForm;

// Элементы формы
const clientName = orderForm.elements.clientName;
const clientTel = orderForm.elements.clientTel;
const deliveryOption = orderForm.elements.deliveryOption; // RadioNodeList
const deliveryAddress = orderForm.elements.deliveryAddress;
const deliveryDate = document.getElementById('deliveryDate');
const orderComment = document.getElementById('orderComment');
const policyCheckbox = orderForm.elements.policyCheckbox;

const errorName = document.getElementById('errorName');
const errorTel = document.getElementById('errorTel');
const errorDelivery = document.getElementById('errorDelivery');
const errorAddress = document.getElementById('errorAddress');
const checkboxError = document.getElementById('checkboxError');

const makeOrderBtn = document.getElementById('makeOrderBtn');

// Примеры простых функций проверки
function validateUsername(name) {
  // Допустим, разрешаем только кириллицу и пробелы
  let regex = /^[а-яА-ЯёЁ\s]+$/;
  return regex.test(name.trim());
}

function validateTel(tel) {
  // Пример: +7XXXXXXXXXX (или 8XXXXXXXXXX)
  let regex = /^(\+7|8)\d{10}$/;
  return regex.test(tel);
}

// Проверка адреса (можно дополнить)
function validateAddress(address) {
  // Если выбрана доставка, адрес не должен быть пустым
  // (пример: если value начинается с "Доставка", тогда адрес обязателен)
  if (deliveryOption.value.startsWith('Доставка') && !address.trim()) {
    return false;
  }
  return true;
}

// Активация кнопки "Оформить заказ" при чекбоксе
policyCheckbox.addEventListener('change', () => {
  if (policyCheckbox.checked) {
    makeOrderBtn.removeAttribute('disabled');
  } else {
    makeOrderBtn.setAttribute('disabled', true);
  }
});

// Обработчик отправки формы
orderForm.addEventListener('submit', async function(evt) {
  evt.preventDefault();
  let hasError = false;

  // Сбрасываем тексты ошибок
  errorName.textContent = '';
  errorTel.textContent = '';
  errorDelivery.textContent = '';
  errorAddress.textContent = '';
  checkboxError.textContent = '';

  // Проверяем Имя
  if (!validateUsername(clientName.value)) {
    errorName.textContent = 'Укажите корректное имя (только кириллица).';
    hasError = true;
  }

  // Проверяем Телефон
  if (!validateTel(clientTel.value)) {
    errorTel.textContent = 'Укажите корректный номер телефона (+7XXXXXXXXXX или 8XXXXXXXXXX).';
    hasError = true;
  }

  // Проверяем выбран ли вариант доставки
  if (!deliveryOption.value) {
    errorDelivery.textContent = 'Выберите способ получения.';
    hasError = true;
  }

  // Проверяем Адрес (если доставка)
  if (!validateAddress(deliveryAddress.value)) {
    errorAddress.textContent = 'Укажите адрес для доставки.';
    hasError = true;
  }

  // Проверяем чекбокс
  if (!policyCheckbox.checked) {
    checkboxError.textContent = 'Необходимо согласие с политикой.';
    hasError = true;
  }

  // Если есть ошибки, прерываем отправку
  if (hasError) return;

  // Собираем данные формы
  const user = {
    name: clientName.value,
    tel: clientTel.value,
    deliveryOption: deliveryOption.value,
    address: deliveryAddress.value,
    date: deliveryDate.value,
    comment: orderComment.value
  };

  // Берём корзину
  const cart = getCart();

  // Отправляем одним запросом
  try {
    const response = await fetch('/.netlify/functions/sendOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, cart }),
    });
    const data = await response.json();

    if (data.ok) {
      alert('Форма заказа успешно отправлена!');
      // Сброс формы и очистка корзины
      orderForm.reset();
      localStorage.setItem('cart', JSON.stringify([]));
      renderCart(); // Перерисовать корзину
    } else {
      alert('Ошибка при отправке: ' + data.error);
    }
  } catch (err) {
    alert('Ошибка при отправке запроса: ' + err.message);
  }
});

/************************************************************
 * 3) КНОПКА "ОЧИСТИТЬ КОРЗИНУ"
 ************************************************************/

const clearCartBtn = document.getElementById('clearCartBtn');
clearCartBtn.addEventListener('click', () => {
  localStorage.setItem('cart', JSON.stringify([]));
  renderCart(); // обновим интерфейс
});
