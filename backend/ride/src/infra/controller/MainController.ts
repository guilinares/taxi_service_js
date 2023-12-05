import GetAccount from "../../application/usecases/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecases/Signup";

// Interface Adapter
export default class MainController {

    constructor (readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
        httpServer.register("post", "/signup", async function (params: any, body:any) {
            const output = await signup.execute(body);
            return output;
        });

        httpServer.register("get", "/get_account/:accountId", async function (params: any, body: any) {
            const output = await getAccount.execute(params.accountId);
            return output;
        });
    }
}