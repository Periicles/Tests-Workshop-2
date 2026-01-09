export class Laboratory {
  constructor(substances) {
    this.substances = substances;
  }

  get quantity() {
    return this.substances.length;
  }
}
