import DistanceCalculator from "../../domain/DistanceCalculator";
import Logger from "../logger/Logger";
import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";

export default class GetRide {
    rideRepository: RideRepository;
    positionRepository: PositionRepository;
    logger: Logger;

    constructor(rideRepository: RideRepository, positionRepository: PositionRepository, logger: Logger) {
        this.rideRepository = rideRepository;
        this.positionRepository = positionRepository;
        this.logger = logger;
    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getById(rideId);
        this.logger.log(`get ride ${ride}`);
        if (!ride) throw new Error("Ride not found");
        return {
            rideId: ride.rideId,
            status: ride.getStatus(),
            driverId: ride.getDriverId(),
            passengerId: ride.passengerId,
            date: ride.date,
            distance: ride.getDistance(),
            fare: ride.getFare()
        };
    }
}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string, 
    date: Date,
    distance?: number,
    fare?: number
}