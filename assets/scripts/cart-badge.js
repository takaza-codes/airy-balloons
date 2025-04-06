// cart-badge.js
document.addEventListener('DOMContentLoaded', () => {
  updateTotal();
});

function updateTotal() {
  let total = 0;
  let totalItems = 0;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    totalItems += item.quantity;
  });
  
  // Обновление элементов итогов (если они существуют на странице)
  const totalSumDisplay = document.getElementById("totalSum");
  const totalItemsSum = document.getElementById("totalItemsSum");
  const totalItemsDisplay = document.getElementById("totalItems");

  if (totalSumDisplay) totalSumDisplay.textContent = `${total} ₽`;
  if (totalItemsSum) totalItemsSum.textContent = `${total} ₽`;
  if (totalItemsDisplay) totalItemsDisplay.textContent = totalItems;

  // Обновляем бейдж в шапке
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

// Обновляем данные при получении события обновления корзины
document.addEventListener("cartUpdated", updateTotal);

window.addEventListener('storage', (event) => {
  // Если изменялся ключ "cart", обновляем бейдж и итоги
  if (event.key === 'cart') {
    updateTotal();
  }
});