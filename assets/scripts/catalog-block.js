const hoverPairs = new Map([
  [
    "assets/photos/for-girl/for-girl-03.jpeg",
    "assets/photos/for-girl/for-girl-02.jpeg",
  ],
  [
    "assets/photos/for-boy/for-boy-03.jpeg",
    "assets/photos/for-boy/for-boy-02.jpeg",
  ],
  [
    "assets/photos/newborn/newborn-03.jpeg",
    "assets/photos/newborn/newborn-01.jpeg",
  ],
  [
    "assets/photos/gender-party/gender-party-03.jpeg",
    "assets/photos/gender-party/gender-party-01.jpeg",
  ],
  [
    "assets/photos/for-woman/for-woman-02.jpeg",
    "assets/photos/for-woman/for-woman-01.jpeg",
  ],
  [
    "assets/photos/for-man/for-man-01.jpeg",
    "assets/photos/for-man/for-man-03.jpeg",
  ],
  [
    "assets/photos/bachelorette/bachelorette-01.jpeg",
    "assets/photos/bachelorette/bachelorette-03.jpeg",
  ],
  [
    "assets/photos/valentines-day/valentines-day-02.jpeg",
    "assets/photos/valentines-day/valentines-day-03.jpeg",
  ],
]);

document.querySelectorAll(".catalogue__image img").forEach((img) => {
  const originalSrc = img.getAttribute("src");
  const hoverSrc = hoverPairs.get(originalSrc);

  if (hoverSrc) {
    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc;
    });

    img.addEventListener("mouseleave", () => {
      img.src = originalSrc;
    });
  }
});

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
