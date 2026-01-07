import { LogType } from "./game/types/LogType";

const script = document.createElement("script");
let logs: { [key in LogType]?: { timeStamp: Date; message: string }[] } = {};
let flushTimeout: number | null = null;
let initialized = false;

script.src = chrome.runtime.getURL("index.js");

script.onload = () => {
    script.remove();
};

window.addEventListener("message", event => {
    if (event.source !== window) return;
    if (event.data?.source !== "cookiebot") return;

    const handleLog = () => {
        const { type, timeStamp, message } = event.data;

        logs[type as LogType] ??= [];
        logs[type as LogType]!.push({ timeStamp, message });

        if (flushTimeout) clearTimeout(flushTimeout);
        flushTimeout = window.setTimeout(flush, 10);
    };

    if (!initialized) {
        chrome.storage.local.get("logs", res => {
            const stored = (res.logs ?? {}) as Record<string, { timeStampISO: string; message: string }[]>;
            for (const key in stored) {
                logs[key as LogType] = stored[key].map((log: any) => ({
                    timeStamp: new Date(log.timeStampISO),
                    message: log.message
                }));
            }
            initialized = true;
            handleLog();
        });
    } else {
        handleLog();
    }
});

function flush() {
    const storageLogs: Record<string, { timeStampISO: string; message: string }[]> = {};

    for (const key in logs) {
        storageLogs[key] = logs[key as LogType]!.map(log => ({
            timeStampISO: log.timeStamp.toISOString(),
            message: log.message
        }));
    }

    chrome.storage.local.set({ logs: storageLogs });
    flushTimeout = null;
}

chrome.runtime.onMessage.addListener(msg => {
    if (msg?.target !== "cookiebot") return;

    window.postMessage({ source: "cookiebotpopup", command: msg.command }, "*");
});

(document.head || document.documentElement).appendChild(script);
