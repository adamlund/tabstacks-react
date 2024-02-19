interface TablistProps {
  windows: any[];
}

interface TabProps {
  name: string;
  id: number;
}

interface TabListItem {
  type: string;
  data: ChromeWindow | ChromeTab;
}

interface ChromeWindow {
  id: number;
  alwaysOnTop: boolean;
  focused: boolean;
  incognito: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  state: string;
  type: string;
  tabs: ChromeTab[];
}

interface ChromeTab {
  id: number;
  windowId: number;
  active: boolean;
  audible: boolean;
  autoDiscardable: boolean;
  discarded: boolean;
  groupId: number;
  width: number;
  height: number;
  highlighted: boolean;
  incognito: boolean;
  index: number;
  mutedInfo: any,
  pinned: boolean;
  selected: boolean;
  status: string;
  favIconUrl: string;
  title: string;
  url: string;
}

interface TabStacksState {
  chromeWindows: ChromeWindowsStore;
}