import GetAccount from "../../application/usecases/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecases/Signup";
import Registry from "../di/Registry";

// Interface Adapter
export default class MainController {

    constructor (registry: Registry) {

        const httpServer = Registry.getInstance().inject("httpServer");
        const signup = Registry.getInstance().inject("signup");
        const getAccount = Registry.getInstance().inject("getAccount");

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