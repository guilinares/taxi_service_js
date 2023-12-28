import GetRide from "../src/application/usecases/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecases/RequestRide";
import Signup from "../src/application/usecases/Signup";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConncetion";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;


beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);

    const rideRepository = new RideRepositoryDatabase(databaseConnection);
    requestRide = new RequestRide(accountRepository, rideRepository, logger);
    const positionRepository = new PositionRepositoryDatabase(databaseConnection);

    getRide = new GetRide(rideRepository, positionRepository, logger);
});

test("Deve solicitar uma corrida com sucesso", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };

    const {accountId} = await signup.execute(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    const outputResquestRide = await requestRide.execute(inputRideRequest);
    const ride = await getRide.execute(outputResquestRide.rideId);
    expect(outputResquestRide).toBeDefined();
    expect(ride.rideId).toBeDefined();
    expect(ride.status).toBe("requested");
    expect(ride.date).toBeDefined();
});

test("Não deve solicitar uma corrida se não for passageiro", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA9999",
        password: "123456"
    };

    const {accountId} = await signup.execute(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    await expect(() => requestRide.execute(inputRideRequest)).rejects.toThrow(new Error("Only passengers can request rides"));
});

test("Não deve solicitar uma corrida se já existir uma em andamento", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };

    const {accountId} = await signup.execute(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    await requestRide.execute(inputRideRequest);
    await expect(() => requestRide.execute(inputRideRequest)).rejects.toThrow(new Error("There is already a ride underway"));
});

afterEach(async () => {
    await databaseConnection.close(); 
});