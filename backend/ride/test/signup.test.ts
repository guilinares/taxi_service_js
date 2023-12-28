import Account from "../src/domain/Account";
import AccountRepository from "../src/application/repository/AccountRepository";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import DatabaseConnection from "../src/infra/database/DatabaseConncetion";
import GetAccount from "../src/application/usecases/GetAccount";
import Logger from "../src/application/logger/Logger";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import Signup from "../src/application/usecases/Signup";
import sinon from "sinon";
import Name from "../src/domain/Name";

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    getAccount = new GetAccount(accountRepository);
});

test("Deve cadastrar passageiro com sucesso com stub", async function () {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    const stubAccountDAOSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
    const stubAccountDAOGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);
    const stubAccountDAOGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.cpf, "", inputSignup.isPassenger, false));
    // Given
    // When
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId)

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount?.name).toBe(inputSignup.name);
    expect(outputAccount?.email).toBe(inputSignup.email);
    expect(outputAccount?.cpf).toBe(inputSignup.cpf);

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
    expect(outputAccount?.name).toBe(inputSignup.name);
    expect(outputAccount?.email).toBe(inputSignup.email);
    expect(outputAccount?.cpf).toBe(inputSignup.cpf);
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
    const accountRepository: AccountRepository = {
        async save(account: Account): Promise<void> {
        },
        async getById(accountId: string): Promise<Account | undefined> {
            return Account.restore(accountId, inputSignup.name, inputSignup.email, inputSignup.cpf, "", inputSignup.isPassenger, false);
        },
        async getByEmail(email: string): Promise<any> {
            return undefined;
        }
    }
    const logger: Logger = {
        log(message: string): void {
        }
    }
    const getAccount = new GetAccount(accountRepository);
    const signup = new Signup(accountRepository, logger);
    // Given
    // When
    const outputSignup = await signup.execute(inputSignup);
    const outputAccount = await getAccount.execute(outputSignup.accountId)
    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputAccount?.name).toBe(inputSignup.name);
    expect(outputAccount?.email).toBe(inputSignup.email);
    expect(outputAccount?.cpf).toBe(inputSignup.cpf);
});

test("Não deve cadastrar passageiro com cpf invalido", async function () {
    // Given
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "1111111111111111",
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
    expect(outputAccount?.name).toBe(inputSignup.name);
    expect(outputAccount?.email).toBe(inputSignup.email);
    expect(outputAccount?.cpf).toBe(inputSignup.cpf);
    expect(outputAccount?.isPassenger).toBe(false);
    expect(outputAccount?.isDriver).toBe(true);
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

afterEach(async () => {
    await databaseConnection.close(); 
});