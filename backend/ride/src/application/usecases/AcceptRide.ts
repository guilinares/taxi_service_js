import AccountRepository from "../repository/AccountRepository";
import RideRepository from "../repository/RideRepository";

export default class AcceptRide {

    accountRepository: AccountRepository;
    rideRepository: RideRepository;

    constructor(accountRepository: AccountRepository, rideRepository: RideRepository) {
        this.accountRepository = accountRepository;
        this.rideRepository = rideRepository;
    }

   async execute(input: any) {
        const account = await this.accountRepository.getById(input.driverId);
        if (account && !account.isDriver) throw new Error("Only driver can accept ride.")
        const ride = await this.rideRepository.getById(input.rideId);
        if (!ride) throw new Error("Ride not found");
        ride.accept(input.driverId);
        await this.rideRepository.update(ride);
    }
}