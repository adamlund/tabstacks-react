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

function removeTab(tabId: number) {
  chrome.tabs.remove(tabId);
}

export {
  GetTabs,
  GetCurrentWindow,
  GetChromeWindows,
  removeTab,
  changeTab,
}
