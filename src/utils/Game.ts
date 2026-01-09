import { Season, seasonFromValue } from "../game/types/Season";
import { Spell } from "../game/types/Spell";
import { game } from "../index";
import { range } from "./Numbers";

export const VALENTINE_COOKIES: number[] = range(169, 174).concat(645);
export const HALLOWEEN_COOKIES: number[] = range(134, 140);
export const CHRISTMAS_COOKIES: number[] = range(143, 149);
export const EASTER_EGGS: number[] = range(210, 229);

export function unlockedAllUpgrades(upgradeIds: number[]): boolean {
    return upgradeIds.every(u => game.UpgradesById[u].unlocked === 1);
}

export function isSeasonActive(season: Season): boolean {
    return game.season === seasonFromValue(season)?.toLowerCase();
}

export function calculateSpellCost(minigame: any, spell: Spell): number {
    return spell.costMin + (minigame.magicM * spell.costPercent)
}

export function nextSantaLevelCost(): number {
    return Math.pow(game.santaLevel + 1, game.santaLevel + 1);
}