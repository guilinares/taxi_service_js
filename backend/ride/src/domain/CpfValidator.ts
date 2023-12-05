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