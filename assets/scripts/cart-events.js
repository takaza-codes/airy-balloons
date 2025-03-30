// отвечает за отправку события «cartUpdated», которое уведомляет все части приложения об изменениях в корзине.

// cart-events.js
function dispatchCartUpdate() {
  document.dispatchEvent(new CustomEvent("cartUpdated"));
}
