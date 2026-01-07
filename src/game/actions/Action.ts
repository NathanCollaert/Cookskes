export abstract class Action {
    public abstract enabled: boolean;
    public abstract interval: number;
    public abstract shouldExecuteImmediately: boolean;
    protected abstract canExecute(): boolean;
    protected abstract executeAction(): boolean;

    public execute(): boolean {
        if (!this.canExecute()) return false;

        const executed: boolean = this.executeAction();

        if (executed) {
            this.log();
        }

        this.finalize();

        return executed;
    }

    protected log(): void { }

    protected finalize(): void { }
}