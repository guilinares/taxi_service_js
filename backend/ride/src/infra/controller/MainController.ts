import GetAccount from "../../application/usecases/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecases/Signup";
import Registry from "../di/Registry";

// Interface Adapter
export default class MainController {

    constructor (registry: Registry) {

        const httpServer = registry.inject("httpServer");
        const signup = registry.inject("signup");
        const getAccount = registry.inject("getAccount");

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