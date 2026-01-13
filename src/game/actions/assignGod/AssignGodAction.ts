import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { assignGod, isGodAlreadySlotted, isMinigameReady } from "../../../utils/Game";
import { PantheonEngine } from "../../pantheon/PantheonEngine";
import { BuildingType } from "../../types/BuildingType";
import { God, godFromValue } from "../../types/God";
import { LogType } from "../../types/LogType";
import { MinigameType } from "../../types/MinigameType";
import { PantheonSlot, pantheonSlotFromValue } from "../../types/PantheonSlot";
import { Action } from "../Action";

export class AssignGodAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.assignGodInterval;
    public shouldExecuteImmediately: boolean = true;
    private nextGod: { god: God, slot: PantheonSlot } | null = null;

    protected canExecute(): boolean {
        if (!isMinigameReady(MinigameType.PANTHEON)) return false;
        if (game.Objects[BuildingType.TEMPLE].minigame.swaps < 3) return false;

        this.nextGod = PantheonEngine.instance.calculateOptimalGod();
        if (!this.nextGod) return false;

        return true;
    }

    protected executeAction(): boolean {
        if (isGodAlreadySlotted(this.nextGod!.god, this.nextGod!.slot)) return false;
        return assignGod(this.nextGod!.god, this.nextGod!.slot);
    }

    protected log(): void {
        LogEngine.addLog(LogType.PANTHEON, `Assigned god | ${godFromValue(this.nextGod!.god)?.toLowerCase()} | ${pantheonSlotFromValue(this.nextGod!.slot)!.toLowerCase()}`);
    }

    protected finalize(): void {
        this.nextGod = null;
    }
}