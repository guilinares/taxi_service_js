import crypto from "crypto";
import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";
import Logger from "./Logger";

const REQUESTED = "requested";

export default class RequestRide {

    accountDAO: AccountDAO;
    rideDAO: RideDAO;
    logger: Logger;

    constructor(accountDAO: AccountDAO, rideDAO: RideDAO, logger: Logger) {
        this.accountDAO = accountDAO;
        this.rideDAO = rideDAO;
        this.logger = logger;
    }

   async execute(inputRideRequest: any) {
        const account = await this.accountDAO.getById(inputRideRequest.passengerId);
        if (!account.is_passenger) throw new Error("Only passengers can request rides");
        this.logger.log(account);
        const ride = await this.rideDAO.getIncompleteByPassengerId(account.account_id);
        this.logger.log(ride);
        if (ride) throw new Error("There is already a ride underway");
        inputRideRequest.rideId = crypto.randomUUID();
        inputRideRequest.status = REQUESTED;
        inputRideRequest.date = new Date();
        this.rideDAO.save(inputRideRequest);
        return inputRideRequest.rideId;        
    }
}