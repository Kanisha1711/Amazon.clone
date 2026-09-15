import { cartStore } from '../data/cart.js';
import { addToCart } from '../data/cart.js';

const cartQuantity = document.querySelector('.js-cart-quantity');

function updateCartQuantity() {
  cartQuantity.innerHTML = cartStore.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

document.querySelectorAll('.buy-again-button').forEach(button => {
  button.addEventListener('click', () => {
    addToCart(button.dataset.productId, Number(button.dataset.quantity));
    updateCartQuantity();
    const message = button.querySelector('.buy-again-message');
    message.textContent = 'Added to cart';
    window.setTimeout(() => {
      message.textContent = 'Buy it again';
    }, 1800);
  });
});

document.querySelectorAll('.track-package-link').forEach(link => {
  link.href = `tracking.html?productId=${encodeURIComponent(link.dataset.productId)}`;
});

updateCartQuantity();