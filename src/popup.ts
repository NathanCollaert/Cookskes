import { BotCommand } from "./game/types/BotCommand";
import { LogType } from "./game/types/LogType";

const tabs = document.getElementById("tabs")!;
const list = document.getElementById("logList")!;
const logHeader = document.getElementById("logHeader")!;

let logs: { [key in LogType]?: { timeStamp: Date, message: string }[] } = {};
let activeType: LogType = LogType.ALL;

init();

async function init() {
    const result = await chrome.storage.local.get("logs");
    parseLogs(result.logs ?? {});
    renderTabs();
    renderLogs();
}

function parseLogs(storedLogs: any) {
    for (const type in storedLogs) {
        logs[type as LogType] = storedLogs[type].map((log: any) => ({
            timeStamp: new Date(log.timeStampISO),
            message: log.message,
        }));
    }
}

function renderTabs() {
    tabs.innerHTML = "";

    Object.values(LogType).forEach(type => {
        if (!logs[type] && type !== LogType.ALL) return;

        const btn = document.createElement("button");
        btn.textContent = type.toString();
        btn.className = "tabMiniButton";
        if (type === activeType) btn.classList.add("active");

        btn.onclick = () => {
            activeType = type as LogType;
            renderLogs();
            btn.classList.add("active");
            Array.from(tabs.children).forEach(child => {
                if (child !== btn) child.classList.remove("active");
            });
        };

        tabs.appendChild(btn);
    });
}

function renderLogs() {
    list.innerHTML = "";
    logHeader.innerHTML = "";
    const entries = activeType === LogType.ALL ? Object.values(logs).flat() : logs[activeType] || [];

    const headerName = document.createElement('span');
    const headerItems = document.createElement('span');
    headerName.textContent = activeType;
    headerName.classList.add("tabContentListHeaderName");
    headerItems.textContent = `${entries.length.toString()} items`;
    headerItems.classList.add("tabContentListHeaderItems");
    logHeader.append(headerName);
    logHeader.append(headerItems);

    for (const msg of entries.sort((a, b) => b.timeStamp?.getTime() - a.timeStamp?.getTime())) {
        const li = document.createElement("li");
        li.textContent = `[${new Date(msg.timeStamp).toLocaleTimeString()}] ${msg.message}`;
        li.title = msg.message;
        list.appendChild(li);
    }
}

document.getElementById("startBtn")!.onclick = (event) => {
    sendCommand(BotCommand.START_BOT);
    const startButton = event.currentTarget as HTMLButtonElement;
    const stopButton = document.getElementById("stopBtn");
    startButton.classList.add('active');
    stopButton?.classList.remove('active');
};

document.getElementById("stopBtn")!.onclick = (event) => {
    sendCommand(BotCommand.STOP_BOT);
    const stopButton = event.currentTarget as HTMLButtonElement;
    const startButton = document.getElementById("startBtn");
    stopButton.classList.add('active');
    startButton?.classList.remove('active');
};

document.getElementById("popWrinklersBtn")!.onclick = () => {
    sendCommand(BotCommand.POP_WRINKLERS);
};

document.getElementById("openDragonBtn")!.onclick = () => {
    sendCommand(BotCommand.OPEN_DRAGON);
};

function sendCommand(command: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tabId = tabs[0]?.id;
        if (!tabId) {
            console.error("No active tab");
            return;
        }

        chrome.tabs.sendMessage(tabId, { target: "cookiebot", command });
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!changes.logs) return;

    parseLogs(changes.logs.newValue ?? {});
    renderLogs();
});