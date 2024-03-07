import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Tablist from './Tablist';
import TabFilter from './TabFilter';
import Stats from './Stats';
import Note from './Note';
import { _get } from './lib/search';
import { GetChromeWindows, GetCurrentWindow } from './chrome_commands';
import { ArrowCommand, DeleteTab } from './dom_commands';
import { setWindows } from './app/chromeWindowSlice';

function TabStacks() {
  const dispatch = useDispatch();

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

  // Keyboard navigation for arrow-key interaction
  function keyNavTabElement(event: KeyboardEvent) {
    const { key } = event;
    const currentFocusedElement = document.activeElement;
    if (key && (key === 'ArrowUp' || key === 'ArrowDown')) {
      ArrowCommand(key);
    } else if (currentFocusedElement?.id.startsWith('tab-') &&
      key === 'Backspace' || key === 'Delete') {
        const tabId = currentFocusedElement?.id?.split('-')[1];
        if (tabId) {
          DeleteTab(tabId);
        }
    }
  }

  useEffect(() => {
    const getTabs = async () => {
      await refreshWindowsAsync();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (typeof event?.key === 'string') {
        event.preventDefault();
        event.stopPropagation();
        keyNavTabElement(event);
      }
    }
    document.addEventListener('keyup', handleKey);
    getTabs();

    return () => {
      document.removeEventListener('keyup', handleKey);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="header" key="header">
        <Stats />
        <TabFilter />
        <Note />
      </div>
      <Tablist key="tablist" />
    </React.Fragment>
  );
}

export default TabStacks;
