
import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { formatNumber, formatTime } from "../../../utils/Formatting";
import { ShopEngine } from "../../shop/ShopEngine";
import { Building } from "../../types/Building";
import { LogType } from "../../types/LogType";
import { Recommendation, RecommendationType } from "../../types/Recommendation";
import { Upgrade } from "../../types/Upgrade";
import { Action } from "../Action";

// TODO: fix double buying bug when buying an upgrade (also multiple logs)
export class BuyRecommendationAction extends Action {
    public enabled: boolean = true;
    public interval: number = Config.buyInterval;
    public shouldExecuteImmediately: boolean = true;
    private recommendationEngine: ShopEngine;
    private topRecommendation: Recommendation | null = null;
    private lastGameState: number = 0;

    constructor() {
        super();
        this.recommendationEngine = new ShopEngine();
    }

    protected canExecute(): boolean {
        const currentGameState = this.getGameState();
        if ((this.topRecommendation === null || this.lastGameState !== currentGameState)) {
            const recommendations = this.recommendationEngine.calculate();
            this.topRecommendation = recommendations.length > 0 ? recommendations[0] : null;
        }

        return this.topRecommendation !== null && this.topRecommendation.price <= game.cookies;
    }

    protected executeAction(): boolean {
        if (this.topRecommendation?.type === RecommendationType.building) {
            (this.topRecommendation.gameObj as Building).buy(1);
        } else if (this.topRecommendation?.type === RecommendationType.upgrade) {
            (this.topRecommendation.gameObj as Upgrade).buy();
        }

        return true;
    }

    protected log(): void {
        if (this.topRecommendation === null) return;

        const logType: LogType = this.topRecommendation.type === RecommendationType.building ? LogType.BUILDINGS : LogType.UPGRADES;
        LogEngine.addLog(logType, `Bought ${this.topRecommendation.name} | ${formatNumber(this.topRecommendation.price)} | +${formatNumber(this.topRecommendation.cpsDiff)} | ${formatTime(this.topRecommendation.paybackTime)}`);
    }

    protected finalize(): void {
        this.topRecommendation = null;
    }

    private getGameState(): number {
        return game.UpgradesOwned + game.BuildingsOwned + game.UpgradesInStore.length
    }
}