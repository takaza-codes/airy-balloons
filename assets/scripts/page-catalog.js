const rootGoods = document.getElementById("page-catalog");
class Goods {
  render() {
    let boysCatalog = "";
    let girlsCatalog = "";
    let newbornCatalog = "";
    let genderPartyCatalog = "";
    let womanCatalog = "";
    let manCatalog = "";
    let bacheloretteCatalog = "";
    let valentinesCatalog = "";

    products.forEach(({ id, category, images, title, price }) => {
      const itemHTML = `
        <li class="goods-element">
          <img class="goods-element__img" src ="${images}"/>
          <h2 class="goods-element__price">${price} p</h2>
          <h3 class="goods-element__title">${title}</h3>
          <div class="buttons">
<a class="view-details" href="product-page.html?id=${id}">Подробнее</a>
<a class="add-to-cart" data-id="${id}" data-title="${title}" data-price="${price}">В корзину</a>
          </div>
        </li>`;

      if (category === "boy") {
        boysCatalog += itemHTML;
      } else if (category === "girl") {
        girlsCatalog += itemHTML;
      } else if (category === "newborn") {
        newbornCatalog += itemHTML;
      } else if (category === "gender-party") {
        genderPartyCatalog += itemHTML;
      } else if (category === "woman") {
        womanCatalog += itemHTML;
      } else if (category === "man") {
        manCatalog += itemHTML;
      } else if (category === "bachelorette") {
        bacheloretteCatalog += itemHTML;
      } else if (category === "valentines") {
        valentinesCatalog += itemHTML;
      }
    });

    rootGoods.innerHTML = `
      <h1 class="goods-element__category">Для мальчиков</h1>
      <ul class="goods-container">${boysCatalog}</ul>
      <h1 class="goods-element__category">Для девочек</h1>
      <ul class="goods-container">${girlsCatalog}</ul>
      <h1 class="goods-element__category">Выписка из роддома</h1>
      <ul class="goods-container">${newbornCatalog}</ul>
      <h1 class="goods-element__category">Гендер Пати</h1>
      <ul class="goods-container">${genderPartyCatalog}</ul>
      <h1 class="goods-element__category">Девушкам</h1>
      <ul class="goods-container">${womanCatalog}</ul>
      <h1 class="goods-element__category">Мужчинам</h1>
      <ul class="goods-container">${manCatalog}</ul>
      <h1 class="goods-element__category">Девичник</h1>
      <ul class="goods-container">${bacheloretteCatalog}</ul>
      <h1 class="goods-element__category">14 февраля</h1>
      <ul class="goods-container">${valentinesCatalog}</ul>
    `;
    this.addCartEventListeners();
  }
  addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = button.dataset.id;
        const productTitle = button.dataset.title;
        const productPrice = button.dataset.price;

        this.addToCart(productId, productTitle, productPrice);
      });
    });
  }

  addToCart(id, title, price) {
    // Получаем текущую корзину из localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Проверяем, есть ли товар уже в корзине
    const existingProductIndex = cart.findIndex((item) => item.id === id);

    if (existingProductIndex > -1) {
      // Если товар уже есть, увеличиваем его количество
      cart[existingProductIndex].quantity++;
    } else {
      // Если товара нет, добавляем его в корзину
      cart.push({
        id: id,
        title: title,
        price: price,
        quantity: 1,
      });
    }

    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${title} добавлен в корзину!`); // Уведомление о добавлении товара
  }
}

const goodsPage = new Goods();
goodsPage.render();
