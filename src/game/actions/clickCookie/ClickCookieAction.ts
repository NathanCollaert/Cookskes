import { Config } from "../../../Config";
import { game } from "../../../index";
import { Action } from "../Action";

export class ClickCookieAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.clickInterval;
    public shouldExecuteImmediately: boolean = true;

    protected canExecute(): boolean {
        return true;
    }

    protected executeAction(): boolean {
        game.ClickCookie();
        return true;
    }
}