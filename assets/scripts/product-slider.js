// product-slider.js

document.addEventListener('DOMContentLoaded', () => {
  const arrowRight = document.getElementById('arrowRight');
  const mainImage = document.getElementById('mainImage');
  let currentIndex = 0;

  // При клике на правую стрелку переключаемся к следующему изображению
  if (arrowRight) {
    arrowRight.addEventListener('click', () => {
      // Найдём все миниатюры
      const thumbnailsEl = document.getElementById('thumbnails');
      const thumbnails = thumbnailsEl.querySelectorAll('.thumbnail');
      if (!thumbnails.length) return;

      currentIndex = (currentIndex + 1) % thumbnails.length;
      mainImage.src = thumbnails[currentIndex].src;
    });
  }
});
