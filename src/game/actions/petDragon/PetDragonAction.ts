import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class PetDragonAction extends Action {
    public enabled: boolean = true;
    public interval: number = 900000; // 15 minutes
    public shouldExecuteImmediately: boolean = true;
    private drops = ['Dragon scale', 'Dragon claw', 'Dragon fang', 'Dragon teddy bear'];
    private ownedBefore: string[] = [];
    private gottenDrop: string | null = null;

    protected canExecute(): boolean {
        if (!game.Has('Pet the dragon') && game.dragonLevel < 8) return false;

        this.ownedBefore = this.checkForDrops();
        return this.ownedBefore.length < this.drops.length;
    }

    protected executeAction(): boolean {
        let i: number = 0;
        let ownedAfter: string[] = [];

        // Open dragon UI
        game.specialTab = "dragon";
        while (i < 1000 && !this.gottenDrop) {
            // Pet the dragon
            game.ClickSpecialPic();
            // Check for new drops
            ownedAfter = this.checkForDrops();
            if (ownedAfter.length > this.ownedBefore.length) {
                const newDrops = ownedAfter.filter(drop => !this.ownedBefore.includes(drop));
                this.gottenDrop = newDrops[0];
            }
            i++;
        }

        return true;
    }

    private checkForDrops(): string[] {
        return this.drops.filter(drop => game.Has(drop));
    }

    protected log(): void {
        LogEngine.addLog(LogType.DRAGON, `Petted the dragon | Gotten drop - ${this.gottenDrop || 'None'}`);

    }

    protected finalize(): void {
        this.gottenDrop = null;
        this.ownedBefore = [];
    }
}