import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { HALLOWEEN_COOKIES, isSeasonActive, unlockedAllUpgrades } from "../../../utils/Game";
import { PantheonEngine } from "../../pantheon/PantheonEngine";
import { God } from "../../types/God";
import { LogType } from "../../types/LogType";
import { PantheonSlot } from "../../types/PantheonSlot";
import { Season } from "../../types/Season";
import { Action } from "../Action";

export class popWrinklersAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.popWrinklerInterval;
    public shouldExecuteImmediately: boolean = true;

    protected canExecute(): boolean {
        if (game.Upgrades["One mind"].bought === 0) return false;
        if (!isSeasonActive(Season.HALLOWEEN)) return false;
        if (unlockedAllUpgrades(HALLOWEEN_COOKIES)) return false;
        if (game.wrinklers.filter(w => w.close === 1).length < game.getWrinklersMax()) return false;

        return true;
    }

    protected executeAction(): boolean {
        PantheonEngine.instance.setManualGod(God.SKRUUIA, PantheonSlot.DIAMOND);
        game.CollectWrinklers();
        PantheonEngine.instance.clearManualGod();
        return true;
    }

    protected log(): void {
        // TODO - FIX: sometimes logs 5 times
        LogEngine.addLog(LogType.WRINKLER, `Popped all wrinklers`)
    }
}