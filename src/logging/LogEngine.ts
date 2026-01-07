import { LogType } from "../game/types/LogType";

export class LogEngine {
    static addLog(type: LogType, message: string): void {
        window.postMessage({ source: "cookiebot", type, timeStamp: new Date(), message }, "*");
    }
}