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
import StartRide from "../src/application/usecases/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;


beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    const rideDAO = new RideRepositoryDatabase(databaseConnection);
    requestRide = new RequestRide(accountRepository, rideDAO, logger);
    getRide = new GetRide(rideDAO, logger);
    getAccount =  new GetAccount(accountRepository);
    acceptRide = new AcceptRide(accountRepository, rideDAO);
    startRide = new StartRide(rideDAO)
})

test("Deve iniciar uma corrida com sucesso", async () => {
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
    const outputRequestRide = await requestRide.execute(inputRideRequest);
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
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);
    const inputStartRide = {
        rideId: outputRequestRide.rideId
    }
    await startRide.execute(inputStartRide);
    const outputGetRideStarted = await getRide.execute(outputRequestRide.rideId);

    expect(outputGetRideStarted.status).toBe("in_progress");
});

afterEach(async () => {
    await databaseConnection.close(); 
});