export class Laboratory {
  constructor(substances, reactions = {}) {
    this._validateSubstances(substances);
    this._validateReactions(reactions, substances);

    this.substances = substances;
    this.reactions = reactions;
    this.quantities = {};

    for (const substance of substances) {
      this.quantities[substance] = 0;
    }
  }

  _validateSubstances(substances) {
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
  }

  _validateReactions(reactions, substances) {
    if (reactions === null || reactions === undefined) {
      throw new Error(
        "Le paramètre reactions ne peut pas être null ou undefined"
      );
    }
    if (typeof reactions !== "object" || Array.isArray(reactions)) {
      throw new Error("Le paramètre reactions doit être un objet");
    }

    for (const product in reactions) {
      if (!substances.includes(product)) {
        throw new Error(
          `Le produit ${product} n'est pas dans la liste des substances`
        );
      }

      const reactants = reactions[product];
      if (!Array.isArray(reactants)) {
        throw new Error(`Les réactifs pour ${product} doivent être un tableau`);
      }

      for (const reactant of reactants) {
        if (!reactant.substance || !substances.includes(reactant.substance)) {
          throw new Error(
            `Le réactif ${reactant.substance} n'est pas dans la liste des substances`
          );
        }
        if (typeof reactant.quantity !== "number" || isNaN(reactant.quantity)) {
          throw new Error(`La quantité du réactif doit être un nombre valide`);
        }
      }
    }
  }

  _validateStringParam(value, paramName) {
    if (value === null || value === undefined) {
      throw new Error(
        `Le paramètre ${paramName} ne peut pas être null ou undefined`
      );
    }
    if (value === "") {
      throw new Error(
        `Le paramètre ${paramName} ne peut pas être une chaîne vide`
      );
    }
  }

  _validateNumberParam(value, paramName) {
    if (value === null || value === undefined) {
      throw new Error(
        `Le paramètre ${paramName} ne peut pas être null ou undefined`
      );
    }
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error(`Le paramètre ${paramName} doit être un nombre valide`);
    }
  }

  _validateSubstanceExists(substance) {
    if (!this.substances.includes(substance)) {
      throw new Error(
        "La substance n'est pas dans la liste des substances connues"
      );
    }
  }

  _validateProductHasReaction(product) {
    if (!this.reactions[product]) {
      throw new Error("Aucune réaction définie pour ce produit");
    }
  }

  _calculateMaxProducible(product) {
    const reactants = this.reactions[product];
    let maxPossible = Infinity;

    for (const reactant of reactants) {
      const available = this.quantities[reactant.substance];
      const possibleFromThisReactant = Math.floor(
        available / reactant.quantity
      );
      maxPossible = Math.min(maxPossible, possibleFromThisReactant);
    }

    return maxPossible === Infinity ? 0 : maxPossible;
  }

  _detectCircularDependency(product, visited = new Set()) {
    if (visited.has(product)) {
      return true;
    }
    
    if (!this.reactions[product]) {
      return false;
    }
    
    visited.add(product);
    const reactants = this.reactions[product];
    
    for (const reactant of reactants) {
      if (this._detectCircularDependency(reactant.substance, new Set(visited))) {
        return true;
      }
    }
    
    return false;
  }

  _calculateMaxProducibleWithCircular(product, desiredQuantity) {
    let totalProduced = 0;
    const maxIterations = 100;
    let iteration = 0;
    
    while (totalProduced < desiredQuantity && iteration < maxIterations) {
      iteration++;
      
      const productionResult = this._attemptProduction(product, desiredQuantity - totalProduced);
      
      if (productionResult.produced === 0 && !productionResult.intermediatesProduced) {
        break;
      }
      
      totalProduced += productionResult.produced;
    }
    
    return totalProduced;
  }

  _attemptProduction(product, desiredQuantity) {
    const reactants = this.reactions[product];
    let minBatchSize = Infinity;
    let intermediatesProduced = false;
    
    for (const reactant of reactants) {
      const available = this.quantities[reactant.substance] || 0;
      const needed = reactant.quantity;
      
      if (this._canProduceReactant(reactant.substance)) {
        intermediatesProduced = this._produceIntermediateIfNeeded(
          reactant.substance,
          needed,
          available
        ) || intermediatesProduced;
      }
      
      const nowAvailable = this.quantities[reactant.substance] || 0;
      const possibleBatches = Math.floor(nowAvailable / needed);
      minBatchSize = Math.min(minBatchSize, possibleBatches);
    }
    
    const produced = this._produceFinalBatches(product, minBatchSize, desiredQuantity);
    
    return { produced, intermediatesProduced };
  }

  _canProduceReactant(substance) {
    return this.reactions[substance] && this._calculateMaxProducible(substance) > 0;
  }

  _produceIntermediateIfNeeded(substance, needed, available) {
    const canProduce = this._calculateMaxProducible(substance);
    const toProduce = Math.min(canProduce, Math.ceil(needed - available));
    
    if (toProduce > 0) {
      this._consumeReactantsAndProduceProduct(substance, toProduce);
      return true;
    }
    return false;
  }

  _produceFinalBatches(product, minBatchSize, desiredQuantity) {
    if (minBatchSize === 0 || minBatchSize === Infinity) {
      return 0;
    }
    
    const toProduce = Math.min(minBatchSize, desiredQuantity);
    if (toProduce > 0) {
      this._consumeReactantsAndProduceProduct(product, toProduce);
    }
    
    return toProduce;
  }

  _consumeReactantsAndProduceProduct(product, quantity) {
    const reactants = this.reactions[product];
    for (const reactant of reactants) {
      this.quantities[reactant.substance] -= reactant.quantity * quantity;
    }
    this.quantities[product] += quantity;
  }

  getQuantity(substance) {
    this._validateStringParam(substance, "substance");
    this._validateSubstanceExists(substance);
    return this.quantities[substance];
  }

  addQuantity(substance, quantity) {
    this._validateStringParam(substance, "substance");
    this._validateSubstanceExists(substance);
    this._validateNumberParam(quantity, "quantity");
    this.quantities[substance] += quantity;
  }

  setQuantity(substance, quantity) {
    this._validateStringParam(substance, "substance");
    this._validateSubstanceExists(substance);
    this._validateNumberParam(quantity, "quantity");
    this.quantities[substance] = quantity;
  }

  addProduct(product, quantity) {
    this._validateStringParam(product, "product");
    this._validateProductHasReaction(product);
    this._validateNumberParam(quantity, "quantity");

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

    this._consumeReactantsAndProduceProduct(product, quantity);
  }

  make(product, desiredQuantity) {
    this._validateStringParam(product, "product");
    this._validateProductHasReaction(product);
    this._validateNumberParam(desiredQuantity, "desiredQuantity");

    // Check if there's a circular dependency
    const hasCircular = this._detectCircularDependency(product);
    
    let produced;
    if (hasCircular) {
      produced = this._calculateMaxProducibleWithCircular(
        product,
        desiredQuantity
      );
    } else {
      const maxPossible = Math.min(
        desiredQuantity,
        this._calculateMaxProducible(product)
      );
      
      if (maxPossible > 0) {
        this._consumeReactantsAndProduceProduct(product, maxPossible);
      }
      produced = maxPossible;
    }

    return produced;
  }
}
