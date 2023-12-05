import RideRepository from "../repository/RideRepository";
import Logger from "../logger/Logger";
import AccountRepository from "../repository/AccountRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {

    accountRepository: AccountRepository;
    rideDAO: RideRepository;
    logger: Logger;

    constructor(accountRepository: AccountRepository, rideDAO: RideRepository, logger: Logger) {
        this.accountRepository = accountRepository;
        this.rideDAO = rideDAO;
        this.logger = logger;
    }

   async execute(input: Input): Promise<Output> {
        const account = await this.accountRepository.getById(input.passengerId);
        if (!account) throw new Error("Account does not exist");
        if (!account.isPassenger) throw new Error("Only passengers can request rides");
        const activeRide = await this.rideDAO.getIncompleteByPassengerId(input.passengerId);
        if (activeRide) throw new Error("There is already a ride underway");
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideDAO.save(ride);
        return {
            rideId: ride.rideId
        };    
    }
}

type Input = {
    passengerId: string, 
    fromLat: number,
    fromLong: number,
    toLat: number, 
    toLong: number
}

type Output = {
    rideId: string
}