import { products } from '../../data/products.js';

describe('test suite: products', () => {
  it('products array is not empty', () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it('all products have required properties', () => {
    products.forEach(product => {
      expect(product.id).toBeDefined();
      expect(product.image).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.rating).toBeDefined();
      expect(product.priceCents).toBeDefined();
      expect(product.keywords).toBeDefined();
    });
  });

  it('product IDs are unique', () => {
    const ids = products.map(product => product.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toEqual(ids.length);
  });

  it('product prices are non-negative numbers', () => {
    products.forEach(product => {
      expect(typeof product.priceCents).toBe('number');
      expect(product.priceCents).toBeGreaterThanOrEqual(0);
    });
  });

  it('product ratings have required properties', () => {
    products.forEach(product => {
      expect(product.rating.stars).toBeDefined();
      expect(product.rating.count).toBeDefined();
      expect(typeof product.rating.stars).toBe('number');
      expect(typeof product.rating.count).toBe('number');
    });
  });

  it('product ratings are between 0 and 5 stars', () => {
    products.forEach(product => {
      expect(product.rating.stars).toBeGreaterThanOrEqual(0);
      expect(product.rating.stars).toBeLessThanOrEqual(5);
    });
  });

  it('product review counts are non-negative', () => {
    products.forEach(product => {
      expect(product.rating.count).toBeGreaterThanOrEqual(0);
    });
  });

  it('product keywords is an array', () => {
    products.forEach(product => {
      expect(Array.isArray(product.keywords)).toBe(true);
      expect(product.keywords.length).toBeGreaterThan(0);
    });
  });

  it('first product is athletic socks with ID e43638ce-6aa0-4b85-b27f-e1d07eb678c6', () => {
    const firstProduct = products[0];
    expect(firstProduct.id).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(firstProduct.name).toContain('Athletic Cotton Socks');
    expect(firstProduct.priceCents).toEqual(1090);
  });

  it('second product is basketball with ID 15b6fc6f-327a-4ec4-896f-486349e85a3d', () => {
    const secondProduct = products[1];
    expect(secondProduct.id).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
    expect(secondProduct.name).toContain('Basketball');
    expect(secondProduct.priceCents).toEqual(2095);
  });

  it('products with type clothing have sizeChartLink', () => {
    const clothingProducts = products.filter(product => product.type === 'clothing');
    clothingProducts.forEach(product => {
      expect(product.sizeChartLink).toBeDefined();
    });
  });
});
