export default interface RideDAO {
    save(ride: any): Promise<void>;
    getIncompleteByPassengerId(passengerId: string): Promise<any>;
    getById(rideId: string): Promise<any>;
}