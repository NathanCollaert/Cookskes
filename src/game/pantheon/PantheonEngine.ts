import { game } from "../../index";
import { isGodAlreadySlotted } from "../../utils/Game";
import { AssignGodAction } from "../actions/assignGod/AssignGodAction";
import { God } from "../types/God";
import { PantheonSlot } from "../types/PantheonSlot";

const PRESTIGE_FLOOR = 365;
const PRE_PRESTIGE_ASSIGNMENT = (baseSeason: string): Array<{ god: God; slot: PantheonSlot }> => [
    { god: God.GODZAMOK, slot: PantheonSlot.DIAMOND },
    { god: God.MURIDAL, slot: PantheonSlot.RUBY },
    { god: baseSeason !== "" ? God.SELEBRAK : God.DOTJEIESS, slot: PantheonSlot.JADE }
];
const SIMPLE_CLICK_COMBO_ASSIGNMENT = [
    { god: God.GODZAMOK, slot: PantheonSlot.DIAMOND },
    { god: God.MOKALSIUM, slot: PantheonSlot.RUBY },
    { god: God.MURIDAL, slot: PantheonSlot.JADE }
];

export class PantheonEngine {
    static #instance: PantheonEngine;
    private manualGod: { god: God, slot: PantheonSlot } | null = null;

    private constructor() { }

    public static get instance(): PantheonEngine {
        if (!PantheonEngine.#instance) {
            PantheonEngine.#instance = new PantheonEngine();
        }

        return PantheonEngine.#instance;
    }

    public calculateOptimalGod(): { god: God, slot: PantheonSlot } | null {
        if (this.manualGod) return this.manualGod;

        if (game.prestige < PRESTIGE_FLOOR) {
            // pre 365 prestige Godzamok - Muridal - Dotjeiess
            // Slot Selebrak instead of Dotjeiess if a natural season is active
            return this.selectFirstUnslottedGod(PRE_PRESTIGE_ASSIGNMENT(game.baseSeason));
        } else {
            // post 365: Simple click combo: Godzamok - Mokalsium - Muridal
            return this.selectFirstUnslottedGod(SIMPLE_CLICK_COMBO_ASSIGNMENT);

            // Late game big combo (w holobore swap): Vomitrax - Selebrak - Muridal
            // Swap Godzamok to diamond after getting the desired natural buffs
            // Swap Holobore to ruby after getting every desired golden cookie buff (aka after clicking all the golden cookies you want to click)
            // Swap Mokalsium to diamond after using Godzamok

            // Garden combo w Holobore swap: Mokalsium - Vomitrax - Jeremy
            // Swap Holobore to ruby after clicking every golden cookie you need
            // If worship swaps are scarce you can also just initially not slot anything in ruby
        }
    }

    public setManualGod(god: God, slot: PantheonSlot): boolean {
        if (this.manualGod) return false;
        this.manualGod = { god, slot };
        return new AssignGodAction().execute();
    }

    public clearManualGod(): void {
        this.manualGod = null;
        new AssignGodAction().execute();
    }

    private selectFirstUnslottedGod(assignments: Array<{ god: God; slot: PantheonSlot }>): { god: God, slot: PantheonSlot } | null {
        for (let i = 0; i < assignments.length; i++) {
            if (isGodAlreadySlotted(assignments[i].god, assignments[i].slot)) continue;
            return assignments[i];
        }
        return null;
    }
}