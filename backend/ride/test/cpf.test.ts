import Cpf from "../src/domain/Cpf";

test.each([
    "58849157053",
    "71428793860",
	"87748248800"
])("Deve testar cpfs válidos", function(cpf) {
    expect(new Cpf(cpf)).toBeDefined;
});

test.each([
    null,
    undefined,
    "",
    "11111111111",
    "11111111111111111",
    "1111"
])("Deve testar cpfs invalidos", function(cpf: any) {
    expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
});