import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class GetRide {
    rideDAO: RideDAO;
    logger: Logger;

    constructor(rideDAO: RideDAO, logger: Logger) {
        this.rideDAO = rideDAO;
        this.logger = logger;
    }

    async execute(rideId: string) {
        const ride = this.rideDAO.getById(rideId);
        this.logger.log(`get ride ${ride}`);
        return ride;
    }

}