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
