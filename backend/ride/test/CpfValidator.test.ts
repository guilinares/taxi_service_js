import { validateCpf } from "../src/CpfValidator";

test.each([
    "58849157053",
    "71428793860",
	"87748248800"
])("Deve testar cpfs válidos", function(cpf) {
    expect(validateCpf(cpf)).toBe(true);
});

test.each([
    null,
    undefined,
    "",
    "11111111111",
    "11111111111111111",
    "1111"
])("Deve testar cpfs invalidos", function(cpf: any) {
    expect(validateCpf(cpf)).toBe(false);
});