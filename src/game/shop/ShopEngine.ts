import Decimal from "../../../node_modules/decimal.js/decimal";
import { game } from "../../index";
import { formatNumber, formatTime, parseFormattedNumber } from "../../utils/Formatting";
import { Building } from "../types/Building";
import { Recommendation, RecommendationType } from "../types/Recommendation";

export class ShopEngine {
    public calculateOptimalBuy(): Recommendation[] {
        const out: Recommendation[] = [];

        for (const k in game.Objects) {
            const r = this.building(game.Objects[k]);
            if (r && r.dragonEfficient) out.push(r);
        }

        for (const u of game.UpgradesInStore) {
            if (u.canBuy() && u.pool !== "toggle") {
                out.push({
                    type: RecommendationType.upgrade,
                    name: u.name,
                    gameObj: u,
                    price: u.getPrice(),
                    cpsDiff: 0,
                    paybackTime: 0
                });
            }
        }

        return out.sort((a, b) => a.paybackTime - b.paybackTime);
    }

    private building(b: any): Recommendation | null {
        const price = new Decimal(b.price);
        const amt = new Decimal(b.amount || 0);
        const cps = this.getBuildingCps(b);
        const grandmaBonus = new Decimal(this.getGrandmaBonus(b));

        const current = amt.times(cps).plus(grandmaBonus);
        const amtPlusOne = amt.plus(1);
        const nextGrandmaBonus = amt.eq(0) ? new Decimal(0) : grandmaBonus.times(amtPlusOne).div(amt);
        const next = amtPlusOne.times(cps).plus(nextGrandmaBonus);
        const diff = next.minus(current);

        if (diff.lte(0)) return null;

        const timeForPayback = price.div(diff);

        return {
            type: RecommendationType.building,
            name: b.name,
            gameObj: b,
            price: price.toNumber(),
            cpsDiff: diff.toNumber(),
            paybackTime: timeForPayback.toNumber(),
            dragonEfficient: this.checkDragonEfficiency(b.name)
        };
    }

    // TODO: are we sure we want to do this even if dragon is not unlocked yet?
    private checkDragonEfficiency(buildingName: string): boolean {
        // determine if buying the building is efficient based on sacrifices to krumblor
        if (!game.Achievements['Here be dragon'].won)
            return true;  // don't limit when first fully training

        const building = game.Objects[buildingName];

        // haven't sacrificed first 100, buy no more than 100
        if (game.dragonLevel - 5 <= building.id)
            return building.amount < 100;

        // waiting to sacrifice 50 of all
        if (game.dragonLevel < game.dragonLevels.length - 2)
            return building.amount < 50;

        // waiting to sacrifice 200 of all
        if (game.dragonLevel < game.dragonLevels.length - 1)
            return building.amount < 200;

        return true;
    }

    private getBuildingCps(b: Building): Decimal {
        const tooltip = b.tooltip();
        const cpsMatch = tooltip && tooltip.match(/<b>([\d.,\s\w]+?)\s*(?:cookies|per second)<\/b>/);

        if (cpsMatch) {
            const parsed = parseFormattedNumber(cpsMatch[1]);
            if (parsed.eq(0)) {
                return new Decimal(b.storedCps * game.globalCpsMult);
            }
            return parsed;
        }

        return new Decimal(b.storedCps * game.globalCpsMult);
    }

    private getGrandmaBonus(b: Building): Decimal {
        const tooltip = b.tooltip();
        const grandmaMatch = tooltip && tooltip.match(/all combined, these boosts account for\s*<b>([\d.,\s\w]+?)\s*(?:cookies|per second)<\/b>/);

        if (grandmaMatch) {
            return parseFormattedNumber(grandmaMatch[1]);
        }

        return new Decimal(0);
    }

    private simulateUpgradePurchase(u: any): void {
        // TODO
        // mouse and cursors (The mouse and cursors are twice as efficient., The mouse and cursors gain +0.1 cookies for each non-cursor building owned., Multiplies the gain from Thousand fingers by 5., etc.)
        // Clicking (Clicking gains +1% of your CpS., etc.)
        // Building upgrades (Grandmas are twice as efficient., Farms are twice as efficient., etc.)
        // Golden Cookies (Golden cookies appear twice as often., Golden cookie effects last twice as long., etc.)
        // Cookie production (Cookie production multiplier +1%, Cookie production multiplier +5%, etc.)
        // Milk (You gain more CpS the more milk you have., etc.)
        // Reindeer (Reindeer appear twice as frequently., Reindeer are twice as slow., etc.)
        // Cheaper (All buildings are 1% cheaper., All upgrades are 1% cheaper., etc.)
        // Seasonal Misc
    }

    public showTopRecommendations(count: number): void {
        const recommendations = this.calculateOptimalBuy();

        if (recommendations.length === 0) {
            console.log("No recommendations available");
            return;
        }

        console.log(`=== Top ${count} Recommendations ===`);
        console.log(`Current CpS: ${formatNumber(game.cookiesPs)} | Bank: ${formatNumber(game.cookies)}`);
        console.log('---');

        for (let i = 0; i < Math.min(count, recommendations.length); i++) {
            const rec = recommendations[i];
            const affordable = game.cookies >= rec.price ? '✓' : '✗';
            console.log(`${i + 1}. [${affordable}] ${rec.type === RecommendationType.building ? '🏢' : '⬆️'} ${rec.name}`);
            console.log(`   Price: ${formatNumber(rec.price)} | +${formatNumber(rec.cpsDiff)} CpS | Payback: ${formatTime(rec.paybackTime)}`);
        }
    }
}
