//Отображение товаров, добавленных в корзину
const cartList = document.getElementById('cartList');
const orderDetails = document.querySelector('.orderDetails');
const orderFinal = document.querySelector('.orderFinal');

document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartList.innerHTML = '<div id="emptyMsg">В корзине пока пусто!</div>';
        orderDetails.innerHTML = '';
        orderFinal.innerHTML = '';
    } else {
        cartList.innerHTML = ''; 
        // (Изменение №1) Очищаем список перед рендером, чтобы не дублировать товары

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cartItem');

            // (Изменение №2) Используем item.quantity (число) и item.price * item.quantity
            // Это значит, что при добавлении в корзину мы должны добавлять поле quantity
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

        // (Изменение №3) Обработчики + и − для изменения количества
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
    updateTotal(); // функция для отображения цены и количества
}

// Удалить весь товар (по индексу) — как раньше
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart)); 
    }
}

// (Изменение №4) Увеличить количество на 1 (товар уже есть в корзине)
function addOneToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
    productInCart.quantity++; 
    // Увеличиваем quantity, не дублируя товар
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// (Изменение №5) Уменьшить количество на 1, если оно не 1, иначе удалить товар
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
  }
}

//Счетчик количества позиций
const cartItems = document.querySelectorAll(".cartItem");
const totalSumDisplay = document.getElementById("totalSum");
const totalItemsDisplay = document.getElementById("totalItems");
const totalItemsSum = document.getElementById("totalItemsSum");

function updateTotal() {
  let total = 0;
  let totalItems = 0;
  // (Изменение №6) Вместо чтения DOM, теперь читаем cart из localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(item => {
    total += item.price * item.quantity; 
    totalItems += item.quantity;       
  });
  totalSumDisplay.textContent = `${total} ₽`;
  totalItemsSum.textContent = `${total} ₽`;
  totalItemsDisplay.textContent = totalItems;
}

//Отображение деталей заказа после формы
const deliveryPrice = document.getElementById("deliveryPrice");
const totalOrderSum = document.getElementById("totalOrderSum");

function renderOrderFinal() {
    deliveryCost = Number(deliveryOption.value);
    deliveryPrice.textContent = `${deliveryCost} ₽`;
    const totalItemsCost = parseInt(totalItemsSum.textContent.replace(/\D/g, ""));
    totalOrderSum.textContent = `${deliveryCost + totalItemsCost} ₽`;
}

document.getElementById("deliveryOptions").addEventListener('change', renderOrderFinal);

//Валидация формы
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
  if(address.value.trim() === '' && Number(deliveryOption.value) > 0) {
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
    errorDelivery.textContent = 'Выберите один из вариантов получения товара';
    errorDelivery.style.display = 'block';
    hasError = true;
  }

  if (!validateAddress(deliveryAddress)) {
    errorAddress.textContent = 'Укажите адрес для доставки заказа';
    errorAddress.style.display = 'block';
    hasError = true;
  }

  if (!policyCheckbox.checked) {
    policyError.textContent = 'Необходимо согласие с условиями';
    policyError.style.display = 'block';
    hasError = true;
  }

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
        alert('Форма заказа успешно отправлена!');
        // Очищаем корзину и сбрасываем форму
        cartList.innerHTML = '<div id="emptyMsg">В корзине пусто!</div>';
        orderDetails.innerHTML = '';
        orderFinal.innerHTML = '';
        localStorage.removeItem('cart');
        makeOrderBtn.setAttribute('disabled', '');
        orderForm.reset();
      })
      .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
        alert('Произошла ошибка при отправке заказа.');
      });
  }
);


//Очистка/сброс корзины
clearCartBtn.addEventListener('click', () => {
  localStorage.removeItem('cart');
  cartList.innerHTML = '<div id="emptyMsg">В корзине пусто!</div>';
  orderDetails.innerHTML = '';
  orderFinal.innerHTML = '';
  errorName.style.display = 'none';
  errorTel.style.display = 'none';
  errorAddress.style.display = 'none';
  errorDelivery.style.display = 'none';
  policyError.style.display = 'none';
});

// localStorage.removeItem('cart');
