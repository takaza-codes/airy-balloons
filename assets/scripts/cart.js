//Отображение товаров, добавленных в корзину

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
//                 <div class="itemNumber">1</div>
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
        const index = this.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
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

//Валидация имени (регэкп)
//Валидация номера тел (регэксп)
//Валидация способа получения
//Валидация чекбокса
//Разблокирование кнопки




//Очистка/сброс корзины
const clearCartBtn = document.getElementById(clearCartBtn);
clearCartBtn.addEventListener('click', () => {
    localStorage.setItem('cart') = [];
});


//Отправка формы в мессенджер
const makeOrderBtn = document.getElementById('makeOrderButton');
makeOrderBtn.addEventListener('click', () => {
    validateForm();
    if (validateForm()){
        //
    }
})