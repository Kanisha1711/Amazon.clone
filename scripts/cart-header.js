import { cartStore } from '../data/cart.js';

const cartQuantity = document.querySelector('.js-cart-quantity');

if (cartQuantity) {
  cartQuantity.innerHTML = cartStore.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
}