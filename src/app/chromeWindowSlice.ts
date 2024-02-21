import { createSlice } from '@reduxjs/toolkit';

export interface ChromeWindowsStore {
  filterText: string;
  rawWindows: chrome.windows.Window[];
  listItems: TabListItem[];
  filteredListItems: TabListItem[];
  windowCount: number;
  tabCount: number;
  currentTab: chrome.tabs.Tab | null;
};

function sortWindowsDesc(chromeWindows: chrome.windows.Window[], current: chrome.windows.Window | undefined) {
  return chromeWindows.sort((a: chrome.windows.Window, b: chrome.windows.Window) => {
    if (current && current?.id) {
      if (a.id === current.id) return -1;
      if (b.id === current.id) return 1;
    }
    return (b?.id && a?.id) ? b.id - a.id : 0;
  });
}

const processTabListItems = (
  chromeWindows: chrome.windows.Window[],
  currentWindow: chrome.windows.Window,
): { listItems: TabListItem[], windowCount: number, tabCount: number } => {
  const listItems: TabListItem[] = [];
  let tabCount = 0;
  let windowCount = 0;
  console.log('process currentWindow', currentWindow);
  sortWindowsDesc(chromeWindows, currentWindow);

  chromeWindows.forEach((window: chrome.windows.Window) => {
    if (window.tabs && window.tabs.length > 0) {
      listItems.push({ type: 'window', data: window });
      windowCount += 1;
      window.tabs.forEach((tab: chrome.tabs.Tab) => {
        listItems.push({ type: 'tab', data: tab });
        tabCount += 1;
      });
    }
  });
  return { listItems, windowCount, tabCount };
};

export const chromeWindowSlice = createSlice({
  name: 'chromeWindows',
  initialState: {
    filterText: '',
    rawWindows: [],
    listItems: [],
    filteredListItems: [],
    windowCount: 0,
    tabCount: 0,
    currentTab: null,
  } as ChromeWindowsStore,
  reducers: {
    setWindows: (state, action) => {
      const {
        listItems,
        windowCount,
        tabCount,
      } = processTabListItems(action.payload.chromeWindows, action.payload.currentWindow);

      state.rawWindows = action.payload;
      state.listItems = [...listItems];
      state.filteredListItems = [...listItems];
      state.tabCount = tabCount;
      state.windowCount = windowCount;
    },
    setFilteredItems: (state, action) => {
      if (action?.payload && Array.isArray(action.payload)) {
        state.filteredListItems = [...action.payload];
      }
    },
  },
});

export const { setWindows, setFilteredItems } = chromeWindowSlice.actions;
export const selectTabCount = (state: TabStacksState) => state.chromeWindows.tabCount;
export const selectWindowCount = (state: TabStacksState) => state.chromeWindows.windowCount;
export const selectListItems = (state: TabStacksState) => state.chromeWindows.listItems;
export const selectFilteredListItems = (state: TabStacksState) => state.chromeWindows.filteredListItems;
export const selectRawWindows = (state: TabStacksState) => state.chromeWindows.rawWindows;

export default chromeWindowSlice.reducer;
