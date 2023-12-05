import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";

export default class GetRide {
    rideRpository: RideRepository;
    logger: Logger;

    constructor(rideDAO: RideRepository, logger: Logger) {
        this.rideRpository = rideDAO;
        this.logger = logger;
    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRpository.getById(rideId);
        this.logger.log(`get ride ${ride}`);
        if (!ride) throw new Error("Ride not found");
        return {
            rideId: ride.rideId,
            status: ride.getStatus(),
            driverId: ride.getDriverId(),
            passengerId: ride.passengerId,
            date: ride.date
        };
    }
}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string, 
    date: Date
}