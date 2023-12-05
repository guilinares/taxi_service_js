import axios from "axios";
import DatabaseConnection from "../src/infra/database/DatabaseConncetion";

axios.defaults.validateStatus = function () { return true };

test("Deve realizar signup de passageiro via API", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        is_passenger: true,
        password: "123456"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/get_account/${outputSignup.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve realizar signup de passageiro via API se o nome não for valido", async () => {
    const inputSignup = {
        name: "Guilherme",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        is_passenger: true,
        password: "123456"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid name");
}); 

test("Não deve realizar signup de passageiro via API se o nome não for valido", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}`,
        cpf: "58849157053",
        is_passenger: true,
        password: "123456"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid email");
}); 

test("Não deve realizar signup de passageiro via API se o nome não for valido", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "5884915705",
        isPassenger: true,
        password: "123456"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid cpf");
}); 

test("Não deve realizar signup de passageiro via API se o nome não for valido", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: true,
        password: "123456"
    };
    await axios.post("http://localhost:3000/signup", inputSignup);
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Duplicated account");
}); 

test("Deve realizar signup de motorista via API", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        isPassenger: false,
        isDriver: true,
        password: "123456",
        carPlate: "AAA9999"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/get_account/${outputSignup.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    console.log(outputGetAccount);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.isDriver).toBe(true);
});

test("Deve realizar signup de motorista via API", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "58849157053",
        carPlate: "AAA999",
        isPassenger: false,
        isDriver: true,
        password: "123456",
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid car plate");
});