const fetch = require('node-fetch'); // node-fetch@2, CommonJS

exports.handler = async (event, context) => {
  // Разрешаем только POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    // Парсим тело запроса
    const body = JSON.parse(event.body);

    // Ожидаем, что в body есть { user, cart }
    const { user, cart } = body;

    // Считываем токен и chat_id из переменных окружения Netlify
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Формируем текст сообщения
    // 1) Данные пользователя
    let text = `Новый заказ:\n`;
    text += `Имя: ${user.name}\n`;
    text += `Телефон: ${user.tel}\n`;
    text += `Способ получения: ${user.deliveryOption}\n`;
    if (user.address) {
      text += `Адрес: ${user.address}\n`;
    }
    if (user.date) {
      text += `Дата/время: ${user.date}\n`;
    }
    if (user.comment) {
      text += `Комментарий: ${user.comment}\n`;
    }
    text += `\n`;

    // 2) Данные корзины
    if (!cart || cart.length === 0) {
      text += `Корзина: пустая\n`;
    } else {
      text += `Корзина:\n`;
      let totalPrice = 0;
      cart.forEach((item, index) => {
        // Убедитесь, что item.quantity есть. Если нет, возьмите 1.
        const quantity = item.quantity || 1;
        const itemCost = quantity * item.price;
        totalPrice += itemCost;

        text += `${index + 1}. ${item.title}\n`;
        text += `   Кол-во: ${quantity}, Цена за все: ${itemCost}\n`;
      });
      text += `\nИтого по товарам: ${totalPrice} ₽\n`;
    }

    // 3) Отправляем запрос в Телеграм
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
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
    console.error('sendOrder error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};
