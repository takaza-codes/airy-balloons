// netlify/functions/sendOrder.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Разрешаем только POST-запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    // Парсим данные из запроса (должны прийти данные формы и корзины)
    const body = JSON.parse(event.body);
    // Ожидаем, что body имеет формат { user: {...}, cart: [...], total: ..., totalItems: ... }
    const { user, cart, total, totalItems } = body;

    // Формируем текст для Telegram
    let text = `Новый заказ:\n\n`;
    text += `Имя: ${user.clientName}\n`;
    text += `Телефон: ${user.clientTel}\n`;
    text += `Доставка: ${user.deliveryOption}\n`;
    text += `Адрес: ${user.deliveryAddress}\n`;
    text += `Дата доставки: ${user.deliveryDate}\n`;
    text += `Комментарий: ${user.orderComment}\n\n`;
    text += `Заказ (${totalItems} шт., сумма: ${total} ₽):\n`;

    cart.forEach(item => {
      text += `• ${item.title} (x${item.quantity}) — ${item.price * item.quantity} ₽\n`;
    });

    // Считываем переменные окружения (настройте их в Netlify)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error('Telegram API error: ' + data.description);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, msg: 'Order sent to Telegram' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};