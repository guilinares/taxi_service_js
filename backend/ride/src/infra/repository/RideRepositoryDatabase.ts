import RideRepository from "../../application/repository/RideRepository";
import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConncetion";

export default class RideRepositoryDatabase implements RideRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async save(ride: Ride) {
        await this.connection.query("insert into cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", 
        [ride.rideId, ride.passengerId, ride.getStatus(), ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
    }

    async getIncompleteByPassengerId(passengerId: string): Promise<Ride | undefined> {
        const [ride] = await this.connection.query("select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accpeted', 'in_progress')", passengerId);
        if (!ride) return;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, 
            parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long));
    }

    async getById(rideId: string): Promise<Ride | undefined> {
        const [ride] = await this.connection.query("select * from cccat14.ride where ride_id = $1", rideId);
        if (!ride) return;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, 
            parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long));
    }

    async update(ride: Ride) {
        await this.connection.query("update cccat14.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.getDriverId(), ride.rideId]);
    }

}