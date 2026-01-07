import { game } from "../../index";
import { CHRISTMAS_COOKIES, EASTER_EGGS, unlockedAllUpgrades, VALENTINE_COOKIES } from "../../utils/Game";
import { Season } from "../types/Season";

export class SeasonEngine {
    public calculateOptimalSeason(): Season {
        // TODO: do not care about christmas cookies unless making slow progress
        if (!game.Upgrades["A festive hat"].bought && !unlockedAllUpgrades(CHRISTMAS_COOKIES)) {
            return Season.CHRISTMAS;
        }

        if (!unlockedAllUpgrades(VALENTINE_COOKIES)) {
            return Season.VALENTINES;
        }

        // TODO: depending on cookie storm switch from easter to halloween and back
        // TODO 2 (optional): Dragon orbs strategy
        if (!unlockedAllUpgrades(EASTER_EGGS)) {
            return Season.EASTER;
        }

        return Season.HALLOWEEN;
        //
    }
}