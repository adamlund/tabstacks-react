import React, { useState, useEffect } from 'react';
import Tablist from './Tablist';
import Stats from './Stats';
import { GetChromeWindows } from './chrome_commands';
import './styles.css';

function TabStacks() {
  const [ windows, setWindows ] = useState<ChromeWindow[]>([]);

  function countTabs() {
    let tabCounter = 0;
    if (windows && Array.isArray(windows) && windows.length > 0) {
      windows.forEach((window: ChromeWindow) => {
        tabCounter += window.tabs.length;
      });
    }
    return tabCounter;
  }

  useEffect(() => {
    GetChromeWindows().then((windows) => {
      if (windows && Array.isArray(windows) && windows.length > 0) {
        setWindows(windows);
      }
    });
  }, []);

  return (
    <>
      <div className="header" key="header">
        <Stats
          tabCount={countTabs()}
          windowCount={windows.length}
        />
      </div>
      <Tablist key="tablist" windows={windows} />
    </>
  );
}

export default TabStacks;
