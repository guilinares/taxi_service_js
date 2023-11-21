import pgp from "pg-promise";
import RideDAO from "./RideDAO";

export default class RideDAODatabase implements RideDAO {

    async save(ride: any) {
        const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
        await connection.query("insert into cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", 
        [ride.rideId, ride.passengerId, ride.status, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        await connection.$pool.end();
    }

    async getIncompleteByPassengerId(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
        const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1 and status != 'completed'", passengerId);
        await connection.$pool.end();
        return ride;
    }

    async getById(rideId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
        const [ride] = await connection.query("select * from cccat14.ride where ride_id = $1", rideId);
        return ride;
    }

}