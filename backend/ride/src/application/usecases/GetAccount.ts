import AccountRepository from "../repository/AccountRepository";

export default class GetAccount { 
    accountRepository: AccountRepository;

    constructor(accountDAO: AccountRepository) {
        this.accountRepository = accountDAO;
    }

    async execute(accountId: string) {
        const account = this.accountRepository.getById(accountId);
        return account;
    }
}
