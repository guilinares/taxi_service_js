import { getRide, requestRide, signup } from "../src/main";

test("Deve solicitar uma corrida com sucesso", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };

    const {accountId} = await signup(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    const outputResquestRide = await requestRide(inputRideRequest);
    const ride = await getRide(outputResquestRide);

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

    const {accountId} = await signup(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    await expect(() => requestRide(inputRideRequest)).rejects.toThrow(new Error("Only passengers can request rides"));
});

test("Não deve solicitar uma corrida se já existir uma em andamento", async () => {
    const inputSignup = {
        name: "Guilherme Linares",
        email: `gui.abreu${Math.random()}@gmail.com`,
        cpf: "72969240041",
        isPassenger: true,
        password: "123456"
    };

    const {accountId} = await signup(inputSignup);

    const inputRideRequest = {
        passengerId: accountId,
        fromLat: 123,
        fromLong: 456,
        toLat: 321,
        toLong: 654
    }

    await requestRide(inputRideRequest);
    await expect(() => requestRide(inputRideRequest)).rejects.toThrow(new Error("There is already a ride underway"));
});