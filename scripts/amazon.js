import { cart, cartStore, addToCart, clearCart } from '../data/cart.js?v=20260907';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

class AmazonPage {
  constructor({ products, cart, productGrid, cartQuantity }) {
    this.products = products;
    this.cart = cart;
    this.productGrid = productGrid;
    this.cartQuantity = cartQuantity;
  }

  renderProducts(searchText = '') {
    const searchTerm = searchText.trim().toLowerCase();
    const visibleProducts = this.products.filter(product => {
      const searchableText = [product.name, ...product.keywords].join(' ').toLowerCase();
      return searchableText.includes(searchTerm);
    });

    if (visibleProducts.length === 0) {
      this.productGrid.innerHTML = '<div class="no-results">No products match your search.</div>';
      return;
    }

    this.productGrid.innerHTML = visibleProducts.map(product => `
      <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars*10}.png">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              $${formatCurrency(product.priceCents)}
            </div>

            <div class="product-quantity-container">
              <select>
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart"
            data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
  `).join('');
  }

  updateCartQuantity() {
    const quantity = cartStore.items.reduce((total, item) => total + item.quantity, 0);
    this.cartQuantity.innerHTML = quantity;
  }

  bindEvents() {
    this.searchButton.addEventListener('click', () => {
      this.renderProducts(this.searchInput.value);
      this.bindProductEvents();
    });

    this.searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.searchButton.click();
      }
    });
  }

  bindProductEvents() {
    this.productGrid.querySelectorAll('.js-add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productContainer = button.closest('.product-container');
        const quantity = Number(productContainer.querySelector('select').value);
        addToCart(button.dataset.productId, quantity);
        this.updateCartQuantity();
        const addedMessage = productContainer.querySelector('.added-to-cart');
        addedMessage.style.opacity = '1';
        window.clearTimeout(button.addedMessageTimeout);
        button.addedMessageTimeout = window.setTimeout(() => {
          addedMessage.style.opacity = '0';
        }, 1800);
      });
    });
  }

  render() {
    if (new URLSearchParams(window.location.search).get('resetCart') === '1') {
      clearCart();
    }

    this.searchInput = document.querySelector('.search-bar');
    this.searchButton = document.querySelector('.search-button');
    const searchText = new URLSearchParams(window.location.search).get('search') || '';
    this.searchInput.value = searchText;
    this.renderProducts(searchText);
    this.bindProductEvents();
    this.bindEvents();
    this.updateCartQuantity();
    window.addEventListener('storage', event => {
      if (event.key === 'cart') {
        this.updateCartQuantity();
      }
    });
  }
}

const amazonPage = new AmazonPage({
  products,
  cart,
  productGrid: document.querySelector('.js-products-grid'),
  cartQuantity: document.querySelector('.js-cart-quantity')
});

amazonPage.render();