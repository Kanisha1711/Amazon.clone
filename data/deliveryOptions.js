export class DeliveryOption {
  constructor({ id, deliveryDays, priceCents }) {
    Object.assign(this, { id, deliveryDays, priceCents });
  }
}

const deliveryOptionData=[{
  id:'1',
  deliveryDays:7,
  priceCents:0
},{
  id:'2',
  deliveryDays:3,
  priceCents:499
},{
  id:'3',
  deliveryDays:1,
  priceCents:999
}];

export const deliveryOptions = deliveryOptionData.map(option => new DeliveryOption(option));