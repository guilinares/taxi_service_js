import AccountDAO from "./AccountDAODatabase";


export default class GetAccount { 
    accountDAO: AccountDAO;

    constructor(accountDAO: AccountDAO) {
        this.accountDAO = accountDAO;
    }

    async execute(accountId: string) {
        const account = this.accountDAO.getById(accountId);
        return account;
    }
}
