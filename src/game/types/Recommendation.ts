import { Building } from "./Building";
import { Upgrade } from "./Upgrade";

export enum RecommendationType { "building", "upgrade" }

export interface Recommendation {
    type: RecommendationType;
    name: string;
    gameObj: Building | Upgrade;
    price: number;
    cpsDiff: number;
    paybackTime: number;
    dragonEfficient?: boolean;
}
