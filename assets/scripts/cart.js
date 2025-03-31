// Функция для отправки события обновления корзины
function dispatchCartUpdate() {
  document.dispatchEvent(new CustomEvent("cartUpdated"));
}

// Элементы страницы корзины
const cartList = document.getElementById('cartList');
const orderDetails = document.querySelector('.orderDetails');
const orderFinal = document.querySelector('.orderFinal');

// При загрузке страницы отрисовываем корзину
document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartList.innerHTML = '<div id="emptyMsg">В корзине пока пусто! <p>Для выбора товаров <a href="/pages/page-catalog.html">перейдите в Каталог</a></p></div>';
    orderDetails.innerHTML = '';
    orderFinal.innerHTML = '';
    orderForm.style.display = 'none'; // Форма не отображается при пустой корзине
  } else {
    cartList.innerHTML = ''; // Очищаем список перед рендером, чтобы не дублировать товары

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('cartItem');

      li.innerHTML = `
        <div class="itemImage">
          <img src="${item.images}" alt="Фото товара" class="itemPhoto">
        </div>
        <p class="itemName">${item.title}</p>
        <div class="itemCounter">
          <button class="decrement" data-id="${item.id}">−</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increment" data-id="${item.id}">+</button>
        </div>
        <h4 class="price">${item.price * item.quantity} ₽</h4>
        <button class="removeBtn" data-index="${index}"></button>
      `;
      cartList.appendChild(li);
    });

    // Кнопка "Удалить" (полностью убрать товар)
    const removeBtns = document.querySelectorAll('.removeBtn');
    removeBtns.forEach(button => {
      button.addEventListener('click', function () {
        const index = button.getAttribute("data-index");
        removeItemFromCart(index);
        renderCart(); 
      });
    });

    // Обработчики кнопок "+" и "−" для изменения количества
    cartList.querySelectorAll('.increment').forEach(btn => {
      btn.addEventListener('click', () => {
        addOneToCart(+btn.dataset.id);
        renderCart(); 
      });
    });

    cartList.querySelectorAll('.decrement').forEach(btn => {
      btn.addEventListener('click', () => {
        removeOneFromCart(+btn.dataset.id);
        renderCart();
      });
    });
  }
  updateTotal(); // Обновляем итоговые данные
}

// Удалить товар по индексу
function removeItemFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); 
    dispatchCartUpdate(); // Отправляем событие обновления корзины
  }
}

// Увеличить количество товара на 1 (если товар уже есть в корзине)
function addOneToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
    productInCart.quantity++; 
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatchCartUpdate();
  }
}

// Уменьшить количество товара на 1, если оно больше 1, иначе удалить товар
function removeOneFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatchCartUpdate();
  }
}

// Элементы для отображения итоговых данных (сумма, количество)
const totalSumDisplay = document.getElementById("totalSum");
const totalItemsDisplay = document.getElementById("totalItems");
const totalItemsSum = document.getElementById("totalItemsSum");

function updateTotal() {
  let total = 0;
  let totalItems = 0;
  // Читаем корзину из localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(item => {
    total += item.price * item.quantity; 
    totalItems += item.quantity;       
  });
  totalSumDisplay.textContent = `${total} ₽`;
  totalItemsSum.textContent = `${total} ₽`;
  totalItemsDisplay.textContent = totalItems;
}

// Отображение деталей заказа (после заполнения формы)
const deliveryPrice = document.getElementById("deliveryPrice");
const totalOrderSum = document.getElementById("totalOrderSum");

function renderOrderFinal() {
  const existingDeliveryMsg = orderFinal.querySelector('div'); 

  if (deliveryOption.value === "Рассчитать") {
    specialOption();
  } else {
    if (existingDeliveryMsg) {
      existingDeliveryMsg.remove();
    }
    noSpecialOption();
  }
}

function specialOption() {
  deliveryPrice.style.display = 'none';
  totalOrderSum.style.display = 'none';
  orderFinal.querySelector('p:nth-child(4)').style.display = 'none';
  orderFinal.querySelector('p:nth-child(6)').style.display = 'none';
  
  if (!orderFinal.querySelector('div')) {
    const deliveryMsg = document.createElement('div');
    deliveryMsg.style.color = 'rgb(238, 27, 85)';
    deliveryMsg.textContent = 'Без учета доставки';
    orderFinal.appendChild(deliveryMsg);
  }
}

function noSpecialOption() {
  deliveryPrice.style.display = 'block';
  totalOrderSum.style.display = 'block';
  orderFinal.querySelector('p:nth-child(4)').style.display = 'block';
  orderFinal.querySelector('p:nth-child(6)').style.display = 'block';
  deliveryCost = Number(deliveryOption.value);
  deliveryPrice.textContent = `${deliveryCost} ₽`;
  const totalItemsCost = parseInt(totalItemsSum.textContent.replace(/\D/g, ""));
  totalOrderSum.textContent = `${deliveryCost + totalItemsCost} ₽`;
}

document.getElementById("deliveryOptions").addEventListener('change', renderOrderFinal);

// Валидация формы заказа
const orderForm = document.forms.orderForm;
const clientName = orderForm.elements.clientName;
const errorName = document.getElementById("errorName");
const clientTel = orderForm.elements.clientTel;
const errorTel = document.getElementById("errorTel");
const deliveryOption = orderForm.elements.deliveryOption;
const errorDelivery = document.getElementById("errorDelivery");
const deliveryAddress = orderForm.elements.deliveryAddress;
const errorAddress = document.getElementById("errorAddress");
const policyCheckbox = orderForm.elements.policyCheckbox;
const policyError = document.getElementById("checkboxError");
const deliveryDate = document.getElementById("deliveryDate");
const errorDate = document.getElementById("errorDate");
const orderComment = document.getElementById("orderComment");
const makeOrderBtn = document.getElementById("makeOrderBtn");

function validateUsername(name) {
  let regex = /^[а-яА-Я ]+$/;
  return regex.test(name.trim());
}

function validateTel(tel) {
  let regex = /^((\\+7|8)+([0-9]){10})$/;
  return regex.test(tel);
}

function enterAddress() {
  deliveryAddress.addEventListener('change', () => {
    if (deliveryAddress.length > 5) {
      errorAddress.display.style = 'none';
      return true;
    }
  })
}

function validateAddress(address) {
  if(address.value.trim() === '' && (Number(deliveryOption.value) > 0 || deliveryOption.value === "Рассчитать")) {
    return false;
  }
  return true;
}

deliveryAddress.addEventListener('input', () => {
  if (validateAddress(deliveryAddress)) {
    errorAddress.style.display = 'none';
  } else {
    errorAddress.textContent = 'Укажите адрес для доставки заказа';
    errorAddress.style.display = 'block';
  }
});

deliveryDate.addEventListener('input', () => {
  if(deliveryDate.value) {
    errorDate.style.display = 'none';
  }
});

policyCheckbox.addEventListener('change', function () {
  if (policyCheckbox.checked) {
    policyError.style.display = 'none';
    makeOrderBtn.removeAttribute('disabled');
  } else {
    policyError.textContent = 'Необходимо согласие с условиями';
    policyError.style.display = 'block';
    makeOrderBtn.setAttribute('disabled', "");
  }
});

orderForm.addEventListener('submit', function(evt) {
  evt.preventDefault();
  let hasError = false;

  // Скрываем сообщения об ошибках
  errorName.style.display = 'none';
  errorTel.style.display = 'none';
  errorAddress.style.display = 'none';
  errorDelivery.style.display = 'none';
  errorDate.style.display = 'none';
  policyError.style.display = 'none';

  // Валидация полей
  if (clientName.value.trim() === '' || !validateUsername(clientName.value)) {
    errorName.textContent = 'Укажите Ваше имя';
    errorName.style.display = 'block';
    clientName.style.margin = '0';
    hasError = true;
  }

  if (!validateTel(clientTel.value)) {
    errorTel.textContent = 'Укажите Ваш номер телефона';
    errorTel.style.display = 'block';
    clientTel.style.margin = '0';
    hasError = true;
  }

  if (!deliveryOption.value) {
    errorDelivery.textContent = 'Выберите один из вариантов получения заказа';
    errorDelivery.style.display = 'block';
    hasError = true;
  }

  if (!validateAddress(deliveryAddress)) {
    errorAddress.textContent = 'Укажите адрес для доставки заказа';
    errorAddress.style.display = 'block';
    hasError = true;
  }
  
  // Проверка на наличие даты доставки
  if (!deliveryDate.value) {
    errorDate.textContent = 'Укажите дату получения заказа';
    errorDate.style.display = 'block';
    hasError = true;
  }

  if (!policyCheckbox.checked) {
    policyError.textContent = 'Необходимо согласие с условиями';
    policyError.style.display = 'block';
    hasError = true;
  }

  // Если нет ошибок, отправляем данные на сервер через Netlify Function
  if (!hasError) {
    // 1. Считываем корзину
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Подсчитываем сумму и количество
    let total = 0;
    let totalItems = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      totalItems += item.quantity;
    });

    // 3. Формируем orderData с данными пользователя и корзиной
    const orderData = {
      user: {
        clientName: clientName.value,
        clientTel: clientTel.value,
        deliveryOption: deliveryOption.value,
        deliveryAddress: deliveryAddress.value,
        deliveryDate: deliveryDate.value,
        orderComment: orderComment.value,
      },
      cart: cart,
      total: total,
      totalItems: totalItems
    };

    // 4. Отправляем запрос
    fetch('/.netlify/functions/sendOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        return response.json();
      })
      .then(data => {
        console.log('Ответ от функции:', data);
        // Очищаем корзину и сбрасываем форму
        cartList.innerHTML = '<div id="emptyMsg">В корзине пусто! Для выбора товаров <a href="/pages/page-catalog.html">перейдите в Каталог</a></div>';
        orderDetails.innerHTML = '';
        orderFinal.innerHTML = '';
        localStorage.removeItem('cart');
        successBtn();
        setTimeout(restoreBtn, 3000);
        orderForm.reset();
        orderForm.innerHTML = ''; // Форма не отображается при пустой корзине
      })
      .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
        showErrorPopup();
      });
  }
});

// Изменение поведения кнопки при успешной отправке заказа
function successBtn() {
  makeOrderBtn.style.color = "rgb(238, 27, 85)";
  makeOrderBtn.style.backgroundColor = "rgb(255, 255, 255)";
  makeOrderBtn.style.border = "1px solid rgb(238, 27, 85)";
  makeOrderBtn.textContent = "Заказ оформлен!";
}

function restoreBtn() {
  makeOrderBtn.setAttribute('disabled', '');
  makeOrderBtn.style.color = "rgb(255, 255, 255)";
  makeOrderBtn.style.backgroundColor = "rgb(238, 27, 85)";
  makeOrderBtn.style.border = "none";
  makeOrderBtn.textContent = "Оформить заказ";
}

// Поп-ап при ошибке отправки запроса
function showErrorPopup() {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = document.getElementById("popupMessage");

  popupMessage.innerHTML = `При отправке произошла ошибка! Пожалуйста, <a href="https://wa.me/79272123514" target="_blank">свяжитесь с нами напрямую</a>`;
  popupContainer.classList.add("show-popup");

  setTimeout(() => {
    popupContainer.classList.remove("show-popup");
  }, 5000);
}

// При получении события обновления корзины перерисовываем список
document.addEventListener("cartUpdated", renderCart);
