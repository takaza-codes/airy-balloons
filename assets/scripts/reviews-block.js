const track = document.querySelector(".reviews__track");
const btnLeft = document.querySelector(".reviews__arrow--left");
const btnRight = document.querySelector(".reviews__arrow--right");
const cards = document.querySelectorAll(".reviews__card");

let currentPosition = 0;
const visibleCards = 2;
const totalCards = cards.length;

function updatePosition() {
  const cardWidth = cards[0].offsetWidth;
  track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;

  btnLeft.disabled = currentPosition === 0;
  btnRight.disabled = currentPosition >= totalCards - visibleCards;
}

btnRight.addEventListener("click", () => {
  if (currentPosition < totalCards - visibleCards) {
    currentPosition++;
    updatePosition();
  }
});

btnLeft.addEventListener("click", () => {
  if (currentPosition > 0) {
    currentPosition--;
    updatePosition();
  }
});

window.addEventListener("resize", updatePosition);
updatePosition();
