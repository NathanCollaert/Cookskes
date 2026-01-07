import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { isSeasonActive } from "../../../utils/Game";
import { SeasonEngine } from "../../season/SeasonEngine";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class SwitchSeasonAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.seasonInterval;
    public shouldExecuteImmediately: boolean = true;
    private seasonEngine: SeasonEngine;

    constructor() {
        super();
        this.seasonEngine = new SeasonEngine();
    }

    protected canExecute(): boolean {
        if (!game.Upgrades["Season switcher"].bought) return false;
        if (game.seasonUses > 22) return false;
        return true;
    }

    protected executeAction(): boolean {
        const optimalSeason = this.seasonEngine.calculateOptimalSeason();
        if (isSeasonActive(optimalSeason)) return false;

        game.Upgrades[optimalSeason].buy();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SEASONS, `Switched season | ${game.season}`);
    }
}