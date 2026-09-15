import { deliveryOptions } from '../../data/deliveryOptions.js';

describe('test suite: deliveryOptions', () => {
  it('has 3 delivery options', () => {
    expect(deliveryOptions.length).toEqual(3);
  });

  it('first delivery option is free with 7 days delivery', () => {
    const firstOption = deliveryOptions[0];
    expect(firstOption.id).toEqual('1');
    expect(firstOption.deliveryDays).toEqual(7);
    expect(firstOption.priceCents).toEqual(0);
  });

  it('second delivery option is $4.99 with 3 days delivery', () => {
    const secondOption = deliveryOptions[1];
    expect(secondOption.id).toEqual('2');
    expect(secondOption.deliveryDays).toEqual(3);
    expect(secondOption.priceCents).toEqual(499);
  });

  it('third delivery option is $9.99 with 1 day delivery', () => {
    const thirdOption = deliveryOptions[2];
    expect(thirdOption.id).toEqual('3');
    expect(thirdOption.deliveryDays).toEqual(1);
    expect(thirdOption.priceCents).toEqual(999);
  });

  it('all delivery options have required properties', () => {
    deliveryOptions.forEach(option => {
      expect(option.id).toBeDefined();
      expect(option.deliveryDays).toBeDefined();
      expect(option.priceCents).toBeDefined();
      expect(typeof option.id).toBe('string');
      expect(typeof option.deliveryDays).toBe('number');
      expect(typeof option.priceCents).toBe('number');
    });
  });

  it('delivery days are in descending order', () => {
    for (let i = 0; i < deliveryOptions.length - 1; i++) {
      expect(deliveryOptions[i].deliveryDays).toBeGreaterThan(deliveryOptions[i + 1].deliveryDays);
    }
  });

  it('price increases with faster delivery', () => {
    for (let i = 0; i < deliveryOptions.length - 1; i++) {
      expect(deliveryOptions[i].priceCents).toBeLessThan(deliveryOptions[i + 1].priceCents);
    }
  });
});
