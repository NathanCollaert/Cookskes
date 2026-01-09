import { game } from "../../../index";
import { Spell } from "../../types/Spell";
import { SpellCast } from "../SpellCast";

export class ForceTheHandOfFateSpell extends SpellCast {
    public spell: Spell;

    constructor() {
        super();
        this.spell = this.minigame.spells["hand of fate"];
    }

    canCast(): boolean {
        if (this.minigame.magic !== this.minigame.magicM) return false;

        // Simple Combo
        const multCpS = Object.values(game.buffs).filter(buff => buff.multCpS && buff.multCpS > 0).reduce((mult, buff) => mult * buff.multCpS, 1);
        const multClick = Object.values(game.buffs).filter(buff => buff.multClick && buff.multClick > 0).reduce((mult, buff) => mult * buff.multClick, 1);
        if (multCpS <= 1 && multClick <= 1) return false;

        return true;
    }

    castAction(): boolean {
        return this.minigame.castSpell(this.spell);
    }
}