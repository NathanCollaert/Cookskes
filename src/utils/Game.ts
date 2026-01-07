import { Season, seasonFromValue } from "../game/types/Season";
import { game } from "../index";
import { range } from "./Numbers";

export const VALENTINE_COOKIES: number[] = range(169, 174).concat(645);
export const HALLOWEEN_COOKIES: number[] = range(134, 140);
export const CHRISTMAS_COOKIES: number[] = range(143, 149);
export const EASTER_EGGS: number[] = range(210, 229);

export function unlockedAllUpgrades(upgradeIds: number[]): boolean {
    return upgradeIds.every(u => game.UpgradesById[u].unlocked);
}

export function isSeasonActive(season: Season): boolean {
    return game.season === seasonFromValue(season)?.toLowerCase();
}