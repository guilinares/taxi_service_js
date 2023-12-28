import Account from "../src/domain/Account";

test("Deve criar ua conta", () => {
    const account = Account.create("Guilherme Linares", "gui.123@gmail.com", "58849157053", "AAA9999", true, false);
    expect(account.accountId).toBeDefined();
    expect(account.name.value).toBe("Guilherme Linares");
    expect(account.email.value).toBe("gui.123@gmail.com");
    expect(account.cpf.value).toBe("58849157053");
});