import DatabaseConnection from "../database/DatabaseConncetion";
import PositionRepository from "../../application/repository/PositionRepository";
import Position from "../../domain/Position";
import Coord from "../../domain/Coord";

// Interface Adapter
export default class PositionRepositoryDatabase implements PositionRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async save(position: Position): Promise<void> {
        await this.connection.query("insert into cccat14.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", 
        [position.positionId, position.rideId, position.coord.lat, position.coord.long, position.date]);
    }

    async listByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.connection.query("select * from cccat14.position where ride_id = $1", [rideId]);
        let positions: Position[] = [];
        for (const positionData of positionsData) {
            positions.push(new Position(positionData.position_id, positionData.ride_id, new Coord(parseFloat(positionData.lat), parseFloat(positionData.long)), positionData.date));
        }
        return positions;
    }
}