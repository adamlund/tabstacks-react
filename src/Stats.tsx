import React from 'react';
import './stats.css';

function Stats({ tabCount, windowCount }: { tabCount: number, windowCount: number }) {
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
