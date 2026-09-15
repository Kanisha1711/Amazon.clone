const defaultItems = [];

export class Cart {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
    this.items = this.loadItems();
  }

  loadItems() {
    try {
      const storedItems = this.storage?.getItem('cart');
      const parsedItems = storedItems ? JSON.parse(storedItems) : defaultItems;

      if (!Array.isArray(parsedItems)) {
        return structuredClone(defaultItems);
      }

      const normalizedItems = parsedItems
        .filter(item => item && item.productId)
        .map(item => ({
          productId: item.productId,
          quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
          deliveryOptionId: item.deliveryOptionId || '1'
        }));

      return normalizedItems;
    } catch (error) {
      return structuredClone(defaultItems);
    }
  }

  save() {
    try {
      this.storage?.setItem('cart', JSON.stringify(this.items));
    } catch (error) {
      // Storage can be unavailable in tests or privacy-restricted browsers.
    }
  }

  add(productId, quantity = 1) {
    const matchingItem = this.items.find(item => item.productId === productId);

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity, deliveryOptionId: '1' });
    }

    this.save();
  }

  remove(productId) {
    const itemIndex = this.items.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
      this.items.splice(itemIndex, 1);
    }

    this.save();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = this.items.find(item => item.productId === productId);

    if (matchingItem) {
      matchingItem.deliveryOptionId = deliveryOptionId;
      this.save();
    }
  }

  updateQuantity(productId, quantity) {
    const matchingItem = this.items.find(item => item.productId === productId);
    const validQuantity = Math.max(1, Math.min(10, Number(quantity) || 1));

    if (matchingItem) {
      matchingItem.quantity = validQuantity;
      this.save();
    }
  }

  clear() {
    this.items.length = 0;
    this.save();
  }
}

export const cartStore = new Cart();
export let cart = cartStore.items;

export function addToCart(productId, quantity = 1) {
  cartStore.add(productId, quantity);
  cart = cartStore.items;
}

export function removeFromCart(productId) {
  cartStore.remove(productId);
  cart = cartStore.items;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  cartStore.updateDeliveryOption(productId, deliveryOptionId);
}

export function updateQuantity(productId, quantity) {
  cartStore.updateQuantity(productId, quantity);
}

export function clearCart() {
  cartStore.clear();
}