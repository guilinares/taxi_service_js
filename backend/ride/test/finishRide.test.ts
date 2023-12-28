import AcceptRide from "../src/application/usecases/AcceptRide";
import FinishRide from "../src/application/usecases/FinishRide";
import GetAccount from "../src/application/usecases/GetAccount";
import GetRide from "../src/application/usecases/GetRide";
import RequestRide from "../src/application/usecases/RequestRide";
import Signup from "../src/application/usecases/Signup";
import StartRide from "../src/application/usecases/StartRide";
import UpdatePosition from "../src/application/usecases/UpdatePosition";
import DatabaseConnection from "../src/infra/database/DatabaseConncetion";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    const rideRepository = new RideRepositoryDatabase(databaseConnection);
    const positionRepository = new PositionRepositoryDatabase(databaseConnection);
    signup = new Signup(accountRepository, logger);
    requestRide = new RequestRide(accountRepository, rideRepository, logger);
    getRide = new GetRide(rideRepository, positionRepository, logger);
    getAccount =  new GetAccount(accountRepository);
    acceptRide = new AcceptRide(accountRepository, rideRepository);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
    finishRide = new FinishRide(rideRepository, positionRepository);
});

test("Deve finalizar a corrida com sucesso",async () => {
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
        fromLat: -23.539989,
        fromLong: -46.592060,
        toLat: -23.547858,
        toLong: -46.610637
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
    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -23.539989,
        long: -46.592060
    };
    await updatePosition.execute(inputUpdatePosition1);
    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -23.547858,
        long: -46.610637
    };
    await updatePosition.execute(inputUpdatePosition2);
    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    }
    await finishRide.execute(inputFinishRide);
    const outputGetRideStarted = await getRide.execute(outputRequestRide.rideId);
    console.log(outputGetRideStarted);
    expect(outputGetRideStarted.status).toBe("completed");
    expect(outputGetRideStarted.distance).toBe(2);
    expect(outputGetRideStarted.fare).toBe(4.2);
});