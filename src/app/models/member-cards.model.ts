export enum TransportType {
  Plane = 'PLN',
  Ambulance = 'AMB',
  Helicopter = 'HEL',
}

export class MemberCardsModel {
  cards?: string[];
  icons?: string[];

  constructor(object?: any) {
    this.cards = object.CARD;
    this.icons = object.ICON ? object.ICON : [];
  }

  cardType(): string {
    if (this.cards.length) {
      return this.cards[0].toLowerCase().replace(/_/g, '-').replace(/ x .*/, '');
    } else {
      return 'card-default';
    }
  }

  isTransportAvailable(transportationType: TransportType): boolean {
    return this.icons.includes(transportationType) ? true : false;
  }
}
