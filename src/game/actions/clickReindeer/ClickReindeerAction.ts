import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class ClickReindeerAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.goldenCheckInterval;
    public shouldExecuteImmediately: boolean = true;
    private poppedReindeer: boolean = false;

    protected canExecute(): boolean {
        return true;
    }

    protected executeAction(): boolean {
        for (const s of game.shimmers) {
            if (s.type === "reindeer") {
                s.pop();
                this.poppedReindeer = true;
            }
        }

        return this.poppedReindeer;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SHIMMERS, `Clicked reindeer`);
    }

    protected finalize(): void {
        this.poppedReindeer = false;
    }
}