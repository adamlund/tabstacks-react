import React from 'react';
import { useSelector } from 'react-redux';
import { selectTabCount, selectWindowCount } from './app/chromeWindowSlice';

function Stats() {
  const tabCount = useSelector(selectTabCount);
  const windowCount = useSelector(selectWindowCount);
  const tabLabel = (tabCount > 1) ? 'tabs' : 'tab';
  const windowLabel = (windowCount > 1) ? 'windows' : 'window';
  return (
    <div className="stats__container flexcontainer flex-center-vertical">
      <div className="align-left w-70 stats flexcontainer">
        <img className="stats__img" src="../img/icon-tabs.svg" height="16" alt="Tab Count" />
        <div>{tabCount || 0}</div>
        <div className="stats__lbltxt">{tabLabel}</div>
        <img className="stats__img" src="../img/icon-window.svg" height="16" alt="Window Count" />
        <div>{windowCount || 0}</div>
        <div className="stats__lbltxt">{windowLabel}</div>
      </div>
      <div className="align-right w-30">
        <button
          className='iconbutton__toolbar-round'
          title="Change appearance and behavior settings"
          onClick={() => {
            if (chrome.runtime.openOptionsPage) {
              chrome.runtime.openOptionsPage();
            } else {
              window.open(chrome.runtime.getURL('options.html'));
            }
          }}
        >
          <img
            className='iconbutton__toolbar__image'
            src="../img/settings_w300_24.svg" height="20" width="20" />
        </button>
      </div>
    </div>
  );
}
export default Stats;
