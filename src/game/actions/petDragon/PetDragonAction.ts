import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class PetDragonAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.petDragonInterval;
    public shouldExecuteImmediately: boolean = true;
    private drops = ['Dragon scale', 'Dragon claw', 'Dragon fang', 'Dragon teddy bear'];
    private ownedBefore: string[] = [];
    private gottenDrop: string | null = null;
    private clicksDone: number = 1;

    protected canExecute(): boolean {
        if (game.Has('Pet the dragon') === 0) return false;
        if (game.dragonLevel < 8) return false;

        this.ownedBefore = this.checkForDrops();
        if (this.ownedBefore.length >= this.drops.length) return false;

        return true;
    }

    protected executeAction(): boolean {
        let ownedAfter: string[] = [];

        game.specialTab = "dragon";
        while (this.clicksDone < 1000) {
            game.ClickSpecialPic();
            ownedAfter = this.checkForDrops();
            if (ownedAfter.length > this.ownedBefore.length) {
                const newDrops = ownedAfter.filter(drop => !this.ownedBefore.includes(drop));
                this.gottenDrop = newDrops[0];
                break;
            }
            this.clicksDone++;
        }

        return true;
    }

    private checkForDrops(): string[] {
        return this.drops.filter(drop => game.Upgrades[drop].unlocked === 1);
    }

    protected log(): void {
        LogEngine.addLog(LogType.DRAGON, `Petted the dragon | ${this.gottenDrop || 'No drop'} | ${this.clicksDone} clicks`);

    }

    protected finalize(): void {
        this.gottenDrop = null;
        this.ownedBefore = [];
        this.clicksDone = 0;
    }
}