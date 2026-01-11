import { game } from "../../index";
import { calculateSpellCost } from "../../utils/Game";
import { BuildingType } from "../types/BuildingType";
import { Spell } from "../types/Spell";
import { SpellType } from "../types/SpellType";

interface TowerMinigame {
    spells: Record<string, Spell>;
    magic: number,
    magicM: number,
    castSpell(spell: any): boolean,
}

export abstract class SpellCast {
    protected readonly minigame?: TowerMinigame;
    protected readonly spell?: Spell;

    protected abstract canCastExtra(): boolean;

    constructor(spellType: SpellType) {
        const tower = game.Objects[BuildingType.WIZARD_TOWER];
        const minigame = tower?.minigame;
        const spell = minigame?.spells[spellType];

        this.minigame = minigame;
        this.spell = spell;
    }

    public cast(): boolean {
        if (!this.isCastable()) return false;
        return this.minigame!.castSpell(this.spell!);
    }

    private isCastable(): boolean {
        if (!this.minigame || !this.spell) return false;
        if (!this.hasEnoughMagic()) return false;
        return this.canCastExtra();
    }

    private hasEnoughMagic(): boolean {
        return this.minigame!.magic >= calculateSpellCost(this.minigame!, this.spell!);
    }
}