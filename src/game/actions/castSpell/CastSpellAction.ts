import { LogEngine } from "../../../logging/LogEngine";
import { SpellCast } from "../../grimoire/SpellCast";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";

export class CastSpellAction extends Action {
    public enabled: boolean = true;
    public interval: number = 0;
    public shouldExecuteImmediately: boolean = false;
    private spellCast: SpellCast;

    constructor(spellCast: SpellCast) {
        super();
        this.spellCast = spellCast;
    }

    protected canExecute(): boolean {
        return this.spellCast.canCast();
    }

    protected executeAction(): boolean {
        return this.spellCast.cast();
    }

    protected log(): void {
        LogEngine.addLog(LogType.GRIMOIRE, `Cast spell: ${this.spellCast.spell.name}`);
    }
}