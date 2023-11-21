import express from "express";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import AccountDAO from "./AccountDAODatabase";
import AccountDAODatabase from "./AccountDAODatabase";
import LoggerConsole from "./LoggerConsole";

const PORT = 3000;

const server = express();
server.use(express.json());
server.post("/signup", async (request, response) => {
    try {
        const {name, email, cpf, car_plate, is_passenger, is_driver, password} = request.body;
        const inputSignup = {
            name,
            email,
            cpf,
            carPlate: car_plate,
            isPassenger: is_passenger,
            isDriver: is_driver,
            password: password
        };
        const accountDAO = new AccountDAODatabase();
        const logger = new LoggerConsole();
        const signup = new Signup(accountDAO, logger);
        const accountId = await signup.execute(inputSignup);
        response.send(JSON.stringify(accountId));
    } catch (e: any) {
        response.status(422).json({
            message: e.message
        });
    }
});

server.get("/get_account/:accountId", async (request, response) => {
    const accountId = request.params.accountId;
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const account = await getAccount.execute(accountId);
    response.send(JSON.stringify(account));
});

// server.post("/request_ride", async (request, response) => {
//     const {passenger_id, from_lat, from_long, to_lat, to_long} = request.body;
//     const inputRideRequest = {
//         passengerId: passenger_id,
//         fromLat: from_lat,
//         fromLong: from_long,
//         toLat: to_lat,
//         toLong: to_long
//     };
//     const rideId = await requestRide(inputRideRequest);
//     response.send(JSON.stringify(rideId));
// });

// server.get("/get_ride/:ride_id", async (request, response) => {
//    const rideId = request.params.ride_id;
//    const ride = await getRide(rideId);
//    response.send(JSON.stringify(ride));
// });

server.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}...`);
});              