import { Action } from "../Action";

export class AscendAction extends Action {
    public enabled: boolean = true;
    public interval: number = 0;
    public shouldExecuteImmediately: boolean = false;

    protected canExecute(): boolean {
        // TODO
        return false;
    }

    public executeAction(): boolean {
        // TODO
        // Pop wrinklers
        // Slot dragon aura
        // Slot godzamok in pantheon
        // Sell all buildings
        // Harvest plants
        // Buy chocolate egg upgrade
        return false;
    }

    protected log(): void {
        // TODO
    }

    protected finalize(): void {
        // TODO
    }
}