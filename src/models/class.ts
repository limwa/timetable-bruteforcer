export class Class {

    readonly id: number;
    readonly name: string;

    constructor({ id, name }: Class) {
        this.id = id;
        this.name = name;
    }
}
