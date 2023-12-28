import ProcessPayment from "../src/application/usecases/ProcessPayment";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import crypto from "crypto";
import TransactionRepositoryORM from "../src/infra/repository/TransactionRepositoryORM";
import GetTransactionByRideId from "../src/application/usecases/GetTransactionByRideId";

test("Deve processar um pagamento", async function () {
    const connection = new PgPromiseAdapter();
    const transactionRepository = new TransactionRepositoryORM(connection);
    const processPayment = new ProcessPayment(transactionRepository);
    const rideId = crypto.randomUUID();
    const inputProcessPayment = {
        rideId,
        creditCardToken: "123",
        amount: 1000
    }
    await processPayment.execute(inputProcessPayment);
    const getTransactionByRideId = new GetTransactionByRideId(transactionRepository);
    const output = await getTransactionByRideId.execute(rideId);
    expect(output.rideId).toBe(rideId);
    expect(output.status).toBe("paid");
    await connection.close();
})