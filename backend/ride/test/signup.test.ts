import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import Logger from "../src/Logger";
import LoggerConsole from "../src/LoggerConsole";
import Signup from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);
    getAccount = new GetAccount(accountDAO);
});

test("Deve cadastrar passageiro com sucesso com stub", async function () {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    const stubAccountDAOSave = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
    const stubAccountDAOGetByEmail = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves(null);
    const stubAccountDAOGetById = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup);
    // Given
    // When
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId)

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);

    stubAccountDAOSave.restore();
    stubAccountDAOGetByEmail.restore();
    stubAccountDAOGetById.restore();
});

test("Deve cadastrar passageiro com sucesso com mock", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    const mockLogger = sinon.mock(LoggerConsole.prototype);
    mockLogger.expects("log").withArgs("signup Guilherme Linares").once;
    // When
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId)
    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);
    mockLogger.verify();
    mockLogger.restore;
});

test("Deve cadastrar passageiro com sucesso com fake", async function () {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    const accountDAO: AccountDAO = {
        async save(account: any): Promise<void> {
        },
        async getById(accountId: string): Promise<any> {
            return inputSignup;
        },
        async getByEmail(email: string): Promise<any> {
            return undefined;
        }
    }
    const logger: Logger = {
        log(message: string): void {
        }
    }
    const getAccount = new GetAccount(accountDAO);
    const signup = new Signup(accountDAO, logger);
    // Given
    // When
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId)
    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);
});

test("Não deve cadastrar passageiro com cpf invalido", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: null,
        isPassenger: true,
        password: "123456"
    };
    // When
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"))
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
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"))
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
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"))
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
    await signup.execute(inputSignup);
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"))
});

test("Deve cadastrar motorista com sucesso", async function () {

    const spyLogger = sinon.spy(LoggerConsole.prototype, "log");
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
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId);

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount.name).toBe(inputSignup.name);
    expect(outputAccount.email).toBe(inputSignup.email);
    expect(outputAccount.cpf).toBe(inputSignup.cpf);
    expect(outputAccount.is_passenger).toBe(false);
    expect(outputAccount.is_driver).toBe(true);
    expect(spyLogger.calledOnce).toBeTruthy();
    expect(spyLogger.calledWith("signup Guilherme Linares")).toBeTruthy();
    spyLogger.restore;
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
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"))
});