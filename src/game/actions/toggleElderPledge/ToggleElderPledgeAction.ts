import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { formatNumber } from "../../../utils/Formatting";
import { HALLOWEEN_COOKIES, unlockedAllUpgrades } from "../../../utils/Game";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class ToggleElderPledgeAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.buyInterval;
    public shouldExecuteImmediately: boolean = true;
    private readonly ELDER_PLEDGE: number = 74;
    private upgrade: any | null = null;
    private upgradePrice: number = 0;

    protected canExecute(): boolean {
        this.upgrade = game.UpgradesById[this.ELDER_PLEDGE];
        if (this.upgrade.unlocked === 0) return false;
        this.upgradePrice = this.upgrade.getPrice();
        if (this.upgradePrice > game.cookies) return false;
        if (!unlockedAllUpgrades(HALLOWEEN_COOKIES)) return false;
        if (this.upgrade.bought === 1) return false;

        return true;
    }

    protected executeAction(): boolean {
        this.upgrade.buy();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.UPGRADES, `Bought ${this.upgrade!.name} | ${formatNumber(this.upgradePrice)} `);
    }

    protected finalize(): void {
        this.upgrade = null;
        this.upgradePrice = 0;
    }
}