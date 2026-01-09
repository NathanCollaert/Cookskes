import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { hasAll } from "../../../utils/Numbers";
import { DragonEngine } from "../../dragon/DragonEngine";
import { DragonAura } from "../../types/DragonAura";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class BuyDragonAuraAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.dragonAuraInterval;
    public shouldExecuteImmediately: boolean = true;
    private upgradedDragonAura: DragonAura[] = [];

    protected canExecute(): boolean {
        if (game.Upgrades["A crumbly egg"].bought === 0) return false;
        return true;
    }

    protected executeAction(): boolean {
        this.upgradedDragonAura = DragonEngine.instance.calculateOptimalAuras();
        if (this.upgradedDragonAura.length > 0 && !hasAll([game.dragonAura, game.dragonAura2], this.upgradedDragonAura)) {
            game.specialTab = "dragon";
            for (let i = 0; i < this.upgradedDragonAura.length; i++) {
                game.SetDragonAura(this.upgradedDragonAura[i], i);
                game.ConfirmPrompt();
            }
            return true;
        }
        return false;
    }

    protected log(): void {
        const auraInfo = this.upgradedDragonAura.map(aura => DragonAura[aura]).join(", ");
        LogEngine.addLog(LogType.DRAGON, `Bought dragon aura | ${auraInfo}`);
    }

    protected finalize(): void {
        this.upgradedDragonAura = [];
    }
}