import { Spell } from "../types/Spell";

export abstract class SpellCast {
    abstract spell: Spell;
    abstract canCast(): boolean;
    protected abstract castAction(): boolean;

    cast(): boolean {
        if (!this.canCast()) return false;
        return this.castAction();
    }
}