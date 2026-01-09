import { game } from "../../index";
import { BuildingType } from "../types/BuildingType";

export class SugarLumpEngine {
    private objects = game.Objects;
    private readonly IMPORTANT_ORDER = [BuildingType.FARM, BuildingType.GRANDMA, BuildingType.YOU, BuildingType.JAVASCRIPT_CONSOLE, BuildingType.FRACTAL_ENGINE, BuildingType.CORTEX_BAKER, BuildingType.WIZARD_TOWER, BuildingType.TEMPLE];

    public calculateOptimalBuilding(): BuildingType | null {
        // 1) Spend one on Wizard Towers to unlock the Grimoire.
        if (this.objects[BuildingType.WIZARD_TOWER].level < 1) return BuildingType.WIZARD_TOWER;

        // 2) Spend another on Temples to unlock the Pantheon.
        if (this.objects[BuildingType.TEMPLE].level < 1) return BuildingType.TEMPLE;

        // 2b) If you are playing under Competitive rules and tryharding, it is best to use 2 lumps on level 2 Wizard Towers here
        // 3) Spend the third on Farms to unlock the Garden
        if (this.objects[BuildingType.FARM].level < 1) return BuildingType.FARM;

        // 4) Level up Banks once to unlock the Stock Market
        if (this.objects[BuildingType.BANK].level < 1) return BuildingType.BANK;

        // 5) Spend the next 44 lumps to get farms to level 9, unlocking the maximum size of the Garden
        if (this.objects[BuildingType.FARM].level < 9) return BuildingType.FARM;

        // 6) Spend a total of 78 lumps to level Cursors up to level 12, which will be able get you the maximum office level.
        // Note: save up the lumps you need to get the next loan before using lumps, loans unlock at Cursor levels 4, 10 and 12 requiring 10, 45 and 23 lumps from the last one
        if (this.objects[BuildingType.CURSOR].level < 12) {
            return this.canLevelUpCursors() ? BuildingType.CURSOR : null;
        }

        // 7) Stockpile 100 lumps to get the maximum bonus of Sugar Baking
        if (game.lumps < 100) return null;

        // 8a) Level farms up to 10 for the Sugar Crystal Cookies boost and the achievement (You can drop to 94).
        if (this.objects[BuildingType.FARM].level < 10) {
            return this.canLevelUpFarm() ? BuildingType.FARM : null;
        }

        // 8b) Then level up Cursors to 20 for the aura gloves boost (You can drop to 94 lumps when going to level 13, then to 95 on the rest).
        if (this.objects[BuildingType.CURSOR].level < 20) {
            return this.canLevelUpCursorsTwo() ? BuildingType.CURSOR : null;
        }

        // 9) Spend any lumps above 100 to level your buildings up to level 10 and no more (Can drop to 94 on the final level).
        // A suggested order would be Farms -> Grandmas -> You -> Javascript Consoles -> Fractal Engines -> Cortex bakers -> Wizard towers -> Temples... (the cps increase is negligible for the rest).
        const levellingOrder = [
            ...this.IMPORTANT_ORDER,
            ...Object.values(BuildingType).filter(b => !this.IMPORTANT_ORDER.includes(b))
        ];
        for (const building of levellingOrder) {
            const level = this.objects[building].level;
            if (level >= 10) continue;

            const minLump: number = level === 9 ? 94 : 100;
            const upgradePrice: number = this.getCostForLevel(level, level + 1);

            const canUpgrade: boolean = (game.lumps - upgradePrice) >= minLump;
            return canUpgrade ? building : null;
        }

        return null;
    }

    private canLevelUpCursors(): boolean {
        const currentLevel: number = this.objects[BuildingType.CURSOR].level;
        const levelGoal: number = [4, 10, 12].find(l => l > currentLevel) || 0;
        const minLumps: number = this.getCostForLevel(currentLevel, levelGoal);
        return game.lumps >= minLumps;
    }

    private getCostForLevel(start: number, goal: number): number {
        if (goal <= start) return 0;

        const sumUpTo = (n: number) => (n * (n + 1)) / 2;

        return sumUpTo(goal) - sumUpTo(start);
    }

    private canLevelUpFarm(): boolean {
        const minLumps: number = 94;
        const upgradePrice: number = this.getCostForLevel(this.objects[BuildingType.FARM].level, 10);
        return (game.lumps - upgradePrice) >= minLumps;
    }

    private canLevelUpCursorsTwo(): boolean {
        const currenLevel: number = this.objects[BuildingType.CURSOR].level;
        const minLumps: number = currenLevel < 13 ? 94 : 95;
        const upgradePrice: number = this.getCostForLevel(currenLevel, currenLevel + 1);
        return (game.lumps - upgradePrice) >= minLumps;
    }
}