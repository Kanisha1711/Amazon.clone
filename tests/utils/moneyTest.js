import { formatCurrency } from '../../scripts/utils/money.js';

describe('formatCurrency', () => {
  it('converts cents into dollars', () => {
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('rounds to the nearest cent', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });

  it('works with negative numbers', () => {
    expect(formatCurrency(-2095)).toEqual('-20.95');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1000000)).toEqual('10000.00');
  });

  it('handles decimal inputs', () => {
    expect(formatCurrency(99.9)).toEqual('1.00');
  });
});
