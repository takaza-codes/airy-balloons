const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Разрешаем только POST-запросы
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  
  try {
    if (!event.body) {
      throw new Error("Отсутствует тело запроса");
    }
    
    const body = JSON.parse(event.body);
    
    // Добавляем проверку на наличие объекта user и его поля clientName
    if (!body.user || !body.user.clientName) {
      throw new Error("Неверный формат данных: отсутствует user или clientName");
    }
    
    const { user, cart, total, totalItems } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let text = `Новый заказ:\n`;
    text += `Имя: ${user.clientName}\n`;
    text += `Телефон: ${user.clientTel}\n`;
    text += `Доставка: ${user.deliveryOption}\n`;
    text += `Адрес: ${user.deliveryAddress}\n`;
    text += `Дата/время: ${user.deliveryDate}\n`;
    text += `Комментарий: ${user.orderComment}\n\n`;
    text += `Товаров: ${totalItems}, Сумма: ${total}₽\n\n`;
    
    cart.forEach(item => {
      text += `• ${item.title} (x${item.quantity}) - ${item.price * item.quantity}₽\n`;
    });

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error('Telegram API error: ' + data.description);
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Ошибка в sendOrder:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};