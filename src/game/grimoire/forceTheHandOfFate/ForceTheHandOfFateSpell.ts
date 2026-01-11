import { game } from "../../../index";
import { SpellType } from "../../types/SpellType";
import { SpellCast } from "../SpellCast";

export class ForceTheHandOfFateSpell extends SpellCast {
    constructor() {
        super(SpellType.HAND_OF_FATE);
    }

    protected canCastExtra(): boolean {
        const { magic, magicM } = this.minigame!;

        if (magic !== magicM) return false;

        const buffs = Object.values(game.buffs);

        let multCpS = 1;
        let multClick = 1;

        for (const buff of buffs) {
            if (buff.multCpS > 0) multCpS *= buff.multCpS;
            if (buff.multClick > 0) multClick *= buff.multClick;
        }

        return multCpS > 1 || multClick > 1;
    }
}