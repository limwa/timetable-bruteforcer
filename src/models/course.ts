export class Course {

    readonly id: number;
    readonly code: string;
    readonly year: number;
    readonly name: string;
    
    constructor({ id, code, year, name }: Course) {
        this.id = id;
        this.code = code;
        this.year = year;
        this.name = name;
    }

    public toString() {
        return `[${this.code}] ${this.name} (${this.year} / ${this.year + 1})`;
    }
}
