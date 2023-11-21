import AccountDAODatabase from "../src/AccountDAODatabase";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RideDAODatabase from "../src/RideDAODatabase";
import RequestRide from "../src/RideRequest";
import Signup from "../src/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);

    const rideDAO = new RideDAODatabase();
    requestRide = new RequestRide(accountDAO, rideDAO, logger);

    getRide = new GetRide(rideDAO, logger);
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
    const ride = await getRide.execute(outputResquestRide);

    expect(outputResquestRide).toBeDefined();
    expect(ride.ride_id).toBeDefined();
    expect(ride.status).toBe("requested");
    console.log(ride.date);
    expect(ride.date).toBeDefined();
});

test("Não deve solicitar uma corrida se não for passageiro", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: false,
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