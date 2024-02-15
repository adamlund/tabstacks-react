async function GetChromeWindows(): Promise<ChromeWindow[]> {
  return new Promise(resolve => {
    chrome.windows.getAll({ populate: true }, windows => {
      resolve(windows as ChromeWindow[]);
    });
  });
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
  GetChromeWindows,
  removeTab,
  changeTab,
}
