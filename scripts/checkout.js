import { cart, cartStore, clearCart, removeFromCart, updateDeliveryOption, updateQuantity } from '../data/cart.js?v=20260907';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

function formatDeliveryDate(deliveryDays) {
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

class CheckoutPage {
  constructor({ cart, products, deliveryOptions, document }) {
    this.cart = cart;
    this.products = products;
    this.deliveryOptions = deliveryOptions;
    this.document = document;
  }

  findProduct(productId) {
    return this.products.find(product => product.id === productId);
  }

  findDeliveryOption(optionId) {
    return this.deliveryOptions.find(option => option.id === optionId);
  }

  renderDeliveryOptions(product, cartItem) {
    return this.deliveryOptions.map(option => {
      const date = formatDeliveryDate(option.deliveryDays);
      const price = option.priceCents === 0
        ? 'FREE Shipping'
        : `$${formatCurrency(option.priceCents)} - Shipping`;
      const checked = option.id === cartItem.deliveryOptionId ? 'checked' : '';

      return `<div class="delivery-option js-delivery-option"
        data-product-id="${product.id}" data-delivery-option-id="${option.id}">
        <input type="radio" ${checked} class="delivery-option-input"
          name="delivery-option-${product.id}" data-product-id="${product.id}"
          data-delivery-option-id="${option.id}">
        <div><div class="delivery-option-date">${date}</div>
          <div class="delivery-option-price">${price}</div></div>
      </div>`;
    }).join('');
  }

  renderCartItem(cartItem) {
    const product = this.findProduct(cartItem.productId);
    const option = this.findDeliveryOption(cartItem.deliveryOptionId) || this.deliveryOptions[0];
    const date = formatDeliveryDate(option.deliveryDays);

    return `<div class="cart-item-container js-cart-item-container-${product.id}">
      <div class="delivery-date">Delivery date: ${date}</div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${product.image}">
        <div class="cart-item-details"><div class="product-name">${product.name}</div>
          <div class="product-price">$${formatCurrency(product.priceCents)}</div>
          <div class="product-quantity">Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            <input class="js-quantity-input" type="number" min="1" max="10"
              value="${cartItem.quantity}" data-product-id="${product.id}" hidden>
            <span class="update-quantity-link link-primary js-update-link">Update</span>
            <span class="delete-quantity-link link-primary js-delete-link"
              data-product-id="${product.id}">Delete</span>
          </div>
        </div>
        <div class="delivery-options"><div class="delivery-options-title">Choose a delivery option:</div>
          ${this.renderDeliveryOptions(product, cartItem)}</div>
      </div>
    </div>`;
  }

  renderSummary() {
    const summary = this.document.querySelector('.js-order-summary');
    summary.innerHTML = this.cart.length
      ? this.cart.map(cartItem => this.renderCartItem(cartItem)).join('')
      : '<div class="empty-cart">Your cart is empty.</div>';
  }

  updatePaymentSummary() {
    const currentItems = cartStore.items;
    const itemsCount = currentItems.reduce((total, item) => total + item.quantity, 0);
    this.document.querySelector('.js-checkout-cart-quantity').innerHTML = itemsCount;
    const itemsCostCents = currentItems.reduce((total, item) => {
      const product = this.findProduct(item.productId);
      return total + (product ? product.priceCents * item.quantity : 0);
    }, 0);
    const shippingCostCents = currentItems.reduce((total, item) => {
      const option = this.findDeliveryOption(item.deliveryOptionId);
      return total + (option ? option.priceCents : 0);
    }, 0);
    const subtotalCents = itemsCostCents + shippingCostCents;
    const taxCents = Math.round(subtotalCents * 0.1);
    const values = {
      '.js-items-count': `Items (${itemsCount}):`,
      '.js-items-cost': `$${formatCurrency(itemsCostCents)}`,
      '.js-shipping-cost': `$${formatCurrency(shippingCostCents)}`,
      '.js-subtotal': `$${formatCurrency(subtotalCents)}`,
      '.js-tax': `$${formatCurrency(taxCents)}`,
      '.js-order-total': `$${formatCurrency(subtotalCents + taxCents)}`
    };

    Object.entries(values).forEach(([selector, value]) => {
      this.document.querySelector(selector).innerHTML = value;
    });
  }

  bindEvents() {
    this.document.querySelectorAll('.js-update-link').forEach(link => {
      link.addEventListener('click', () => {
        const quantityInput = link.parentElement.querySelector('.js-quantity-input');
        quantityInput.hidden = false;
        quantityInput.focus();
      });
    });

    this.document.querySelectorAll('.js-quantity-input').forEach(input => {
      input.addEventListener('change', () => {
        updateQuantity(input.dataset.productId, input.value);
        this.cart = cartStore.items;
        this.renderSummary();
        this.updatePaymentSummary();
        this.bindEvents();
      });
    });

    this.document.querySelectorAll('.js-delete-link').forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        this.cart = cartStore.items;
        this.renderSummary();
        this.updatePaymentSummary();
        this.bindEvents();
      });
    });

    this.document.querySelectorAll('.js-delivery-option').forEach(optionElement => {
      optionElement.addEventListener('click', () => {
        const { productId, deliveryOptionId } = optionElement.dataset;
        const option = this.findDeliveryOption(deliveryOptionId);
        updateDeliveryOption(productId, deliveryOptionId);
        const date = formatDeliveryDate(option.deliveryDays);
        this.document.querySelector(`.js-cart-item-container-${productId} .delivery-date`).innerHTML =
          `Delivery date: ${date}`;
        this.updatePaymentSummary();
      });
    });

    this.document.querySelector('.place-order-button').addEventListener('click', () => {
      if (cartStore.items.length === 0) {
        return;
      }

      clearCart();
      window.location.href = 'orders.html';
    });

    this.document.querySelector('.place-order-button').disabled = cartStore.items.length === 0;
  }

  bindStorageSync() {
    window.addEventListener('storage', event => {
      if (event.key !== 'cart') {
        return;
      }

      try {
        const storedItems = event.newValue ? JSON.parse(event.newValue) : [];
        cartStore.items.splice(0, cartStore.items.length, ...storedItems);
        this.cart = cartStore.items;
        this.renderSummary();
        this.updatePaymentSummary();
        this.bindEvents();
      } catch (error) {
        // Ignore malformed external storage updates.
      }
    });
  }

  render() {
    this.renderSummary();
    this.updatePaymentSummary();
    this.bindEvents();
    this.bindStorageSync();
  }
}

new CheckoutPage({ cart, products, deliveryOptions, document }).render();