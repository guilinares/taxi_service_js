import GetAccount from "../../application/usecases/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecases/Signup";
import Registry, { inject } from "../di/Registry";

// Interface Adapter
export default class MainController {
    @inject("httpServer")
    httpServer?: HttpServer;
    @inject("signup")
    signup?: Signup;
    @inject("getAccount")
    getAccount?: GetAccount; 


    constructor () {

        // const httpServer = Registry.getInstance().inject("httpServer");
        // const signup = Registry.getInstance().inject("signup");
        // const getAccount = Registry.getInstance().inject("getAccount");

        this.httpServer?.register("post", "/signup", async (params: any, body:any) => {
            const output = await this.signup?.execute(body);
            return output;
        });

        this.httpServer?.register("get", "/get_account/:accountId", async (params: any, body: any) => {
            const output = await this.getAccount?.execute(params.accountId);
            return output;
        });
    }
}