import { BotCommand } from "./game/types/BotCommand";
import { LogType } from "./game/types/LogType";

const ROW_HEIGHT = 20;

const tabs = document.getElementById("tabs")!;
const scrollContainer = document.getElementById("logScrollContainer")!;
const list = document.getElementById("logList")!;
const logHeader = document.getElementById("logHeader")!;

let logs: { [key in LogType]?: { timeStamp: Date, message: string }[] } = {};
let activeType: LogType = LogType.ALL;
let sortedEntries: { timeStamp: Date; message: string }[] = [];

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
    logHeader.innerHTML = "";

    const entries = activeType === LogType.ALL ? Object.values(logs).flat() : logs[activeType] || [];

    sortedEntries = entries.slice().sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime());

    const headerName = document.createElement('span');
    const headerItems = document.createElement('span');
    headerName.textContent = activeType;
    headerName.classList.add("tabContentListHeaderName");
    headerItems.textContent = `${entries.length.toString()} items`;
    headerItems.classList.add("tabContentListHeaderItems");
    logHeader.append(headerName, headerItems);

    setupVirtualScroll();
    renderVirtualRows();
}

function onScroll() {
    requestAnimationFrame(renderVirtualRows);
}

let minRendered = Infinity;
let maxRendered = -1;
function renderVirtualRows() {
    const scrollTop = scrollContainer.scrollTop;
    const viewportHeight = scrollContainer.clientHeight;

    const firstVisible = Math.floor(scrollTop / ROW_HEIGHT);
    const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    const newStart = Math.max(0, firstVisible);
    const newEnd = Math.min(
        sortedEntries.length,
        firstVisible + visibleCount
    );

    const startIndex = Math.min(minRendered, newStart);
    const endIndex = Math.max(maxRendered, newEnd);

    if (startIndex === minRendered && endIndex === maxRendered) return;

    minRendered = startIndex;
    maxRendered = endIndex;

    for (let i = startIndex; i < endIndex; i++) {
        if (list.children[i - startIndex]) continue;

        const msg = sortedEntries[i];
        const li = document.createElement("li");
        li.textContent = `[${msg.timeStamp.toLocaleTimeString()}] ${msg.message}`;
        li.title = msg.message;
        list.appendChild(li);
    }
}

function setupVirtualScroll() {
    scrollContainer.removeEventListener("scroll", onScroll);
    scrollContainer.addEventListener("scroll", onScroll);

    minRendered = Infinity;
    maxRendered = -1;
    list.innerHTML = "";
    list.style.transform = "";
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

document.getElementById("clearLogsBtn")!.onclick = () => {
    sendCommand(BotCommand.CLEAR_LOGS);
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
    renderTabs();
    renderLogs();
});