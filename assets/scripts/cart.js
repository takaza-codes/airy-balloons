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
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cartItem');
            li.innerHTML = `
            <div class="itemImage"><img src="${item.images}" alt="Фото товара" class="itemPhoto"></div>
                <p class="itemName">p${item.title}</p>
                <div class="itemCounter">
    <button class="decrement">−</button>
    <span class="quantity">1</span>
    <button class="increment">+</button>
    </div>
                <h4 class="price">${item.price}</h4>
                <button class="removeBtn" data-index="${index}"></button>`
            cartList.appendChild(li);
        });
    }
}


//Удаление товара из корзины
const removeBtns = document.querySelectorAll('.removeBtn');
removeBtns.forEach(button => {
    button.addEventListener('click', function () {
      const index = this.dataset.index;
      cart.splice(index, 1); // использование cart (не объявлена глобально)
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    });
});



//Счетчик количества позиций
const cartItems = document.querySelectorAll(".cartItem");
const totalSumDisplay = document.getElementById("totalSum");
const totalItemsDisplay = document.getElementById("totalItems");
const totalItemsSum = document.getElementById("totalItemsSum");

function updateTotal() {
  let total = 0;
  let totalItems = 0;
  document.querySelectorAll(".cartItem").forEach((cartItem) => {
    const qty = parseInt(cartItem.querySelector(".quantity").textContent);
    const price = parseInt(cartItem.querySelector(".price").textContent);
    total += qty * price;
    totalItems += qty;
  });
  totalSumDisplay.textContent = `${total} ₽`;
  totalItemsSum.textContent = `${total} ₽`;
  totalItemsDisplay.textContent = totalItems;
}

cartItems.forEach((item) => {
  const decrementBtn = item.querySelector(".decrement");
  const incrementBtn = item.querySelector(".increment");
  const quantityDisplay = item.querySelector(".quantity");
  const priceDisplay = item.querySelector(".price");
  const basePrice = parseInt(priceDisplay.textContent);

  incrementBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityDisplay.textContent);
    quantity++;
    quantityDisplay.textContent = quantity;
    priceDisplay.textContent = basePrice * quantity;
    updateTotal();
  });

  decrementBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      priceDisplay.textContent = basePrice * quantity;
      updateTotal();
    }
  });
  updateTotal();
});

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
  let regex = /^((\+7|8)+([0-9]){10})$/;
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

  errorName.style.display = 'none';
  errorTel.style.display = 'none';
  errorAddress.style.display = 'none';
  errorDelivery.style.display = 'none';
  policyError.style.display = 'none';

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

  if (!hasError) {
    const orderInfo = [
      clientName.value,
      clientTel.value,
      deliveryOption.value,
      deliveryAddress.value,
      deliveryDate.value,
      orderComment.value,
    ];
    alert('Форма заказа успешно отправлена!');
    console.log(orderInfo);
    orderForm.reset(); 
  }
});


//Очистка/сброс корзины
const clearCartBtn = document.getElementById('clearCartBtn');
clearCartBtn.addEventListener('click', () => {
    cartList.innerHTML = '<div id="emptyMsg">В корзине пусто!</div>';
    orderDetails.innerHTML = '';
    orderFinal.innerHTML = '';
    localStorage.setItem('cart') = [];
});


//Отправка формы в мессенджер