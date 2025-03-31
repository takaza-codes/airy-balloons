const popularList = document.getElementById("popular-list");

const targetIds = [4, 7, 9, 18];
const popularItems = products.filter((item) => targetIds.includes(item.id));

popularItems.forEach((item) => {
  const card = document.createElement("div");
  card.classList.add("popular__item");

  card.innerHTML = `
    <div class="popular__image">
      <img src="${item.images[0]}" alt="${item.title}" />
    </div>
    <div class="popular__info">
      <h3 class="popular__title">${item.title}</h3>
      <p class="popular__price">${item.price} ₽</p>
    </div>
  `;

  popularList.appendChild(card);
});
