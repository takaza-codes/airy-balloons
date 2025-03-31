document.addEventListener("DOMContentLoaded", () => {
  const catalogContent = document.getElementById("catalog-content");
  const categoryList = document.getElementById("catalog-categories");
  const categoryPills = document.getElementById("category-pills");
  const LOCAL_STORAGE_KEY = "selectedCategory";

  // Если в URL есть параметр category, обновляем localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get("category");
  if (urlCategory) {
    localStorage.setItem(LOCAL_STORAGE_KEY, urlCategory);
  }

  // Функция для рендера списка товаров
  function renderProducts(productsArray) {
    catalogContent.innerHTML = "";
    productsArray.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card-mini");

      const img = document.createElement("img");
      img.classList.add("product-image");
      img.src = product.images[0] || "";

      const info = document.createElement("div");
      info.classList.add("product-info");

      const title = document.createElement("h3");
      title.textContent = product.title;

      const price = document.createElement("div");
      price.classList.add("product-price");
      price.textContent = `${product.price} ₽`;

      const controls = document.createElement("div");
      controls.classList.add("order-controls-mini");

      const detailsLink = document.createElement("a");
      detailsLink.classList.add("product-btn", "btn-details");
      detailsLink.textContent = "Подробнее";
      detailsLink.href = `../pages/product-page.html?id=${product.id}`;

      const orderBtn = document.createElement("button");
      orderBtn.classList.add("product-btn", "btn-order");
      orderBtn.textContent = "Заказать";

      const quantityBlock = document.createElement("div");
      quantityBlock.classList.add("quantity-block", "quantity-block--small");

      const decrementBtn = document.createElement("button");
      decrementBtn.classList.add("decrement");
      decrementBtn.textContent = "−";

      const quantityNum = document.createElement("span");
      quantityNum.classList.add("quantity-num");
      quantityNum.textContent = "0";

      const incrementBtn = document.createElement("button");
      incrementBtn.classList.add("increment");
      incrementBtn.textContent = "+";

      quantityBlock.appendChild(decrementBtn);
      quantityBlock.appendChild(quantityNum);
      quantityBlock.appendChild(incrementBtn);

      controls.appendChild(detailsLink);
      controls.appendChild(orderBtn);
      controls.appendChild(quantityBlock);

      function updateQuantityDisplay() {
        quantityNum.textContent = quantity;
      }

      let quantity = 0;
      const cart = getCart();
      const itemInCart = cart.find((item) => item.id === product.id);
      if (itemInCart) {
        quantity = itemInCart.quantity;
        controls.classList.add("active");
        orderBtn.style.display = "none";
        quantityBlock.style.display = "flex";
        updateQuantityDisplay();
      } else {
        quantityBlock.style.display = "none";
        orderBtn.style.display = "inline-block";
      }

      orderBtn.addEventListener("click", () => {
        quantity = 1;
        controls.classList.add("active");
        updateQuantityDisplay();
        orderBtn.style.display = "none";
        quantityBlock.style.display = "flex";
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
          controls.classList.remove("active");
          orderBtn.style.display = "inline-block";
          quantityBlock.style.display = "none";
        }
      });

      info.appendChild(title);
      info.appendChild(price);
      info.appendChild(controls);
      productCard.appendChild(img);
      productCard.appendChild(info);
      catalogContent.appendChild(productCard);
    });
  }

  // Функция фильтрации товаров по категории
  function filterProducts(category) {
    // Сохраняем выбранную категорию
    localStorage.setItem(LOCAL_STORAGE_KEY, category);

    if (category === "all") {
      renderProducts(products);
    } else {
      const filtered = products.filter((item) => item.category === category);
      renderProducts(filtered);
    }
  }

  // Функция для установки активного класса по сохранённой категории
  function setActiveCategory(category) {
    // Если есть десктопный список категорий
    if (categoryList) {
      [...categoryList.querySelectorAll("li")].forEach((li) => {
        li.classList.toggle("active", li.getAttribute("data-category") === category);
      });
    }
    // Если есть пилюли для мобильных
    if (categoryPills) {
      [...categoryPills.querySelectorAll(".pill")].forEach((pill) => {
        pill.classList.toggle("active", pill.getAttribute("data-category") === category);
      });
    }
  }

  // Изначально рендерим все товары или сохраняем выбранную категорию
  const savedCategory = localStorage.getItem(LOCAL_STORAGE_KEY) || "all";
  setActiveCategory(savedCategory);
  filterProducts(savedCategory);

  // Обработчик клика для десктопа (сайдбар)
  if (categoryList) {
    categoryList.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "li") {
        [...categoryList.querySelectorAll("li")].forEach((li) =>
          li.classList.remove("active")
        );
        e.target.classList.add("active");
        const category = e.target.getAttribute("data-category");
        filterProducts(category);
      }
    });
  }

  // Обработчик клика для мобильных устройств (пилюли)
  if (categoryPills) {
    categoryPills.addEventListener("click", (e) => {
      if (e.target.classList.contains("pill")) {
        [...categoryPills.querySelectorAll(".pill")].forEach((pill) =>
          pill.classList.remove("active")
        );
        e.target.classList.add("active");
        const category = e.target.getAttribute("data-category");
        filterProducts(category);
      }
    });
  }
});
