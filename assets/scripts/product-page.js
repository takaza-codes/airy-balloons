document.addEventListener("DOMContentLoaded", () => { 

  // ====================== Корзина ======================

  // Функция для отправки события обновления корзины (используется в разных файлах)
  function dispatchCartUpdate() {
    document.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  // Функция для получения корзины из localStorage
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  // Функция для сохранения корзины в localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Функция для уведомления о обновлении корзины в других вкладках
  function updateCartAcrossTabs() {
    dispatchCartUpdate();
  }

  // Функция для добавления товара в корзину
  function addToCart(productId, itemCount = 1) {
    const cart = getCart();
    // Предполагается, что глобальный массив products определён и доступен
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += itemCount; // увеличиваем quantity
    } else {
      // Добавляем новый объект с полем quantity = itemCount
      cart.push({ ...productToAdd, quantity: itemCount });
    }

    saveCart(cart);
    showToast(`${productToAdd.title} добавлен в корзину`);
    updateCartAcrossTabs(); // уведомляем другие вкладки (через кастомное событие)
  }

  // Функция для удаления товара из корзины (уменьшает quantity или удаляет товар)
  function removeFromCart(productId) {
    const cart = getCart();
    const index = cart.findIndex(p => p.id === productId);
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--; // уменьшаем quantity
        showToast("Количество уменьшено");
      } else {
        cart.splice(index, 1);
        showToast("Товар удалён из корзины");
      }
      saveCart(cart);
      updateCartAcrossTabs();
    }
  }

  // Функция для отображения тост-сообщений с адаптивными отступами
  function showToast(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      const isMobile = window.innerWidth <= 480;
      Object.assign(toastContainer.style, {
        position: 'fixed',
        bottom: isMobile ? '104px' : '104px',
        right: isMobile ? '16px' : '32px',
        zIndex: '9999',
        pointerEvents: 'none'
      });
      document.body.appendChild(toastContainer);
    }

    // Удаляем старый тост, если он есть
    const oldToast = toastContainer.querySelector('.toast');
    if (oldToast) {
      oldToast.remove();
    }

    // Создаём новый тост
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      backgroundColor: 'rgb(242, 215, 219)',
      color: 'rgb(30, 26, 26)',
      padding: '16px',
      width: '320px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      fontSize: '18px',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      cursor: 'pointer',
      pointerEvents: 'auto',
      textAlign: 'center'
    });

    toastContainer.appendChild(toast);

    // Запускаем анимацию появления
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    // Убираем тост по клику
    toast.addEventListener('click', () => {
      clearTimeout(timer);
      hide(toast);
    });

    // Авто‑скрытие через 3 секунды
    const timer = setTimeout(() => hide(toast), 3000);

    function hide(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(100%)';
      setTimeout(() => el.remove(), 300);
    }
  }

  // ====================== Рендер карточки товара ======================

  // Получаем параметры из URL и идентификатор товара
  const urlParams = new URLSearchParams(window.location.search);
  const productId = +urlParams.get('id');

  // Находим элементы страницы для отображения товара и похожих товаров
  const productPageEl = document.getElementById('productPage');
  const similarContainer = document.getElementById('similarProducts');

  // Ищем товар в глобальном массиве products
  const product = products.find(p => p.id === productId);

  // Если товар не найден, выводим сообщение
  if (productPageEl && !product) {
    productPageEl.innerHTML = '<p>Товар не найден!</p>';
  } else if (product) {
    // Формируем разметку страницы товара (пример)
    const lines = product.description.split('\n').map(line => line.trim()).filter(Boolean);
    const listItems = lines.map(line => `<li>${line}</li>`).join('');
    const mainImage = product.images?.[0] || '../assets/images/no-image.jpg';

    productPageEl.innerHTML = `
      <h2 class="product-title">${product.title}</h2>
      <div class="product-card">
        <div class="product-images">
          <div class="main-image">
            <img src="${mainImage}" alt="${product.title}" />
          </div>
        </div>
        <div class="product-info">
          <p class="product-price">${product.price}₽</p>
          <div class="order-controls" id="orderControls">
            <button class="btn" id="orderBtn">В корзину</button>
            <div class="quantity-block">
              <button class="decrement">−</button>
              <span class="quantity-num">0</span>
              <button class="increment">+</button>
            </div>
          </div>
          <div class="product-description">
            <ul>${listItems}</ul>
            <p>Состав набора, цвет шаров, надпись можно изменить по вашему желанию.</p>
          </div>
        </div>
      </div>
    `;

    // Логика работы с количеством товара на странице товара
    let quantity = 0;
    const orderControls = document.getElementById("orderControls");
    const orderBtn = document.getElementById("orderBtn");
    const quantityNum = document.querySelector(".quantity-num");
    const incrementBtn = document.querySelector(".increment");
    const decrementBtn = document.querySelector(".decrement");

    function updateQuantityDisplay() {
      quantityNum.textContent = quantity;
    }

    const cart = getCart();
    const itemInCart = cart.find(item => item.id === productId);
    if (itemInCart) {
      quantity = itemInCart.quantity;
      orderControls.classList.add("active");
      orderBtn.style.display = 'none';
    } else {
      quantity = 0;
    }
    updateQuantityDisplay();

    orderBtn.addEventListener("click", () => {
      quantity = 1;
      orderControls.classList.add("active");
      updateQuantityDisplay();
      orderBtn.style.display = 'none';
      addToCart(product.id, 1);
    });

    incrementBtn.addEventListener("click", () => {
      quantity++;
      updateQuantityDisplay();
      addToCart(product.id, 1);
    });

    decrementBtn.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        updateQuantityDisplay();
        removeFromCart(product.id);
      }
      if (quantity === 0) {
        orderControls.classList.remove("active");
        orderBtn.style.display = 'inline-block';
      }
    });

    // Функция для рендера похожих товаров (пример)
    function renderSimilarProducts(currentProduct) {
      const sameCategory = products.filter(
        p => p.category === currentProduct.category && p.id !== currentProduct.id
      );
      if (!sameCategory.length) {
        similarContainer.innerHTML = '';
        return;
      }
      let html = `<h2 class="similar-title">Похожие товары</h2>`;
      html += `<div class="similar-list">`;
      sameCategory.forEach(item => {
        const imageSrc = item.images?.[0] || '../assets/photos/no-photo.jpg';
        html += `
          <div class="similar-item">
            <a href="product-page.html?id=${item.id}" class="similar-img-link">
              <img src="${imageSrc}" alt="${item.title}" class="similar-img" />
            </a>
            <h3 class="similar-item-title">${item.title}</h3>
            <p class="similar-item-price">${item.price}₽</p>
            <a href="product-page.html?id=${item.id}" class="btn btn--transparent">Подробнее</a>
          </div>
        `;
      });
      html += `</div>`;
      similarContainer.innerHTML = html;
    }
    renderSimilarProducts(product);
  }

  // ====================== Рендер каталога товаров ======================

  const rootCatalog = document.getElementById("page-catalog");

  class Goods {
    constructor() {
      this.cartCountElement = document.getElementById("cart-count");
      // по умолчанию нет выбранной категории (показываются все)
      this.currentCategory = "";
      this.categoryPills = document.getElementById("category-pills");
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
            // Прокручиваем активную пилюлю влево
            pill.scrollIntoView({
              inline: "start",
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
        sections.forEach((section, index) => {
          if (section.content.trim() !== "") {
            // Добавляем кнопку "Наверх" перед второй категорией (index === 1)
            if (index === 1) {
              html += `<button class="button-up" id="scrollToTopButton" aria-label="Scroll to top">Наверх</button>`;
            }
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
      rootCatalog.innerHTML = html;
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

  // ====================== Кнопка "Наверх" ======================
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
