import { Action } from "./game/actions/Action";
import { AssignGodAction } from "./game/actions/assignGod/AssignGodAction";
import { BuyDragonAuraAction } from "./game/actions/buyDragonAura/BuyDragonAuraAction";
import { BuyRecommendationAction } from "./game/actions/buyRecommendation/BuyRecommendationAction";
import { ClickCookieAction } from "./game/actions/clickCookie/ClickCookieAction";
import { ClickFortuneCookieAction } from "./game/actions/clickFortune/ClickFortuneCookieAction";
import { ClickGoldenCookie } from "./game/actions/clickGoldenCookie/ClickGoldenCookie";
import { ClickReindeerAction } from "./game/actions/clickReindeer/ClickReindeerAction";
import { HarvestSugarLumpAction } from "./game/actions/harvestSugarLump/HarvestSugarLumpAction";
import { PetDragonAction } from "./game/actions/petDragon/PetDragonAction";
import { popWrinklersAction } from "./game/actions/popWrinklers/PopWrinklersAction";
import { SpendSugarLumpAction } from "./game/actions/spendSugarLump/SpendSugarLumpAction";
import { SwitchSeasonAction } from "./game/actions/switchSeason/SwitchSeasonAction";
import { ToggleElderPledgeAction } from "./game/actions/toggleElderPledge/ToggleElderPledgeAction";
import { UpgradeClausAction } from "./game/actions/upgradeClaus/UpgradeClausAction";
import { UpgradeDragonAction } from "./game/actions/upgradeDragon/UpgradeDragonAction";
import { BotCommand } from "./game/types/BotCommand";
import { Game } from "./game/types/Game";

export const game: Game = (window as any).Game;
let running = false;
let timers: number[] = [];

window.addEventListener("message", e => {
    if (e.source !== window) return;
    if (e.data?.source !== "cookiebotpopup") return;

    switch (e.data.command) {
        case BotCommand.START_BOT:
            start();
            break;
        case BotCommand.STOP_BOT:
            stop();
            break;
        // case BotCommand.CLEAR_LOGS:
        //     clearLogs();
        //     break;
    }
});

function start(): void {
    if (running) return;

    initilizeActions();

    running = true;
}

function applyInterval(fn: () => void, interval: number, shouldExecuteImmediately: boolean): void {
    if (shouldExecuteImmediately) fn();
    timers.push(setInterval(fn, interval));
}

function initilizeActions(): void {
    [new ClickCookieAction(), new ClickGoldenCookie(), new ClickReindeerAction(), new BuyRecommendationAction(), new ClickFortuneCookieAction(), new PetDragonAction(), new UpgradeDragonAction(), new SwitchSeasonAction(), new UpgradeClausAction(), new HarvestSugarLumpAction(), new BuyDragonAuraAction(), new popWrinklersAction(), new SpendSugarLumpAction(), new ToggleElderPledgeAction(), new AssignGodAction()]
        .forEach((action: Action) => {
            if (action.enabled && action.interval > 0) {
                applyInterval(action.execute.bind(action), action.interval, action.shouldExecuteImmediately);
            }
        });
}

function stop(): void {
    timers.forEach(clearInterval);
    timers = [];
    running = false;
}