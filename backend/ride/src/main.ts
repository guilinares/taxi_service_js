import crypto from "crypto";
import pgp from "pg-promise";

export function validateCpf (cpf: string) {
	if (!cpf) return false;
    cpf=cleanCpf(cpf);
    if (isInvalidLenght(cpf)) return false;
    if (allDigitsAreTheSame(cpf)) return false;
    const d1 = calculateDigit(cpf, 10);
    const d2 = calculateDigit(cpf, 11);
    return extractCheckDigit(cpf) == `${d1}${d2}`;
}

function cleanCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
}

function isInvalidLenght(cpf: string) {
    return !(cpf.length >= 11 && cpf.length <= 14);
}

function allDigitsAreTheSame(cpf: string) {
    return cpf.split("").every(c => c === cpf[0]);
}

function calculateDigit (cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const rest = total%11;
	return (rest < 2) ? 0 : 11 - rest;
}

function extractCheckDigit(cpf: string) {
    return cpf.slice(9);
}

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
	try {
		const accountId = crypto.randomUUID();
		const [account] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
		if (account) throw new Error("Duplicated account");
        if (isInvalidName(input.name)) throw new Error("Invalid name");
        if (isInvalidEmail(input.email)) throw new Error("Invalid email");
        if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
        if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
        await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
        const obj = {
            accountId: accountId
        };
        return obj;
	} finally {
		await connection.$pool.end();
	}
}

function isInvalidName(name: string) {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isInvalidEmail(email: string) {
    return !email.match(/^(.+)@(.+)$/);
}

function isInvalidCarPlate(carPlate: string) {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

export async function getAccount(accountId: string) {
    const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
    const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return account;
}