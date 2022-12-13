export class PaymentModel {
  amount?: number;
  date?: string;

  constructor(object?: any) {
    this.amount = object.payAmount;
    this.date = object.payDate;
  }
}

export interface PaymentCardResp {
  customerId: string;
  customerToken: string;
  defaultPaymethodType: string;
  defaultPaymethodToken: string;
  defaultBillingAddressToken: string;
  status: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  defaultBillingAddress: {
    addressToken: string;
    customerToken: string;
    label: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    addressType: string;
    shippingAddressType: string;
    physicalAddress: {
      streetLine1: string;
      streetLine2: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    }
  }
  defaultPaymentMethod: {
    paymethodToken: string;
    customerToken: string;
    label: string;
    notes: string;
    card: {
      cardType: string;
      nameOnCard: string;
      accountNumber: string;
      expireMonth: string;
      expireYear: string;
      cardVerificationValue: string;
      last_4AccountNumber: string;
    },
    echeck: {
      accountHolder: string;
      accountNumber: string
      routingNumber: string;
      accountType: string;
      last_4AccountNumber: string;
    };
  }
}

export interface PaymentCard {
  customerId: string;
  customerToken: string;
  card: {
    accountNumber?: string;
    cardType: string;
    expireMonth: string;
    expireYear: string;
    cardVerificationValue?: string;
    nameOnCard: string;
  },
  paymethodToken: string;
  paymethodType: string;
}

export interface PaymentEcheck {
  customerId: string;
  customerToken: string;
  echeck: {
    accountHolder: string;
    accountNumber: string;
    accountType: string;
    routingNumber: string;
  },
  paymethodToken: string;
  paymethodType: string;
}

export interface AddressPost {
  addressToken: string;
  addressType: string;
  customerId: string;
  customerToken: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  physicalAddress: {
    locality: string;
    postalCode: string;
    region: string;
    streetLine1: string;
  },
  shippingAddressType: string;
}
