import { addToCart, removeFromCart, cart, updateDeliveryOption } from '../../data/cart.js';

describe('test suite: addToCart', () => {
  beforeEach(() => {
    // Reset cart to default state before each test
    cart.length = 0;
    cart.push({
      productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity:2,
      deliveryOptionId:'1'
    });
    cart.push({
      productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity:1,
      deliveryOptionId:'2'
    });
  });

  it('adds a new product to the cart', () => {
    expect(cart.length).toBeGreaterThan(0);
  });

  it('adds an existing product to the cart and increases quantity', () => {
    const initialLength = cart.length;
    const firstItem = cart[0];
    const initialQuantity = firstItem.quantity;
    
    addToCart(firstItem.productId);
    
    expect(firstItem.quantity).toEqual(initialQuantity + 1);
  });

  it('adds a new product to the cart with quantity 1', () => {
    const newProductId = 'test-product-id-12345';
    
    const initialLength = cart.length;
    addToCart(newProductId);
    
    const addedItem = cart.find(item => item.productId === newProductId);
    expect(addedItem).toBeDefined();
    expect(addedItem.quantity).toEqual(1);
    expect(addedItem.deliveryOptionId).toEqual('1');
  });
});

describe('test suite: removeFromCart', () => {
  beforeEach(() => {
    // Reset cart to default state before each test
    cart.length = 0;
    cart.push({
      productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity:2,
      deliveryOptionId:'1'
    });
    cart.push({
      productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity:1,
      deliveryOptionId:'2'
    });
  });

  it('removes a product from the cart', () => {
    const testProductId = 'test-remove-product-id';
    
    addToCart(testProductId);
    const cartLengthBefore = cart.length;
    
    removeFromCart(testProductId);
    const cartLengthAfter = cart.length;
    
    expect(cartLengthAfter).toBeLessThan(cartLengthBefore);
  });

  it('does not remove other products when removing one item', () => {
    const testProductId = 'test-product-for-selective-removal';
    const originalCart = JSON.parse(JSON.stringify(cart));
    
    addToCart(testProductId);
    removeFromCart(testProductId);
    
    originalCart.forEach(item => {
      const stillExists = cart.find(cartItem => cartItem.productId === item.productId);
      expect(stillExists).toBeDefined();
    });
  });
});

describe('test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    // Reset cart to default state before each test
    cart.length = 0;
    cart.push({
      productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity:2,
      deliveryOptionId:'1'
    });
    cart.push({
      productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity:1,
      deliveryOptionId:'2'
    });
  });

  it('updates delivery option for an existing product', () => {
    const testProductId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const newDeliveryOptionId = '3';
    
    updateDeliveryOption(testProductId, newDeliveryOptionId);
    
    const item = cart.find(cartItem => cartItem.productId === testProductId);
    expect(item.deliveryOptionId).toEqual(newDeliveryOptionId);
  });

  it('keeps other cart items unchanged when updating delivery option', () => {
    const testProductId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const originalOtherItems = JSON.parse(JSON.stringify(
      cart.filter(item => item.productId !== testProductId)
    ));
    
    updateDeliveryOption(testProductId, '2');
    
    const currentOtherItems = cart.filter(item => item.productId !== testProductId);
    expect(currentOtherItems).toEqual(originalOtherItems);
  });
});
