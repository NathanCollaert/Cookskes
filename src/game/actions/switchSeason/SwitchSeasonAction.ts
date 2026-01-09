import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { isSeasonActive } from "../../../utils/Game";
import { SeasonEngine } from "../../season/SeasonEngine";
import { LogType } from "../../types/LogType";
import { Season } from "../../types/Season";
import { Action } from "../Action";

export class SwitchSeasonAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.seasonInterval;
    public shouldExecuteImmediately: boolean = true;
    private seasonEngine: SeasonEngine;
    private optimalSeason: Season | null = null;

    constructor() {
        super();
        this.seasonEngine = new SeasonEngine();
    }

    protected canExecute(): boolean {
        if (game.Upgrades["Season switcher"].bought === 0) return false;
        if (game.seasonUses > 22) return false;

        this.optimalSeason = this.seasonEngine.calculateOptimalSeason();
        if (isSeasonActive(this.optimalSeason)) return false;
        if (game.Upgrades[this.optimalSeason]?.priceFunc() > game.cookies) return false;
        return true;
    }

    protected executeAction(): boolean {
        game.Upgrades[this.optimalSeason!].buy();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SEASONS, `Switched season | ${game.season}`);
    }

    protected finalize(): void {
        this.optimalSeason = null;
    }
}