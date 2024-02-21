import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tablist from './Tablist';
import Stats from './Stats';
import Filter from './Filter';
import { GetChromeWindows, GetCurrentWindow } from './chrome_commands';
import { setWindows } from './app/chromeWindowSlice';
import './styles.css';

function TabStacks() {
  const dispatch = useDispatch();

  async function refreshWindowsAsync() {
    const windows = await GetChromeWindows();
    const currentWindow = await GetCurrentWindow();

    console.log('currentWindow', currentWindow);
    if (windows && Array.isArray(windows) && windows.length > 0) {
      console.log('dispatching new window state', windows);
      dispatch(setWindows({chromeWindows: windows, currentWindow}));
    }
  };

  chrome.tabs.onCreated.addListener(
    async () => {
      console.log('oncreated event');
      await refreshWindowsAsync();
    },
  );

  chrome.tabs.onRemoved.addListener(
    async () => {
      console.log('remove tab triggered');
      await refreshWindowsAsync();
    },
  );

  chrome.tabs.onUpdated.addListener(
    async (tabId, changeInfo) => {
      console.log('UPDATE', tabId, changeInfo);

      await refreshWindowsAsync();
    },
  );

  useEffect(() => {
    console.log('useeffect');
    const getTabs = async () => {
      await refreshWindowsAsync();
    };
    getTabs();
  }, []);

  return (
    <React.Fragment>
      <div className="header" key="header">
        <Stats />
        <Filter />
      </div>
      <Tablist key="tablist" />
    </React.Fragment>
  );
}

export default TabStacks;
