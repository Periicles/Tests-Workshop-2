import { Laboratory } from "../src/Laboratory.js";

describe("Laboratory initialisation", () => {
  it("accepte une liste vide", () => {
    expect(() => new Laboratory([], {})).not.toThrow();
  });

  it("accepte une liste de substances valides", () => {
    expect(() => new Laboratory(["H2O", "NaCl"], {})).not.toThrow();
  });

  it("attribue une quantité initiale à 0 pour chaque substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    expect(lab.getQuantity("H2O")).toBe(0);
    expect(lab.getQuantity("NaCl")).toBe(0);
  });

  it("accepte des réactions valides", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    expect(() => new Laboratory(["H2O", "H2", "O2"], reactions)).not.toThrow();
  });

  it("stocke correctement les réactions", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    expect(lab.reactions).toEqual(reactions);
  });
});

describe("Laboratory initialisation - cas d'erreur", () => {
  it("rejette null comme paramètre", () => {
    expect(() => new Laboratory(null, {})).toThrow();
  });

  it("rejette undefined comme paramètre", () => {
    expect(() => new Laboratory(undefined, {})).toThrow();
  });

  it("rejette un paramètre qui n'est pas un tableau", () => {
    expect(() => new Laboratory("H2O", {})).toThrow();
    expect(() => new Laboratory(123, {})).toThrow();
    expect(() => new Laboratory({}, {})).toThrow();
  });

  it("rejette un tableau contenant des éléments non-string", () => {
    expect(() => new Laboratory(["H2O", 123], {})).toThrow();
    expect(() => new Laboratory([null, "NaCl"], {})).toThrow();
    expect(() => new Laboratory(["H2O", undefined], {})).toThrow();
  });

  it("rejette un tableau contenant des substances en double", () => {
    expect(() => new Laboratory(["H2O", "NaCl", "H2O"], {})).toThrow();
  });

  it("rejette des réactions qui ne sont pas un objet", () => {
    expect(() => new Laboratory(["H2O"], null)).toThrow();
    expect(() => new Laboratory(["H2O"], "reaction")).toThrow();
    expect(() => new Laboratory(["H2O"], 123)).toThrow();
  });

  it("rejette des réactions avec un produit non présent dans la liste", () => {
    const reactions = {
      CO2: [{ substance: "C", quantity: 1 }],
    };
    expect(() => new Laboratory(["H2O"], reactions)).toThrow();
  });

  it("rejette des réactions avec des réactifs non présents dans la liste", () => {
    const reactions = {
      H2O: [{ substance: "H2", quantity: 2 }],
    };
    expect(() => new Laboratory(["H2O"], reactions)).toThrow();
  });

  it("rejette des réactions avec une quantité invalide", () => {
    const reactions = {
      H2O: [{ substance: "H2", quantity: "invalid" }],
    };
    expect(() => new Laboratory(["H2O", "H2"], reactions)).toThrow();
  });
});

describe("getQuantity - cas d'erreur", () => {
  it("rejette une substance qui n'est pas dans la liste", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    expect(() => lab.getQuantity("CO2")).toThrow();
  });

  it("rejette null comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    expect(() => lab.getQuantity(null)).toThrow();
  });

  it("rejette undefined comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    expect(() => lab.getQuantity(undefined)).toThrow();
  });

  it("rejette une chaîne vide comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    expect(() => lab.getQuantity("")).toThrow();
  });
});

describe("Gestion des quantités", () => {
  it("permet d'ajouter une quantité à une substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    lab.addQuantity("H2O", 10.5);
    expect(lab.getQuantity("H2O")).toBe(10.5);
  });

  it("permet d'ajouter une quantité supplémentaire à une substance existante", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    lab.addQuantity("H2O", 10);
    lab.addQuantity("H2O", 5);
    expect(lab.getQuantity("H2O")).toBe(15);
  });

  it("permet de définir une quantité spécifique pour une substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    lab.setQuantity("NaCl", 25.75);
    expect(lab.getQuantity("NaCl")).toBe(25.75);
  });

  it("permet de remplacer une quantité existante avec setQuantity", () => {
    const lab = new Laboratory(["H2O", "NaCl"], {});
    lab.setQuantity("H2O", 10);
    lab.setQuantity("H2O", 20);
    expect(lab.getQuantity("H2O")).toBe(20);
  });

  it("conserve les quantités indépendantes pour chaque substance", () => {
    const lab = new Laboratory(["H2O", "NaCl", "CO2"], {});
    lab.addQuantity("H2O", 10);
    lab.setQuantity("NaCl", 5);
    lab.addQuantity("CO2", 7.5);
    expect(lab.getQuantity("H2O")).toBe(10);
    expect(lab.getQuantity("NaCl")).toBe(5);
    expect(lab.getQuantity("CO2")).toBe(7.5);
  });
});

describe("Gestion des produits avec réactions", () => {
  it("permet d'ajouter un produit et consomme les réactifs nécessaires", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 10);
    lab.setQuantity("O2", 5);
    
    lab.addProduct("H2O", 1);
    
    expect(lab.getQuantity("H2O")).toBe(1);
    expect(lab.getQuantity("H2")).toBe(8);
    expect(lab.getQuantity("O2")).toBe(4);
  });

  it("permet d'ajouter plusieurs unités d'un produit", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 10);
    lab.setQuantity("O2", 5);
    
    lab.addProduct("H2O", 2);
    
    expect(lab.getQuantity("H2O")).toBe(2);
    expect(lab.getQuantity("H2")).toBe(6);
    expect(lab.getQuantity("O2")).toBe(3);
  });

  it("rejette l'ajout d'un produit sans réaction définie", () => {
    const lab = new Laboratory(["H2O", "H2"], {});
    expect(() => lab.addProduct("H2O", 1)).toThrow();
  });

  it("rejette l'ajout d'un produit si pas assez de réactifs", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 1);
    lab.setQuantity("O2", 5);
    
    expect(() => lab.addProduct("H2O", 1)).toThrow();
  });
});

describe("Méthode make - production optimale", () => {
  it("produit la quantité demandée si suffisamment de réactifs", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 10);
    lab.setQuantity("O2", 5);
    
    const produced = lab.make("H2O", 3);
    
    expect(produced).toBe(3);
    expect(lab.getQuantity("H2O")).toBe(3);
    expect(lab.getQuantity("H2")).toBe(4);
    expect(lab.getQuantity("O2")).toBe(2);
  });

  it("produit le maximum possible si pas assez de réactifs", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 5);
    lab.setQuantity("O2", 5);
    
    const produced = lab.make("H2O", 10);
    
    expect(produced).toBe(2);
    expect(lab.getQuantity("H2O")).toBe(2);
    expect(lab.getQuantity("H2")).toBe(1);
    expect(lab.getQuantity("O2")).toBe(3);
  });

  it("retourne 0 si aucun réactif disponible", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 0);
    lab.setQuantity("O2", 0);
    
    const produced = lab.make("H2O", 5);
    
    expect(produced).toBe(0);
    expect(lab.getQuantity("H2O")).toBe(0);
  });

  it("calcule correctement avec plusieurs réactifs limitants", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 7);
    lab.setQuantity("O2", 2);
    
    const produced = lab.make("H2O", 10);
    
    expect(produced).toBe(2);
    expect(lab.getQuantity("H2")).toBe(3);
    expect(lab.getQuantity("O2")).toBe(0);
  });

  it("rejette un produit sans réaction définie", () => {
    const lab = new Laboratory(["H2O", "H2"], {});
    expect(() => lab.make("H2O", 1)).toThrow();
  });

  it("gère les quantités décimales", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2.5 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2", "O2"], reactions);
    lab.setQuantity("H2", 10);
    lab.setQuantity("O2", 3);
    
    const produced = lab.make("H2O", 5);
    
    expect(produced).toBe(3);
    expect(lab.getQuantity("H2O")).toBe(3);
    expect(lab.getQuantity("H2")).toBe(2.5);
    expect(lab.getQuantity("O2")).toBe(0);
  });
});

describe("Réactions utilisant des produits comme réactifs", () => {
  it("permet d'utiliser un produit comme réactif pour une autre réaction", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
      H2O2: [
        { substance: "H2O", quantity: 1 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2O2", "H2", "O2"], reactions);
    lab.setQuantity("H2", 10);
    lab.setQuantity("O2", 10);
    
    lab.make("H2O", 3);
    const produced = lab.make("H2O2", 2);
    
    expect(produced).toBe(2);
    expect(lab.getQuantity("H2O")).toBe(1);
    expect(lab.getQuantity("H2O2")).toBe(2);
    expect(lab.getQuantity("O2")).toBe(5);
  });

  it("calcule correctement la production maximale avec des produits intermédiaires", () => {
    const reactions = {
      H2O: [
        { substance: "H2", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
      H2O2: [
        { substance: "H2O", quantity: 2 },
        { substance: "O2", quantity: 1 },
      ],
    };
    const lab = new Laboratory(["H2O", "H2O2", "H2", "O2"], reactions);
    lab.setQuantity("H2", 20);
    lab.setQuantity("O2", 20);
    
    lab.make("H2O", 5);
    const produced = lab.make("H2O2", 10);
    
    expect(produced).toBe(2);
    expect(lab.getQuantity("H2O")).toBe(1);
    expect(lab.getQuantity("H2O2")).toBe(2);
  });
});
