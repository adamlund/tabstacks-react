import React, { useState } from 'react';
import { changeTab, removeTab } from './chrome_commands';
import './tab.css';

function Tab(props: chrome.tabs.Tab) {
  const { favIconUrl, url, title, id } = props;
  const [isActive, setActive ] = useState(false);

  const isNewTab = title === 'New Tab';

  const iconUrl = (favIconUrl && favIconUrl.length > 1) ? favIconUrl : '../img/chrome-logo-wht.svg'
  return (
    <div className="tab_row"
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      data-tabid={id}
    >
      <button
        role="menuitem"
        className={`tab_primary ${(isActive) && 'isactive'}`}
        onClick={() => {
          if (id) {
            changeTab(id);
          }
        }}
        onKeyUp={(key) => {
          console.log('KEYUP', key);
          if (key.keyCode === 8 || key.keyCode === 46) {
            if (id) {
              removeTab(id);
            }
          }
        }}
      >
        <div className="favicon"><img src={iconUrl} /></div>
        <div className="text-display">
          <div className="label truncate" title={title}>{title}</div>
          <div
            className={`url truncate transition${(isActive && !isNewTab) ? ' active' : ''}`}
            title={url}
          >{url}</div>
        </div>
      </button>
      {(isActive) && 
        <button
          className='close_button'
          onClick={() => {
            if (id) {
              removeTab(id);
            }
          }}
          title="Remove tab"
        >
          <img src="../img/close_black_24dp.svg" />
        </button>
      }

    </div>
  );

}
export default Tab;
