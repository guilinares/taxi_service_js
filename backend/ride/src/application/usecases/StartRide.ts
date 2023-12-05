import RideRepository from "../repository/RideRepository";

export default class StartRide {

    rideRepository: RideRepository;

    constructor(rideRepository: RideRepository) {
        this.rideRepository = rideRepository;
    }

   async execute(input: any) {
        const ride = await this.rideRepository.getById(input.rideId);
        if (!ride) throw new Error("Ride not found");
        ride.start();
        await this.rideRepository.update(ride);
    }
}