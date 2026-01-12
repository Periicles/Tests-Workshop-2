import { Laboratory } from "../src/Laboratory.js";

describe("Laboratory initialisation", () => {
  it("accepte une liste vide", () => {
    expect(() => new Laboratory([])).not.toThrow();
  });

  it("accepte une liste de substances valides", () => {
    expect(() => new Laboratory(["H2O", "NaCl"])).not.toThrow();
  });

  it("attribue une quantité initiale à 0 pour chaque substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    expect(lab.getQuantity("H2O")).toBe(0);
    expect(lab.getQuantity("NaCl")).toBe(0);
  });
});

describe("Laboratory initialisation - cas d'erreur", () => {
  it("rejette null comme paramètre", () => {
    expect(() => new Laboratory(null)).toThrow();
  });

  it("rejette undefined comme paramètre", () => {
    expect(() => new Laboratory(undefined)).toThrow();
  });

  it("rejette un paramètre qui n'est pas un tableau", () => {
    expect(() => new Laboratory("H2O")).toThrow();
    expect(() => new Laboratory(123)).toThrow();
    expect(() => new Laboratory({})).toThrow();
  });

  it("rejette un tableau contenant des éléments non-string", () => {
    expect(() => new Laboratory(["H2O", 123])).toThrow();
    expect(() => new Laboratory([null, "NaCl"])).toThrow();
    expect(() => new Laboratory(["H2O", undefined])).toThrow();
  });

  it("rejette un tableau contenant des substances en double", () => {
    expect(() => new Laboratory(["H2O", "NaCl", "H2O"])).toThrow();
  });
});

describe("getQuantity - cas d'erreur", () => {
  it("rejette une substance qui n'est pas dans la liste", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    expect(() => lab.getQuantity("CO2")).toThrow();
  });

  it("rejette null comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    expect(() => lab.getQuantity(null)).toThrow();
  });

  it("rejette undefined comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    expect(() => lab.getQuantity(undefined)).toThrow();
  });

  it("rejette une chaîne vide comme paramètre", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    expect(() => lab.getQuantity("")).toThrow();
  });
});

describe("Gestion des quantités", () => {
  it("permet d'ajouter une quantité à une substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    lab.addQuantity("H2O", 10.5);
    expect(lab.getQuantity("H2O")).toBe(10.5);
  });

  it("permet d'ajouter une quantité supplémentaire à une substance existante", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    lab.addQuantity("H2O", 10);
    lab.addQuantity("H2O", 5);
    expect(lab.getQuantity("H2O")).toBe(15);
  });

  it("permet de définir une quantité spécifique pour une substance", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    lab.setQuantity("NaCl", 25.75);
    expect(lab.getQuantity("NaCl")).toBe(25.75);
  });

  it("permet de remplacer une quantité existante avec setQuantity", () => {
    const lab = new Laboratory(["H2O", "NaCl"]);
    lab.setQuantity("H2O", 10);
    lab.setQuantity("H2O", 20);
    expect(lab.getQuantity("H2O")).toBe(20);
  });

  it("conserve les quantités indépendantes pour chaque substance", () => {
    const lab = new Laboratory(["H2O", "NaCl", "CO2"]);
    lab.addQuantity("H2O", 10);
    lab.setQuantity("NaCl", 5);
    lab.addQuantity("CO2", 7.5);
    expect(lab.getQuantity("H2O")).toBe(10);
    expect(lab.getQuantity("NaCl")).toBe(5);
    expect(lab.getQuantity("CO2")).toBe(7.5);
  });
});
