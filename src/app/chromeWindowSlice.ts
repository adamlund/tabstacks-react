import { createSlice } from '@reduxjs/toolkit';
import { searchForText } from '../lib/search';

export interface ChromeWindowsStore {
  filterText: string;
  rawWindows: ChromeWindow[];
  listItems: TabListItem[];
  filteredListItems: TabListItem[];
  windowCount: number;
  tabCount: number;
};

const processTabListItems = (chromeWindows: ChromeWindow[]): { listItems: TabListItem[], windowCount: number, tabCount: number } => {
  const listItems: TabListItem[] = [];
  let tabCount = 0;
  let windowCount = 0;
  chromeWindows.forEach((window: ChromeWindow) => {
    listItems.push({ type: 'window', data: window });
    windowCount += 1;
    window.tabs.forEach((tab: ChromeTab) => {
      listItems.push({ type: 'tab', data: tab });
      tabCount += 1;
    });
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
  } as ChromeWindowsStore,
  reducers: {
    setWindows: (state, action) => {
      const {
        listItems,
        windowCount,
        tabCount,
      } = processTabListItems(action.payload);

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

export default chromeWindowSlice.reducer;
