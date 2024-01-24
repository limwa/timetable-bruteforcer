export class Teacher {

    readonly id: string;
    readonly name: string;
    readonly abbreviation: string;

    constructor({ id, name, abbreviation }: Teacher) {
        this.id = id;
        this.name = name;
        this.abbreviation = abbreviation;
    }

    public toString() {
        return `[${this.abbreviation}] ${this.name}`;
    }
}
