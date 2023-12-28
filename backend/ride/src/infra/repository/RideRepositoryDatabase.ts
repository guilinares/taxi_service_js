import RideRepository from "../../application/repository/RideRepository";
import Coord from "../../domain/Coord";
import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConncetion";

export default class RideRepositoryDatabase implements RideRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async save(ride: Ride) {
        await this.connection.query("insert into cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date, fare, distance) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
        [ride.rideId, ride.passengerId, ride.getStatus(), ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date, ride.getFare(), ride.getDistance()]);
    }

    async getIncompleteByPassengerId(passengerId: string): Promise<Ride | undefined> {
        const [ride] = await this.connection.query("select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accpeted', 'in_progress')", passengerId);
        if (!ride) return;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, 
            parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), parseFloat(ride.fare), parseFloat(ride.distance));
    }

    async getById(rideId: string): Promise<Ride | undefined> {
        const [ride] = await this.connection.query("select * from cccat14.ride where ride_id = $1", rideId);
        if (!ride) return;
        let lastPosition = undefined;
        if (ride.last_lat && ride.last_long) {
            lastPosition = new Coord(parseFloat(ride.last_lat), parseFloat(ride.last_long));
        }
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, 
            parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), parseFloat(ride.fare), parseFloat(ride.distance), lastPosition);
    }

    async update(ride: Ride) {
        await this.connection.query("update cccat14.ride set status = $1, driver_id = $2, distance = $3, fare = $4, last_lat = $5, last_long = $6 where ride_id = $7", [ride.getStatus(), ride.getDriverId(), ride.getDistance(), ride.getFare(), ride.getLastPosition()?.lat, ride.getLastPosition()?.long, ride.rideId]);
    }

}