import express from "express";
import { getAccount, signup } from "./main";

const PORT = 3000;

const server = express();
server.use(express.json());
server.post("/singup", async (request, response) => {
    const {name, email, cpf, car_plate, is_passenger, is_driver, password} = request.body;
    const inputSignup = {
        name,
        email,
        cpf,
        carPlate: car_plate,
        isPassenger: is_passenger,
        isDriver: is_driver,
        password: password
    }
    const accountId = await signup(inputSignup);
    response.send(JSON.stringify(accountId));
});

server.get("/get_account/:accountId", async (request, response) => {
    const accountId = request.params.accountId;
    const account = await getAccount(accountId);
    response.send(JSON.stringify(account));
});

server.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}...`);
});