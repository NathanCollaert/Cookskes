import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { Fortune } from "../../types/Fortune";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class ClickFortuneCookieAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.fortuneInterval;
    public shouldExecuteImmediately: boolean = true;
    private clickedFortune: 0 | Fortune = 0;

    protected canExecute(): boolean {
        return game.TickerEffect !== 0 && game.tickerL !== null;
    }

    protected executeAction(): boolean {
        this.clickedFortune = game.TickerEffect;
        game.tickerL.click();
        return this.clickedFortune !== 0;
    }

    protected log(): void {
        // TODO: clickedFortune sometimes undefined
        LogEngine.addLog(LogType.FORTUNES, `Clicked fortune cookie: ${(this.clickedFortune as Fortune).sub.name}`);
    }

    protected finalize(): void {
        this.clickedFortune = 0;
    }
}