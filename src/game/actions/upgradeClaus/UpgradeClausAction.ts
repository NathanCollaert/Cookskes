import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { nextSantaLevelCost } from "../../../utils/Game";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class UpgradeClausAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.upgradeClausInterval;
    public shouldExecuteImmediately: boolean = true;

    protected canExecute(): boolean {
        if (game.Upgrades["A festive hat"].bought === 0) return false;
        if (game.Upgrades["Santa's dominion"].unlocked === 1) return false;
        if (nextSantaLevelCost() > game.cookies) return false;
        return true;
    }

    protected executeAction(): boolean {
        game.specialTab = "santa";
        const santaLevelBefore = game.santaLevel;
        game.UpgradeSanta();

        return santaLevelBefore === game.santaLevel;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SANTA, `Upgraded claus | ${game.santaLevels[game.santaLevel]}`);
    }
}