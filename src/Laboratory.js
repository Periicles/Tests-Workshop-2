export class Laboratory {
  constructor(substances) {
    if (substances === null || substances === undefined) {
      throw new Error("Le paramètre substances ne peut pas être null ou undefined");
    }
    if (!Array.isArray(substances)) {
      throw new Error("Le paramètre substances doit être un tableau");
    }
    for (const substance of substances) {
      if (typeof substance !== 'string') {
        throw new Error("Toutes les substances doivent être des chaînes de caractères");
      }
    }
    const uniqueSubstances = new Set(substances);
    if (uniqueSubstances.size !== substances.length) {
      throw new Error("Le tableau ne peut pas contenir de substances en double");
    }
    this.substances = substances;
  }

  getQuantity(substance) {
    if (substance === null || substance === undefined) {
      throw new Error("Le paramètre substance ne peut pas être null ou undefined");
    }
    if (substance === "") {
      throw new Error("Le paramètre substance ne peut pas être une chaîne vide");
    }
    if (!this.substances.includes(substance)) {
      throw new Error("La substance n'est pas dans la liste des substances connues");
    }
    return 0;
  }
}
