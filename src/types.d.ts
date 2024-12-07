interface TablistProps {
  windows: any[];
}

interface TabProps {
  name: string;
  id: number;
}

interface TabListItem {
  type: string;
  data: chrome.windows.Window | chrome.tabs.Tab;
}

interface TabStacksState {
  chromeWindows: ChromeWindowsStore;
}

interface TabStacksSyncSettings {
  historySearchDays?: number;
  historySearchLimit?: number;
  showURLOnTabs?: boolean;
  searchToggleKey?: string;
  disposeOnTabChange?: string;
}
