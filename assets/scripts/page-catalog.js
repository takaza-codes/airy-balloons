const rootGoods = document.getElementById("page-catalog");
class Goods {
  constructor() {
    this.cartCountElement = document.getElementById("cart-count"); // Элемент для отображения количества товаров
  }
  render() {
    let girlsCatalog = "";
    let boysCatalog = "";
    let newbornCatalog = "";
    let genderPartyCatalog = "";
    let womanCatalog = "";
    let manCatalog = "";
    let bacheloretteCatalog = "";
    let valentinesCatalog = "";

    products.forEach(({ id, category, images, title, price }) => {
      const itemHTML = `
          <li class="goods-element">
          <a href="product-page.html?id=${id}">
            <img class="goods-element__img" src ="${images}"/>
          </a>
          <h2 class="goods-element__price">${price}₽</h2>
          <a href="product-page.html?id=${id}">
            <h3 class="goods-element__title">${title}</h3>
          </a>
          <div class="buttons">
          <a class="view-details" href="product-page.html?id=${id}">Подробнее</a>
          </div>
        </li>`;

      if (category === "girl") {
        girlsCatalog += itemHTML;
      } else if (category === "boy") {
        boysCatalog += itemHTML;
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
      <h1 class="goods-element__category" id="for-girls-from-index">Для девочек</h1>
      <ul class="goods-container">${girlsCatalog}</ul>
      <h1 class="goods-element__category" id="for-boys-from-index">Для мальчиков</h1>
      <ul class="goods-container">${boysCatalog}</ul>
      <h1 class="goods-element__category" id="for-newborn-from-index">Выписка из роддома</h1>
      <ul class="goods-container">${newbornCatalog}</ul>
      <h1 class="goods-element__category" id="for-genderParty-from-index">Гендер Пати</h1>
      <ul class="goods-container">${genderPartyCatalog}</ul>
      <h1 class="goods-element__category" id="for-woman-from-index">Девушкам</h1>
      <ul class="goods-container">${womanCatalog}</ul>
      <h1 class="goods-element__category" id="for-man-from-index">Мужчинам</h1>
      <ul class="goods-container">${manCatalog}</ul>
      <h1 class="goods-element__category" id="for-bachelorette-from-index">Девичник</h1>
      <ul class="goods-container">${bacheloretteCatalog}</ul>
      <h1 class="goods-element__category" id="for-valentines-from-index">14 февраля</h1>
      <ul class="goods-container">${valentinesCatalog}</ul>
    `;
    this.updateCartCount();
    this.addCartEventListeners();
  }
  addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = button.dataset.id;
        const productTitle = button.dataset.title;
        const productPrice = button.dataset.price;
        const productImage = button
          .closest(".goods-element")
          .querySelector(".goods-element__img").src;
        this.addToCart(productId, productTitle, productPrice, productImage);
      });
    });
  }

  addToCart(id, title, price, images) {
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
        image: images, // Сохраняем изображение
        title: title,
        price: price,
        quantity: 1,
      });
    }

    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${title} добавлен в корзину!`); // Уведомление о добавлении товара
    this.updateCartCount(); // Обновляем счетчик после добавления товара
  }
  updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (this.cartCountElement) {
      this.cartCountElement.textContent = totalCount; // Обновляем текст элемента с количеством товаров
    }
  }
}

const goodsPage = new Goods();
goodsPage.render();

// На странице каталога (после загрузки страницы)
document.addEventListener("DOMContentLoaded", () => {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    // Составляем id для заголовка нужного раздела
    const targetId = `for-${selectedCategory}-from-index`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Прокручиваем страницу к нужному разделу
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    // Убираем значение после использования
    localStorage.removeItem("selectedCategory");
  }
});