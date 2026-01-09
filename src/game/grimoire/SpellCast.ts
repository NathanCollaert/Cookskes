import { game } from "../../index";
import { calculateSpellCost } from "../../utils/Game";
import { BuildingType } from "../types/BuildingType";
import { Spell } from "../types/Spell";

export abstract class SpellCast {
    public wizardTower: any;
    public minigame: any;
    public abstract spell: Spell;
    public abstract canCast(): boolean;
    protected abstract castAction(): boolean;

    constructor() {
        this.wizardTower = game.Objects[BuildingType.WIZARD_TOWER];
        this.minigame = this.wizardTower.minigame;
    }

    cast(): boolean {
        if (!this.hasEnoughMagicToCast()) return false;
        if (!this.canCast()) return false;
        return this.castAction();
    }

    private hasEnoughMagicToCast(): boolean {
        return this.minigame.magic > calculateSpellCost(this.minigame, this.spell);
    }
}