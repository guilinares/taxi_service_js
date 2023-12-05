import DatabaseConnection from "./DatabaseConncetion";
import pgp from "pg-promise";

export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor () {
        this.connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
    }

    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}