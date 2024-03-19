import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tablist from './Tablist';
import TabFilter from './TabFilter';
import Stats from './Stats';
import Note from './Note';
import HistoryList from './HistoryList';
import { _get } from './lib/search';
import { AppDispatch } from './app/store';
import { GetChromeWindows, GetCurrentWindow } from './chrome_commands';
import { ArrowCommand, DeleteTab } from './dom_commands';
import {
  setWindows,
  toggleSearchMode,
  selectSearchMode,
  selectHistoryLoaded,
  fetchHistory,
  fetchChromeSync,
  selectPreferences,
  selectPreferencesLoaded,
} from './app/chromeWindowSlice';
import { DEFAULT_SEARCH_TOGGLE_KEY } from './constants';

function TabStacks() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector(selectSearchMode);
  const isHistoryLoaded = useSelector(selectHistoryLoaded);
  const prefs = useSelector(selectPreferences);
  const searchToggleKey = prefs.searchToggleKey;
  const prefsLoaded = useSelector(selectPreferencesLoaded);

  async function refreshWindowsAsync() {
    const windows = await GetChromeWindows();
    const currentWindow = await GetCurrentWindow();

    if (windows && Array.isArray(windows) && windows.length > 0) {
      dispatch(setWindows({chromeWindows: windows, currentWindow}));
    }
  };

  chrome.tabs.onCreated.addListener(
    async () => {
      await refreshWindowsAsync();
    },
  );

  chrome.tabs.onRemoved.addListener(
    async () => {
      await refreshWindowsAsync();
    },
  );

  chrome.tabs.onUpdated.addListener(
    async () => {
      await refreshWindowsAsync();
    },
  );

  // Keyboard interaction
  const keyNavTabElement = (event: KeyboardEvent, toggleKey = DEFAULT_SEARCH_TOGGLE_KEY) => {
    const { key } = event;
    const currentFocusedElement = document.activeElement;

    if (key && (key === 'ArrowUp' || key === 'ArrowDown')) {
      event.preventDefault();
      event.stopPropagation();
      ArrowCommand(key);
    } else if (currentFocusedElement?.id.startsWith('tab-') &&
      key === 'Backspace' || key === 'Delete') {
        const tabId = currentFocusedElement?.id?.split('-')[1];
        if (tabId) {
          event.preventDefault();
          event.stopPropagation();
          DeleteTab(tabId);
        }
    } else if (
      event.ctrlKey &&
      event.shiftKey &&
      (key === toggleKey.toUpperCase() || key === toggleKey)) {
      event.preventDefault();
      event.stopPropagation();
      dispatch(toggleSearchMode());
    }
  }

  useEffect(() => {
    dispatch(fetchChromeSync());
    const getTabs = async () => {
      await refreshWindowsAsync();
    };
    getTabs();
  }, []);

  useEffect(() => {
    if (prefsLoaded) {
      const handleKey = (event: KeyboardEvent) => {
        if (typeof event?.key === 'string') {
          keyNavTabElement(event, searchToggleKey);
        }
      }
      document.addEventListener('keyup', handleKey);

      return () => {
        document.removeEventListener('keyup', handleKey);
      };
    }
  }, [prefsLoaded]);

  useEffect(() => {
    if (mode === 'history' && !isHistoryLoaded) {
      dispatch(fetchHistory());
    }
  }, [mode]);

  return (
    <React.Fragment>
      <div className="header" key="header">
        <Stats />
        <TabFilter />
        <Note />
      </div>
      {(mode === 'tabs') ? <Tablist key="tablist"/> : <HistoryList key="historylist" /> }
    </React.Fragment>
  );
}

export default TabStacks;
