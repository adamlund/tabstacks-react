import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PullHistory } from '../chrome_commands';
import { searchForText } from '../lib/search';

export interface ChromeWindowsStore {
  filterText: string;
  rawWindows: chrome.windows.Window[];
  listItems: TabListItem[];
  filteredListItems: TabListItem[];
  windowCount: number;
  tabCount: number;
  currentTab: chrome.tabs.Tab | null;
  allHistoryItems: chrome.history.HistoryItem[];
  filteredHistoryItems: chrome.history.HistoryItem[];
  searchMode: 'tabs' | 'history';
  historyLoaded: boolean;
};

function sortWindowsDesc(
  chromeWindows: chrome.windows.Window[],
  current: chrome.windows.Window | undefined,
) {
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

export const fetchHistory = createAsyncThunk<chrome.history.HistoryItem[], void, {}>(
  'history/queryAll',
  async (_, thunkAPI) => {
    const historyItems = await PullHistory();
    return historyItems;
  },
);

const cwInitialState: ChromeWindowsStore = {
  filterText: '',
  rawWindows: [],
  listItems: [],
  filteredListItems: [],
  windowCount: 0,
  tabCount: 0,
  currentTab: null,
  allHistoryItems: [],
  filteredHistoryItems: [],
  searchMode: 'tabs',
  historyLoaded: false,
};

export const chromeWindowSlice = createSlice({
  name: 'chromeWindows',
  initialState: cwInitialState,
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
      if (state.filterText !== '' && state.filterText.length > 0) {
        const matchTabs = searchForText(state.filterText, state.listItems, [
          'data.url',
          'data.title',
        ]);
        const filteredItems = matchTabs.filter((mt: TabListItem) => mt.type === 'tab');
        state.filteredListItems = [...filteredItems];
      }
    },
    setFilterText: (state, action) => {
      state.filterText = action.payload || '';
      const matchTabs = searchForText(state.filterText, state.listItems, [
        'data.url',
        'data.title',
      ]);
      const filteredItems = matchTabs.filter((mt: TabListItem) => mt.type === 'tab');
      state.filteredListItems = [...filteredItems];
      if (state.historyLoaded) {
        const matchHistory = searchForText(state.filterText, state.allHistoryItems, [
          'url',
          'title',
        ]);
        state.filteredHistoryItems = [...matchHistory];
      }
    },
    setFilteredItems: (state, action) => {
      if (action?.payload && Array.isArray(action.payload)) {
        state.filteredListItems = [...action.payload];
      }
    },
    setSearchMode: (state, action) => {
      state.searchMode = action.payload || 'tabs';
      if (state.searchMode === 'history'
        && state.historyLoaded
        && state.filterText !== '') {
          const matchHistory = searchForText(state.filterText, state.allHistoryItems, [
            'url',
            'title',
          ]);
        state.filteredHistoryItems = [...matchHistory];
      }
    },
    toggleSearchMode: (state) => {
      state.searchMode = (state.searchMode === 'tabs') ? 'history' : 'tabs';
      if (state.searchMode === 'history'
        && state.historyLoaded
        && state.filterText !== '') {
          const matchHistory = searchForText(state.filterText, state.allHistoryItems, [
            'url',
            'title',
          ]);
        state.filteredHistoryItems = [...matchHistory];
      }
    },
    setHistoryItems: (state, action) => {
      state.allHistoryItems = [...action.payload] || [];
    },
    setFilteredHistoryItems: (state, action) => {
      state.filteredHistoryItems = [...action.payload] || [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.allHistoryItems = [...action.payload];
      state.historyLoaded = true;
      if (state.filterText !== '') {
        const matchHistory = searchForText(state.filterText, state.allHistoryItems, [
          'url',
          'title',
        ]);
        state.filteredHistoryItems = [...matchHistory];
      }
    });
  },
});

export const {
  setFilterText,
  setWindows,
  setFilteredItems,
  setSearchMode,
  setHistoryItems,
  setFilteredHistoryItems,
  toggleSearchMode,
} = chromeWindowSlice.actions;
export const selectSearchMode = (state: TabStacksState) => state.chromeWindows.searchMode;
export const selectTabCount = (state: TabStacksState) => state.chromeWindows.tabCount;
export const selectWindowCount = (state: TabStacksState) => state.chromeWindows.windowCount;
export const selectListItems = (state: TabStacksState) => state.chromeWindows.listItems;
export const selectFilteredListItems = (state: TabStacksState): TabListItem[] => state.chromeWindows.filteredListItems;
export const selectRawWindows = (state: TabStacksState) => state.chromeWindows.rawWindows;
export const selectHistoryItems = (state: TabStacksState) => state.chromeWindows.allHistoryItems;
export const selectFilteredHistoryItems = (state: TabStacksState) => state.chromeWindows.filteredHistoryItems;
export const selectFilterText = (state: TabStacksState) => state.chromeWindows.filterText;
export const selectHistoryLoaded = (state: TabStacksState) => state.chromeWindows.historyLoaded;

export default chromeWindowSlice.reducer;
