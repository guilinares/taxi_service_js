export default class Cpf {

    constructor (readonly value: string) {
        if (!this.validate(value)) throw new Error("Invalid cpf");
    }

    private validate (cpf: string) {
        if (!cpf) return false;
        cpf = this.cleanCpf(cpf);
        if (this.isInvalidLenght(cpf)) return false;
        if (this.allDigitsAreTheSame(cpf)) return false;
        const d1 = this.calculateDigit(cpf, 10);
        const d2 = this.calculateDigit(cpf, 11);
        return this.extractCheckDigit(cpf) == `${d1}${d2}`;
    }
    
    private cleanCpf(cpf: string) {
        return cpf.replace(/\D/g, "");
    }
    
    private isInvalidLenght(cpf: string) {
        return !(cpf.length >= 11 && cpf.length <= 14);
    }
    
    private allDigitsAreTheSame(cpf: string) {
        return cpf.split("").every(c => c === cpf[0]);
    }
    
    private calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total%11;
        return (rest < 2) ? 0 : 11 - rest;
    }
    
    private extractCheckDigit(cpf: string) {
        return cpf.slice(9);
    }


}