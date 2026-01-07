import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class UpgradeDragonAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.dragonUpgradeInterval;
    public shouldExecuteImmediately: boolean = true;

    protected canExecute(): boolean {
        if (!game.Upgrades["A crumbly egg"].bought) return false;
        if (game.dragonLevel >= game.dragonLevels.length - 1) return false;
        if (!game.dragonLevels[game.dragonLevel].cost()) return false;
        return true;
    }

    protected executeAction(): boolean {
        game.specialTab = "dragon";
        game.UpgradeDragon();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.DRAGON, `Upgraded dragon | ${game.dragonLevel} | ${game.dragonLevels[game.dragonLevel].name}`);
    }
}