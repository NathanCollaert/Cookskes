import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { formatNumber } from "../../../utils/Formatting";
import { HALLOWEEN_COOKIES, isSeasonActive, unlockedAllUpgrades } from "../../../utils/Game";
import { LogType } from "../../types/LogType";
import { Season } from "../../types/Season";
import { Wrinkler } from "../../types/Wrinkler";
import { Action } from "../Action";

export class popWrinklerAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.popWrinklerInterval;
    public shouldExecuteImmediately: boolean = true;
    private wrinkler: Wrinkler | null = null;

    protected canExecute(): boolean {
        if (!game.Upgrades["One mind"].bought) return false;
        if (!isSeasonActive(Season.HALLOWEEN)) return false;
        if (unlockedAllUpgrades(HALLOWEEN_COOKIES)) return false;
        if (game.wrinklers.filter(w => w.close === 1).length < game.getWrinklersMax()) return false;

        return true;
    }

    protected executeAction(): boolean {
        this.wrinkler = this.getOldestWrinkler();
        if (!this.wrinkler) return false;

        this.wrinkler.hp = 0;

        return true;
    }

    protected log(): void {
        if (this.wrinkler)
            LogEngine.addLog(LogType.WRINKLER, `Popped wrinkler | ${formatNumber(this.wrinkler.sucked)}`)
    }

    protected finalize(): void {
        this.wrinkler = null;
    }

    private getOldestWrinkler(): Wrinkler | null {
        return game.wrinklers.reduce<Wrinkler | null>((max, item) => {
            if (item.close !== 1) return max
            if (!max || item.sucked > max.sucked) return item
            return max
        }, null);
    }
}