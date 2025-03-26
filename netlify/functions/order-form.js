const orderForm = document.forms.orderForm;
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Собираем данные из формы
  const user = {
    clientName: orderForm.elements.clientName.value,
    clientTel: orderForm.elements.clientTel.value,
    deliveryOption: orderForm.elements.deliveryOption.value,
    deliveryAddress: orderForm.elements.deliveryAddress.value,
    deliveryDate: orderForm.elements.deliveryDate.value,
    orderComment: orderForm.elements.orderComment.value,
  };

  // Предполагается, что cart уже хранится в localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Подсчитываем общую сумму и количество товаров
  let total = 0, totalItems = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  try {
    const res = await fetch('/.netlify/functions/sendOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, cart, total, totalItems }),
    });
    const data = await res.json();
    if (data.ok) {
      alert('Заказ отправлен!');
      // Очистка корзины после отправки
      localStorage.removeItem('cart');
    } else {
      alert('Ошибка: ' + data.error);
    }
  } catch (error) {
    alert('Ошибка при отправке заказа: ' + error.message);
  }
});
