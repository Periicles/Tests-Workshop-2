export class Laboratory {
  constructor(substances, reactions = {}) {
    if (substances === null || substances === undefined) {
      throw new Error(
        "Le paramètre substances ne peut pas être null ou undefined"
      );
    }
    if (!Array.isArray(substances)) {
      throw new Error("Le paramètre substances doit être un tableau");
    }
    for (const substance of substances) {
      if (typeof substance !== "string") {
        throw new Error(
          "Toutes les substances doivent être des chaînes de caractères"
        );
      }
    }
    const uniqueSubstances = new Set(substances);
    if (uniqueSubstances.size !== substances.length) {
      throw new Error(
        "Le tableau ne peut pas contenir de substances en double"
      );
    }

    // Validate reactions
    if (reactions === null || reactions === undefined) {
      throw new Error(
        "Le paramètre reactions ne peut pas être null ou undefined"
      );
    }
    if (typeof reactions !== "object" || Array.isArray(reactions)) {
      throw new Error("Le paramètre reactions doit être un objet");
    }

    // Validate reaction products and reactants
    for (const product in reactions) {
      if (!substances.includes(product)) {
        throw new Error(
          `Le produit ${product} n'est pas dans la liste des substances`
        );
      }

      const reactants = reactions[product];
      if (!Array.isArray(reactants)) {
        throw new Error(
          `Les réactifs pour ${product} doivent être un tableau`
        );
      }

      for (const reactant of reactants) {
        if (!reactant.substance || !substances.includes(reactant.substance)) {
          throw new Error(
            `Le réactif ${reactant.substance} n'est pas dans la liste des substances`
          );
        }
        if (typeof reactant.quantity !== "number" || isNaN(reactant.quantity)) {
          throw new Error(
            `La quantité du réactif doit être un nombre valide`
          );
        }
      }
    }

    this.substances = substances;
    this.reactions = reactions;
    this.quantities = {};

    for (const substance of substances) {
      this.quantities[substance] = 0;
    }
  }

  getQuantity(substance) {
    if (substance === null || substance === undefined) {
      throw new Error(
        "Le paramètre substance ne peut pas être null ou undefined"
      );
    }
    if (substance === "") {
      throw new Error(
        "Le paramètre substance ne peut pas être une chaîne vide"
      );
    }
    if (!this.substances.includes(substance)) {
      throw new Error(
        "La substance n'est pas dans la liste des substances connues"
      );
    }
    return this.quantities[substance];
  }

  addQuantity(substance, quantity) {
    if (substance === null || substance === undefined) {
      throw new Error(
        "Le paramètre substance ne peut pas être null ou undefined"
      );
    }
    if (substance === "") {
      throw new Error(
        "Le paramètre substance ne peut pas être une chaîne vide"
      );
    }
    if (!this.substances.includes(substance)) {
      throw new Error(
        "La substance n'est pas dans la liste des substances connues"
      );
    }
    if (quantity === null || quantity === undefined) {
      throw new Error(
        "Le paramètre quantity ne peut pas être null ou undefined"
      );
    }
    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new Error("Le paramètre quantity doit être un nombre valide");
    }

    this.quantities[substance] += quantity;
  }

  setQuantity(substance, quantity) {
    if (substance === null || substance === undefined) {
      throw new Error(
        "Le paramètre substance ne peut pas être null ou undefined"
      );
    }
    if (substance === "") {
      throw new Error(
        "Le paramètre substance ne peut pas être une chaîne vide"
      );
    }
    if (!this.substances.includes(substance)) {
      throw new Error(
        "La substance n'est pas dans la liste des substances connues"
      );
    }
    if (quantity === null || quantity === undefined) {
      throw new Error(
        "Le paramètre quantity ne peut pas être null ou undefined"
      );
    }
    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new Error("Le paramètre quantity doit être un nombre valide");
    }

    this.quantities[substance] = quantity;
  }

  addProduct(product, quantity) {
    if (product === null || product === undefined) {
      throw new Error(
        "Le paramètre product ne peut pas être null ou undefined"
      );
    }
    if (product === "") {
      throw new Error(
        "Le paramètre product ne peut pas être une chaîne vide"
      );
    }
    if (!this.reactions[product]) {
      throw new Error(
        "Aucune réaction définie pour ce produit"
      );
    }
    if (quantity === null || quantity === undefined) {
      throw new Error(
        "Le paramètre quantity ne peut pas être null ou undefined"
      );
    }
    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new Error("Le paramètre quantity doit être un nombre valide");
    }

    // Check if we have enough reactants
    const reactants = this.reactions[product];
    for (const reactant of reactants) {
      const requiredQuantity = reactant.quantity * quantity;
      if (this.quantities[reactant.substance] < requiredQuantity) {
        throw new Error(
          `Pas assez de ${reactant.substance} pour produire ${quantity} unité(s) de ${product}`
        );
      }
    }

    // Consume reactants
    for (const reactant of reactants) {
      this.quantities[reactant.substance] -= reactant.quantity * quantity;
    }

    // Add product
    this.quantities[product] += quantity;
  }

  make(product, desiredQuantity) {
    if (product === null || product === undefined) {
      throw new Error(
        "Le paramètre product ne peut pas être null ou undefined"
      );
    }
    if (product === "") {
      throw new Error(
        "Le paramètre product ne peut pas être une chaîne vide"
      );
    }
    if (!this.reactions[product]) {
      throw new Error(
        "Aucune réaction définie pour ce produit"
      );
    }
    if (desiredQuantity === null || desiredQuantity === undefined) {
      throw new Error(
        "Le paramètre desiredQuantity ne peut pas être null ou undefined"
      );
    }
    if (typeof desiredQuantity !== "number" || isNaN(desiredQuantity)) {
      throw new Error("Le paramètre desiredQuantity doit être un nombre valide");
    }

    // Calculate maximum possible quantity based on available reactants
    const reactants = this.reactions[product];
    let maxPossible = desiredQuantity;

    for (const reactant of reactants) {
      const available = this.quantities[reactant.substance];
      const possibleFromThisReactant = Math.floor(available / reactant.quantity);
      maxPossible = Math.min(maxPossible, possibleFromThisReactant);
    }

    // Produce the maximum possible quantity
    if (maxPossible > 0) {
      for (const reactant of reactants) {
        this.quantities[reactant.substance] -= reactant.quantity * maxPossible;
      }
      this.quantities[product] += maxPossible;
    }

    return maxPossible;
  }
}
