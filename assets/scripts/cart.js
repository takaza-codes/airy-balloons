//Отображение товаров, добавленных в корзину
const cartList = document.getElementById('cartList')

// document.addEventListener('DOMContentLoaded', renderCart());

// function renderCart() {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const cartList = document.getElementById('cartList');

//     if (cart.length === 0) {
//         cartList.innerHTML = '<div id="emptyMsg">В корзине пока пусто!</div>';
//     } else {
//         cart.forEach((item, index) => {
//             let item = products[index];
//             const li = document.createElement('li');
//             li.classList.add('cartItem');
//             li.innerHTML = `
//             <div class="itemImage"><img src="${item.images}" alt="Фото товара" class="itemPhoto"></div>
//                 <p class="itemName">p${item.title}</p>
//                 <div class="itemCounter">
//     <button class="decrement">−</button>
//     <span class="quantity">1</span>
//     <button class="increment">+</button>
//     </div>
//                 <h4 class="price">${item.price}</h4>
//                 <button class="removeBtn" data-index="${index}>X</button>`
//             cartList.appendChild(li);
//         });
//     }
// }

//Удаление товара из корзины
const removeBtns = document.querySelectorAll('.removeBtn');
removeBtns.forEach(button => {
    button.addEventListener('click', function () {
        document.querySelector('.cartItem').innerHTML = '';
        // location.reload();
    });
});

//Счетчик количества позиций

// const cartItems = document.querySelectorAll(".cartItem");

// cartItems.forEach((item) => {
//     const decrementBtn = item.querySelector(".decrement");
//     const incrementBtn = item.querySelector(".increment");
//     const quantityDisplay = item.querySelector(".quantity");
//     const priceDisplay = item.querySelector(".price");
//     const basePrice = parseInt(priceDisplay.dataset.price); //dataset??
//     const totalSumDisplay = document.getElementById("totalSum");

//     function updateTotal() {
//       let total = 0;
//       document.querySelectorAll(".cart-item").forEach((cartItem) => {
//         const qty = parseInt(cartItem.querySelector(".quantity").textContent);
//         const price = parseInt(cartItem.querySelector(".price").textContent);
//         total += qty * price;
//       });
//       totalSumDisplay.textContent = `${total} ₽`;
//     }

//     incrementBtn.addEventListener("click", () => {
//       let quantity = parseInt(quantityDisplay.textContent);
//       quantity++;
//       quantityDisplay.textContent = quantity;
//       priceDisplay.textContent = basePrice * quantity;
//       updateTotal();
//     });

//     decrementBtn.addEventListener("click", () => {
//       let quantity = parseInt(quantityDisplay.textContent);
//       if (quantity > 1) {
//         quantity--;
//         quantityDisplay.textContent = quantity;
//         priceDisplay.textContent = basePrice * quantity;
//         updateTotal();
//       }
//     });

//     updateTotal();
//   });

const decrementBtn = document.querySelector(".decrement");
const incrementBtn = document.querySelector(".increment");
const quantityDisplay = document.querySelector(".quantity");

incrementBtn.addEventListener("click", () => {
  let quantity = parseInt(quantityDisplay.textContent);
  quantity++;
  quantityDisplay.textContent = quantity;
});
decrementBtn.addEventListener("click", () => {
  let quantity = parseInt(quantityDisplay.textContent);
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});


//Отображение деталей заказа до формы



//Отображение деталей заказа после формы



//Валидация формы
const orderForm = document.forms.orderForm;
const clientName = orderForm.elements.clientName;
const errorName = document.getElementById('errorName');
const clientTel = orderForm.elements.clientTel;
const errorTel = document.getElementById('errorTel');
const deliveryOption = orderForm.elements.deliveryOption;
const errorDelivery = document.getElementById('errorDelivery');
const deliveryAddress = orderForm.elements.deliveryAddress;
const errorAddress = document.getElementById('errorAddress');
const policyCheckbox = orderForm.elements.policyCheckbox;
const policyError = document.getElementById('checkboxError');
const makeOrderBtn = document.getElementById('makeOrderBtn');

function validateUsername(name) {
  let regex = /^[а-яА-Я ]+$/;
  return regex.test(name.trim());
}

function validateTel(tel) {
  let regex = /^((\+7|8)+([0-9]){10})$/;
  return regex.test(tel);
}

function validateAddress(address) {
  if((address.value.trim() === '' && (Number(address.value) > 0)) || (address.validity.patternMismatch)) {
    return false;
  }
}

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
  policyError.style.display = 'none';

  if ((clientName.value.trim() === '') || (!validateUsername(clientName.value))) {
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

  if (validateAddress(deliveryAddress)) {
    errorAddress.textContent = 'Укажите адрес для доставки заказа';
    errorAddress.style.display = 'block';
    hasError = true;
  }

  if (!deliveryOption.value) {
    errorDelivery.textContent = 'Выберите один из вариантов получения товара'
    hasError = true;
  }

  if (!policyCheckbox.checked) {
        hasError = true;
    }

  if (!hasError) {
      const orderInfo = [clientName.value, clientTel.value, deliveryOption.value, deliveryAddress.value];
      alert('Форма заказа успешно отправлена!');
      console.log(orderInfo);
      orderForm.reset();
      }
});


//Валидация способа получения




//Очистка/сброс корзины
const clearCartBtn = document.getElementById('clearCartBtn');
clearCartBtn.addEventListener('click', () => {
    document.querySelector('.cartItems').innerHTML = '<div id="emptyMsg">В корзине пусто!</div>';
    localStorage.setItem('cart') = [];
});


//Отправка формы в мессенджер
// makeOrderBtn.addEventListener('click', () => {
//     validateForm();
//     if (validateForm()){
//         //
//     }
// })