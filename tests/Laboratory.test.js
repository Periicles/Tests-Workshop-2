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
