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
<button class="goods-element_btnInformation data-id="${id}">Подробнее</button>
<button class="btn add-to-cart" data-id="${id}">В корзину</button>
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
  }
  addEventListeners() {
    const viewDetailsButtons = document.querySelectorAll(".view-details");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    console.log(`Найдено кнопок "Подробнее": ${viewDetailsButtons.length}`);
    console.log(`Найдено кнопок "В корзину": ${addToCartButtons.length}`);

    viewDetailsButtons.forEach((button) => {
      button.addEventListener("click", (event) => this.viewDetails(event));
    });

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => this.addToCart(event));
    });
  }

  viewDetails(event) {
    const id = event.target.getAttribute("data-id");
    const product = products.find((item) => item.id === id);
    if (product) {
      console.log(`Просмотр деталей товара: ${product.title}`);
    } else {
      console.error("Товар не найден");
    }
  }

  addToCart(event) {
    const id = event.target.getAttribute("data-id");
    const product = products.find((item) => item.id === id);
    if (product) {
      console.log(`Товар добавлен в корзину: ${product.title}`);
    } else {
      console.error("Товар не найден");
    }
  }
}

const goodsPage = new Goods();
goodsPage.render();
goodsPage.addEventListeners();
