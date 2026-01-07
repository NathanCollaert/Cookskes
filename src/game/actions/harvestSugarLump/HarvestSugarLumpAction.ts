import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { DragonEngine } from "../../dragon/DragonEngine";
import { DragonAura } from "../../types/DragonAura";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

// TODO: fix 
export class HarvestSugarLumpAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.harvestSugarLumpInterval;
    public shouldExecuteImmediately: boolean = true;
    private HOUR_IN_MS: number = 3600000;
    private lumpAge: number = 0;

    protected canExecute(): boolean {
        if (!game.canLumps()) return false;
        this.lumpAge = (Date.now() - game.lumpT);

        return this.canHarvestWithDragon() || this.canHarvestWithoutDragon();
    }

    protected executeAction(): boolean {
        game.clickLump();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SUGAR_LUMPS, `Harvested sugar lump`);
    }

    protected finalize(): void {
        this.lumpAge = 0;
        DragonEngine.instance.clearManualAura();
    }

    private canHarvestWithDragon(): boolean {
        return this.lumpAge >= (game.lumpRipeAge - this.HOUR_IN_MS) && DragonEngine.instance.setManualAura(DragonAura["Dragon's Curve"]);
    }

    private canHarvestWithoutDragon(): boolean {
        return this.lumpAge >= game.lumpRipeAge;
    }
}