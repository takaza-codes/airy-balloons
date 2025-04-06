// Маппинг для замены картинки при hover
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
    "assets/photos/bachelorette/bachelorette-03.jpeg",
    "assets/photos/bachelorette/bachelorette-02.jpeg",
  ],
  [
    "assets/photos/valentines-day/valentines-day-02.jpeg",
    "assets/photos/valentines-day/valentines-day-03.jpeg",
  ],
]);

// Замена изображения при наведении
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

