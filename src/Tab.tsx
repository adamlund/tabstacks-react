import React from 'react';
import { changeTab, removeTab } from './chrome_commands';
import './tab.css';

function Tab(props: ChromeTab) {
  const { favIconUrl, url, title, id } = props;
  return (
    <button
      role="menuitem"
      className="tab-button"
      onClick={() => changeTab(id)}
      onKeyUp={(key) => {
        console.log('KEYUP', key);
        if (key.keyCode === 8 || key.keyCode === 46) {
          removeTab(id);
        }
      }}
    >
      <div className="favicon"><img src={favIconUrl} /></div>
      <div className="text-display">
        <div className="label truncate">{title}</div>
        <div className="url truncate transition">{url}</div>
      </div>
    </button>
  );

}
export default Tab;
