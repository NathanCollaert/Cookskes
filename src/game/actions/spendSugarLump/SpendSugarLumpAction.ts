import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { SugarLumpEngine } from "../../sugarLump/SugarLumpEngine";
import { Building } from "../../types/Building";
import { BuildingType } from "../../types/BuildingType";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class SpendSugarLumpAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.spendSugarLumpInterval;
    public shouldExecuteImmediately: boolean = true;
    private sugarLumpEgine: SugarLumpEngine;
    private nextUpgrade: Building | null = null;

    constructor() {
        super();
        this.sugarLumpEgine = new SugarLumpEngine();
    }

    protected canExecute(): boolean {
        const buildingType: BuildingType | null = this.sugarLumpEgine.calculateOptimalBuilding();
        if (!buildingType) return false;

        this.nextUpgrade = game.Objects[buildingType];
        if (!this.nextUpgrade) return false;

        if (game.lumps <= this.nextUpgrade.level) return false;

        return true;
    }
    protected executeAction(): boolean {
        this.nextUpgrade?.levelUp();
        return true;
    }

    protected log(): void {
        LogEngine.addLog(LogType.SUGAR_LUMPS, `Upgraded building | ${this.nextUpgrade?.name} | lv${this.nextUpgrade?.level}`);
    }

    protected finalize(): void {
        this.nextUpgrade = null;
    }
}