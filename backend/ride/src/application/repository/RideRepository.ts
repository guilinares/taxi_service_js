import Ride from "../../domain/Ride";

export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    update(ride: Ride): Promise<void>;
    getIncompleteByPassengerId(passengerId: string): Promise<Ride | undefined>;
    getById(rideId: string): Promise<Ride | undefined>;
}