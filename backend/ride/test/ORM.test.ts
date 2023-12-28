import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import ORM from "../src/infra/orm/ORM";
import TransactionModel from "../src/infra/orm/TransactionModel";
import crypto from "crypto";

test("Deve testar o ORM", async function () {
    const transactionId = crypto.randomUUID();
    const rideID = crypto.randomUUID();
    const transactionModel = new TransactionModel(transactionId, rideID, 100, new Date(), "waiting_payment");
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    await orm.save(transactionModel);
    const savedTransactionModel = await orm.get(TransactionModel, "transaction_id", transactionId);
    expect(savedTransactionModel.transactionId).toBe(transactionId);
    expect(savedTransactionModel.rideId).toBe(rideID);
    expect(savedTransactionModel.status).toBe("waiting_payment");
    await connection.close();
});