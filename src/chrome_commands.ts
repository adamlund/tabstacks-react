import {
  DEFAULT_SEARCH_DURATION,
  DEFAULT_HISTORY_LIMIT,
} from "./constants";

const MSPERDAY = 86400000; //milliseconds per day

function searchWithinMSec(durationDats: number) {
  return Date.now() - durationDats * MSPERDAY;
}

async function GetChromeWindows(): Promise<chrome.windows.Window[]> {
  return new Promise(resolve => {
    chrome.windows.getAll({ populate: true }, windows => {
      resolve(windows as chrome.windows.Window[]);
    });
  });
}

async function GetTabs(queryInfo: chrome.tabs.QueryInfo = {}): Promise<chrome.tabs.Tab[]> {
  const tabs = await chrome.tabs.query(queryInfo);
  return tabs;
}

async function GetCurrentWindow(): Promise<chrome.windows.Window | undefined> {
  const w = await chrome.windows.getCurrent();
  return w;
}

function changeTab(tabId: number) {
  chrome.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
    const { id, windowId } = tab;
    if (id) {
      chrome.tabs.update(
        id,
        { active: true, highlighted: true },
        (t) => {
          if (t) {
            chrome.windows.update(
              windowId,
              { focused: true },
              () => {}
            );
          }
        }
      );
    }
  });
}

async function removeTab(tabId: number): Promise<void> {
  await chrome.tabs.remove(tabId);
}

async function setTabAudio(tabId: number, doMute: boolean): Promise<void> {
  await chrome.tabs.update(tabId, {
    muted: doMute,
  });
}

function PullHistory(
  needle: string = '',
  durationDays: number = DEFAULT_SEARCH_DURATION,
): Promise<chrome.history.HistoryItem[]> {
  const queryObj = {
    text: needle,
    startTime: searchWithinMSec(durationDays),
    maxResults: DEFAULT_HISTORY_LIMIT,
  };
  return chrome.history.search(queryObj);
}

export {
  GetTabs,
  GetCurrentWindow,
  GetChromeWindows,
  PullHistory,
  setTabAudio,
  removeTab,
  changeTab,
}
