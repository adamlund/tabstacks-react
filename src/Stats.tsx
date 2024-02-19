import React from 'react';
import { useSelector } from 'react-redux';
import { selectTabCount, selectWindowCount } from './app/chromeWindowSlice';
import './stats.css';

function Stats() {
  const tabCount = useSelector(selectTabCount);
  const windowCount = useSelector(selectWindowCount);
  const tabLabel = (tabCount > 1) ? 'tabs' : 'tab';
  const windowLabel = (windowCount > 1) ? 'windows' : 'window';
  return (
    <div className="stats">
      <img src="../img/icon-tabs.svg" height="16" width="20" alt="Tab Count" />
      <span id="tab-count">{tabCount || 0}</span>
      <span id="tab-count-label" className="lbltxt">{tabLabel}</span>
      <img src="../img/icon-window.svg" height="16" width="20" alt="Window Count" />
      <span id="window-count">{windowCount || 0}</span>
      <span id="window-count-label" className="lbltxt">{windowLabel}</span>
    </div>
  );
}
export default Stats;
