export class MoneyFormatter {
  format(priceCents) {
    const dollars = Number(priceCents) / 100;
    return (Math.round((dollars + Number.EPSILON) * 100) / 100).toFixed(2);
  }
}

const moneyFormatter = new MoneyFormatter();

export function formatCurrency(priceCents) {
  return moneyFormatter.format(priceCents);
}

export default formatCurrency;