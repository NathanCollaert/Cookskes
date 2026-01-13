import { BuildingType } from "../game/types/BuildingType";
import { God } from "../game/types/God";
import { MinigameType } from "../game/types/MinigameType";
import { PantheonSlot } from "../game/types/PantheonSlot";
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

export function isMinigameReady(minigame: MinigameType) {
    return game.isMinigameReady(game.Objects[minigame]);
}

export function isGodAlreadySlotted(god: God, slot: PantheonSlot): boolean {
    if (!isMinigameReady(MinigameType.PANTHEON)) return false;

    const minigame = game.Objects[BuildingType.TEMPLE].minigame;
    return minigame.slot[slot] === minigame.gods[god]?.id;
}

export function assignGod(god: God, slot: PantheonSlot): boolean {
    if (!isMinigameReady(MinigameType.PANTHEON)) return false;

    const minigame = game.Objects[BuildingType.TEMPLE].minigame;
    minigame.slotHovered = slot;
    minigame.dragging = minigame.gods[god];
    minigame.dropGod();
    return true;
}