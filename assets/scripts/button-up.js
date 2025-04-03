document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  function updateButtonOpacity() {
    if (window.pageYOffset > 100) {
      // При прокрутке вниз делаем кнопку полностью видимой
      scrollToTopButton.style.opacity = "1";
    } else {
      // Если страница не прокручена, устанавливаем меньшую прозрачность
      scrollToTopButton.style.opacity = "0.6";
    }
  }

  // Обновляем прозрачность кнопки при загрузке и при прокрутке
  updateButtonOpacity();
  window.addEventListener("scroll", updateButtonOpacity);

  // Плавная прокрутка наверх при клике на кнопку
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});