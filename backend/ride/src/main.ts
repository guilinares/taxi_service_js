import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecases/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecases/Signup";


// composition root ou entry point
// criar o grafo de dependencias criado no projeto (Dependency Injection, ...)
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const signup = new Signup(accountRepository, logger);
const getAccount = new GetAccount(accountRepository);
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);