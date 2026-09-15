import { products } from '../data/products.js';
import { cartStore } from '../data/cart.js';

const productId = new URLSearchParams(window.location.search).get('productId');
const product = products.find(item => item.id === productId) || products[0];
const cartItem = cartStore.items.find(item => item.productId === product.id);

document.querySelector('.js-product-name').textContent = product.name;
document.querySelector('.js-product-quantity').textContent = `Quantity: ${cartItem?.quantity || 1}`;
document.querySelector('.js-product-image').src = product.image;

const labels = [...document.querySelectorAll('.js-progress-label')];
const progressBar = document.querySelector('.js-progress-bar');

function setStatus(statusIndex) {
  labels.forEach((label, index) => label.classList.toggle('current-status', index === statusIndex));
  progressBar.style.width = `${statusIndex * 50}%`;
  document.querySelector('.js-delivery-date').textContent =
    statusIndex === 2 ? 'Delivered' : statusIndex === 1 ? 'Arriving soon' : 'Preparing for shipment';
}

labels.forEach((label, index) => label.addEventListener('click', () => setStatus(index)));
setStatus(1);