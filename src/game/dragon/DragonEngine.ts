import { game } from "../../index";
import { BuyDragonAuraAction } from "../actions/buyDragonAura/BuyDragonAuraAction";
import { DragonAura, DragonAuraRequiredLevel } from "../types/DragonAura";

export class DragonEngine {
    static #instance: DragonEngine;
    private manualAura: DragonAura | null = null;

    public static get instance(): DragonEngine {
        if (!DragonEngine.#instance) {
            DragonEngine.#instance = new DragonEngine();
        }

        return DragonEngine.#instance;
    }

    public calculateOptimalAuras(): DragonAura[] {
        if (this.manualAura) return [this.manualAura];

        if (game.dragonLevel >= game.dragonLevels.length - 1) {
            return [DragonAura["Breath of Milk"], DragonAura["Radiant Appetite"]];
        } else if (game.dragonLevel >= 19) {
            return [DragonAura["Radiant Appetite"]];
        } else if (game.dragonLevel >= 5) {
            return [DragonAura["Breath of Milk"]];
        }

        return [];
    }

    public setManualAura(aura: DragonAura): boolean {
        if (this.manualAura) return false;
        if (game.dragonLevel < DragonAuraRequiredLevel[aura]) return false;
        this.manualAura = aura;
        return new BuyDragonAuraAction().execute();
    }

    public clearManualAura(): void {
        this.manualAura = null;
        new BuyDragonAuraAction().execute();
    }
}