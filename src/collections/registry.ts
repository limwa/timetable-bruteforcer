type Identifiable = { id: unknown };
type Resolver<T extends Identifiable> = (id: T["id"]) => T | Promise<T>;

export class Registry<T extends Identifiable> {
    private records = new Map<T["id"], T>();

    constructor(private resolve: Resolver<T>) {}

    public async get(id: T["id"]) {
        const record = this.records.get(id);
        if (record !== undefined) {
            return record;
        }
    
        const resolved = await this.resolve(id);

        this.records.set(id, resolved);
        return resolved;
    }
    
    public set(record: T) {
        this.records.set(record.id, record);
        return record;
    }
}
