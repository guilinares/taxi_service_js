import { getAccount, signup } from "../src/main";

test.each([
    "58849157053",
    "71428793860",
	"87748248800"
])("Deve cadastrar passageiro com sucesso", async function (cpf: string) {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf,
        isPassenger: true,
        password: "123456"
    };
    // When
    const outputSignup = await signup(inputSignup);
    const outputAccount = await getAccount(outputSignup.accountId)

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);
});

test.each([
    null,
    undefined,
    "",
    "11111111111",
    "11111111111111111",
    "1111"
])("Não deve cadastrar passageiro com cpf invalido", async function (cpf: any) {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf,
        isPassenger: true,
        password: "123456"
    };
    // When
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid cpf"))
});

test("Não deve cadastrar passageiro com email invalido", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    // When
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid email"))
});

test("Não deve cadastrar passageiro com nome invalido", async function () {
    // Given
    const inputSignup = {
        name: "Gui",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    // When
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid name"))
});

test("Não deve cadastrar passageiro duplicado", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Abreu",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    // When
    await signup(inputSignup);
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Duplicated account"))
});

test("Deve cadastrar motorista com sucesso", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: false,
        isDriver: true,
        password: "123456",
        carPlate: "AAA9999"
    };
    // When
    const outputSignup = await signup(inputSignup);
    const outputAccount = await getAccount(outputSignup.accountId);
    console.log(outputAccount)

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);
    expect(outputAccount.is_passenger).toBe(false);
    expect(outputAccount.is_driver).toBe(true);
});

test("Não deve cadastrar motorista", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: false,
        isDriver: true,
        password: "123456",
        carPlate: "AAA999"
    };
    // When
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid car plate"))

});