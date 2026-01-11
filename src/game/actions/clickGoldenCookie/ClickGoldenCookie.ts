import { Config } from "../../../Config";
import { game } from "../../../index";
import { LogEngine } from "../../../logging/LogEngine";
import { ForceTheHandOfFateSpell } from "../../grimoire/forceTheHandOfFate/ForceTheHandOfFateSpell";
import { Buff } from "../../types/Buff";
import { LogType } from "../../types/LogType";
import { Action } from "../Action";
import { CastSpellAction } from "../castSpell/CastSpellAction";

export class ClickGoldenCookie extends Action {
    public enabled: boolean = true;
    public interval: number = Config.intervals.goldenCheckInterval;
    public shouldExecuteImmediately: boolean = true;

    private numberOfCookies: number = 0;
    private buffsBeforeClick: Buff[] = [];
    private lastAddedBuff: Buff | null = null;

    private logTimeoutId: number | null = null;
    private static readonly LOG_DELAY_MS = 4000;

    protected canExecute(): boolean {
        return true;
    }

    protected executeAction(): boolean {
        let clicked = false;

        for (const s of game.shimmers) {
            if (s.type === "golden") {
                this.buffsBeforeClick = Object.values(game.buffs);
                s.pop();

                clicked = true;
                this.numberOfCookies++;
                if (this.numberOfCookies === 1)
                    this.lastAddedBuff = this.getLastBuff();
            }
        }

        if (clicked && this.numberOfCookies === 1)
            if (new CastSpellAction(new ForceTheHandOfFateSpell()).execute()) {
                this.flushLog();
            }

        if (clicked) {
            this.scheduleLogFlush();
            return true;
        }

        return false;
    }

    private scheduleLogFlush(): void {
        if (this.logTimeoutId !== null) {
            clearTimeout(this.logTimeoutId);
        }

        this.logTimeoutId = window.setTimeout(() => {
            this.flushLog();
        }, ClickGoldenCookie.LOG_DELAY_MS);
    }

    private flushLog(): void {
        if (this.numberOfCookies === 0) return;

        const buffDetails = this.formatBuffDetails(this.lastAddedBuff);
        LogEngine.addLog(LogType.SHIMMERS, `Clicked golden cookie | ${buffDetails}`);

        this.reset();
    }

    private reset(): void {
        this.numberOfCookies = 0;
        this.lastAddedBuff = null;
        this.buffsBeforeClick = [];
        this.logTimeoutId = null;
    }

    private formatBuffDetails(buff: Buff | null): string {
        if (!buff && this.numberOfCookies === 1) return 'no buff';

        let label: string;

        if (!buff) {
            label = this.numberOfCookies > 1
                ? `Cookie Chain (${this.numberOfCookies})`
                : "no buff";
        } else {
            label = this.numberOfCookies > 1
                ? `${buff.name} (${this.numberOfCookies})`
                : buff.name;
        }

        const details: string[] = [label];

        if (buff?.multCpS) details.push(`x${buff.multCpS} CpS`);
        if (buff?.multClick) details.push(`x${buff.multClick} CpC`);
        if (buff?.maxTime) details.push(`${buff.maxTime}s`);

        return details.join(" | ");
    }

    private getLastBuff(): Buff | null {
        for (const buff of Object.values(game.buffs)) {
            if (!this.buffsBeforeClick.includes(buff)) {
                return buff;
            }
        }
        return null;
    }
}