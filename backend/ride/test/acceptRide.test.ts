import AcceptRide from "../src/application/usecases/AcceptRide";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import DatabaseConnection from "../src/infra/database/DatabaseConncetion";
import GetAccount from "../src/application/usecases/GetAccount";
import GetRide from "../src/application/usecases/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecases/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecases/Signup";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let databaseConnection: DatabaseConnection;



beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    const rideRepository = new RideRepositoryDatabase(databaseConnection);
    requestRide = new RequestRide(accountRepository, rideRepository, logger);
    getRide = new GetRide(rideRepository, logger);
    getAccount =  new GetAccount(accountRepository);
    acceptRide = new AcceptRide(accountRepository, rideRepository);
})

test("Motorista deve aceitar uma corrida com sucesso", async () => {
    const inputSignupPassenger = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRideRequest = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }
    const outputResquestRide = await requestRide.execute(inputRideRequest);
    console.log(outputResquestRide);
    const inputSignupDriver = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA9999",
        password: "123456"
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputResquestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);
    const outputGetRide = await getRide.execute(outputResquestRide.rideId);
    expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Não deve aceitar uma corrida se conta não for de motorista", async () => {
    const inputSignupPassenger = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRideRequest = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }
    const outputResquestRide = await requestRide.execute(inputRideRequest);
    const inputSignupDriver = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputResquestRide,
        driverId: outputSignupDriver.accountId
    }
    await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only driver can accept ride."));
});

afterEach(async () => {
    await databaseConnection.close(); 
});