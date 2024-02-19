import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Tablist from './Tablist';
import Stats from './Stats';
import Filter from './Filter';
import { GetChromeWindows } from './chrome_commands';
import { setWindows } from './app/chromeWindowSlice';
import './styles.css';

function TabStacks() {
  const dispatch = useDispatch();

  const refreshTabs = () => {
    GetChromeWindows().then((windows) => {
      if (windows && Array.isArray(windows) && windows.length > 0) {
        dispatch(setWindows(windows));
      }
    });
  };

  chrome.tabs.onCreated.addListener(
    () => {
      refreshTabs();
    },
  );

  chrome.tabs.onRemoved.addListener(
    () => {
      refreshTabs();
    },
  );

  chrome.tabs.onUpdated.addListener(
    () => {
      refreshTabs();
    },
  );

  useEffect(() => {
    refreshTabs();
  }, []);

  return (
    <>
      <div className="header" key="header">
        <Stats />
        <Filter />
      </div>
      <Tablist key="tablist" />
    </>
  );
}

export default TabStacks;
