import { game } from "../../../index";
import { Spell } from "../../types/Spell";
import { SpellCast } from "../SpellCast";

export class ForceTheHandOfFateSpell extends SpellCast {
    public towerMinigame: any;
    public spell: Spell;

    constructor() {
        super();
        const tower = game.Objects["Wizard tower"];
        this.towerMinigame = tower.minigame;
        this.spell = this.towerMinigame?.spells["hand of fate"];
    }

    canCast(): boolean {
        if (!this.spell) return false;

        // Simple Combo
        const multCpS = Object.values(game.buffs).filter(buff => buff.multCpS && buff.multCpS > 0).reduce((mult, buff) => mult * buff.multCpS, 1);
        const multClick = Object.values(game.buffs).filter(buff => buff.multClick && buff.multClick > 0).reduce((mult, buff) => mult * buff.multClick, 1);
        if (this.towerMinigame.magic !== this.towerMinigame.magicM) return false;
        if (multCpS <= 1 && multClick <= 1) return false;

        return true;
    }

    castAction(): boolean {
        return this.towerMinigame.castSpell(this.spell);
    }
}