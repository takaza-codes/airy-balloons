const rootGoods = document.getElementById("page-catalog");

class Goods {
  constructor() {
    this.cartCountElement = document.getElementById("cart-count");
    // по умолчанию нет выбранной категории (показываются все)
    this.currentCategory = "";
    this.categoryPills = document.getElementById("category-pills");
    // Если в URL есть хэш, пробуем определить выбранную категорию
    this.initCategoryFromHash();
  }

  initCategoryFromHash() {
    const hash = window.location.hash;
    if (hash) {
      // ожидаем формат "#for-{category}-from-index"
      const match = hash.match(/for-([^-\s]+)-from-index/);
      if (match && match[1]) {
        this.currentCategory = match[1];
      }
    }
  }

  render() {
    if (this.categoryPills) {
      this.categoryPills.querySelectorAll(".pill").forEach(pill => {
        pill.addEventListener("click", () => {
          this.currentCategory = pill.getAttribute("data-category");
          this.categoryPills.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          // Прокручиваем активную пилюлю влево, без вертикальной прокрутки
          pill.scrollIntoView({
            inline: "start",
            block: "nearest",
            behavior: "smooth"
          });
          this.renderCatalog();
        });
      });
      if (this.currentCategory) {
        const activePill = this.categoryPills.querySelector(`.pill[data-category="${this.currentCategory}"]`);
        if (activePill) {
          activePill.classList.add("active");
          activePill.scrollIntoView({
            inline: "start",
            block: "nearest",
            behavior: "smooth"
          });
        }
      }
    }
    this.renderCatalog();
    this.updateCartCount();
  }

  renderCatalog() {
    const sections = [
      { key: "girl", label: "Для девочек", content: "" },
      { key: "boy", label: "Для мальчиков", content: "" },
      { key: "newborn", label: "Выписка из роддома", content: "" },
      { key: "genderParty", label: "Гендер Пати", content: "" },
      { key: "woman", label: "Девушкам", content: "" },
      { key: "man", label: "Мужчинам", content: "" },
      { key: "bachelorette", label: "Девичник", content: "" },
      { key: "valentines", label: "14 февраля", content: "" }
    ];

    products.forEach(({ id, category, images, title, price }) => {
      const itemHTML = `
        <li class="goods-element">
          <a href="product-page.html?id=${id}">
            <img class="goods-element__img" src="${images}" alt="${title}" />
          </a>
          <h2 class="goods-element__price">${price}₽</h2>
          <a href="product-page.html?id=${id}">
            <h3 class="goods-element__title">${title}</h3>
          </a>
          <div class="buttons">
            <a class="view-details" href="product-page.html?id=${id}">Подробнее</a>
          </div>
        </li>
      `;
      const section = sections.find(sec => sec.key === category);
      if (section) {
        section.content += itemHTML;
      }
    });

    let html = "";

    if (!this.currentCategory) {
      sections.forEach(section => {
        if (section.content.trim() !== "") {
          html += `<h1 class="goods-element__category" id="for-${section.key}-from-index">${section.label}</h1>`;
          html += `<ul class="goods-container">${section.content}</ul>`;
        }
      });
    } else {
      const selectedSection = sections.find(sec => sec.key === this.currentCategory);
      if (selectedSection && selectedSection.content.trim() !== "") {
        html += `<h1 class="goods-element__category" id="for-${selectedSection.key}-from-index">${selectedSection.label}</h1>`;
        html += `<ul class="goods-container">${selectedSection.content}</ul>`;
      }
      sections.forEach(section => {
        if (section.key !== this.currentCategory && section.content.trim() !== "") {
          html += `<h1 class="goods-element__category" id="for-${section.key}-from-index">${section.label}</h1>`;
          html += `<ul class="goods-container">${section.content}</ul>`;
        }
      });
    }
    rootGoods.innerHTML = html;
  }

  updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (this.cartCountElement) {
      this.cartCountElement.textContent = totalCount;
    }
  }
}

const goodsPage = new Goods();
goodsPage.render();
