import Name from "../src/domain/Name";

test("Deve testar um nome váluido", function () {
    const name = new Name("Guilherme Linares");
    expect(name.value).toBeDefined;
});

test("Deve gerar erro ao passar nome inválido", function () {
    expect(() => new Name("Guilherme")).toThrow(new Error("Invalid name"));
});