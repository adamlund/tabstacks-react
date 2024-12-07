import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { changeTab, setTabAudio } from './chrome_commands';
import { DeleteTab } from './dom_commands';
import { selectPreferences } from './app/chromeWindowSlice';
import { DEFAULT_DISPOSE_POPUP_ON_CLOSE } from './constants';

function Tab(props: chrome.tabs.Tab) {
  const { favIconUrl, url, title, id } = props;
  const [isActive, setActive] = useState(false);
  const prefs = useSelector(selectPreferences);

  const forceURLShow = (prefs?.showURLOnTabs);
  const disposeOnClose = prefs?.disposeOnTabChange || DEFAULT_DISPOSE_POPUP_ON_CLOSE;
  console.log('dispose on close', disposeOnClose);

  let iconUrl = (favIconUrl && favIconUrl.length > 1) ? favIconUrl : '../img/chrome-logo-wht.svg';
  const isAudible = props?.audible;
  const isMuted = props?.mutedInfo?.muted || false;
  // const isUnloaded = props.discarded;

  return (
    <li
      className="tab_row"
      role="presentation"
      data-tabid={id}
      id={`tabcontainer-${id}`}
    >
      <button
        role="menuitem"
        id={`tab-${id}`}
        data-tabid={id}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className={`tab_primary${(isActive) ? ' isactive' : ''}`}
        onClick={() => {
          if (id) {
            changeTab(id, disposeOnClose);
          }
        }}
      >
        {(isAudible || isMuted)
          ? <button
              className="button__audible"
              title={(isMuted) ? 'Audio muted, click to unmute' : 'Sound playing, click to mute'}
              aria-label={(isMuted) ? 'Audio muted, click to unmute' : 'Sound playing, click to mute'}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation();
                if (id) {
                  setTabAudio(id, !isMuted);
                }
              }}
              >
              <img
                className={(isMuted) ? 'tab__img-muted' : 'tab__img-audible'}
                src={(isMuted) ? '../img/volume_muted_w400_24.svg' : '../img/volume_w400_24.svg'}
              />
            </button>
          : <div className="favicon">
              <img className="tab__img-favicon" src={iconUrl} loading="lazy" />
            </div>}
        <div className="tab__text_display">
          <div className="tab__label truncate" title={title}>{title}</div>
            <div
              className={`tab__url truncate ${(isActive || forceURLShow) ? 'active' : 'hidden'}`}
              title={url}
            >
              {url}
            </div>
        </div>
        <div>
        {(isActive) &&
          <button
            className="tab__deletebutton"
            title="Remove tab"
            tabIndex={-1}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation();
              if (id) {
                DeleteTab(`${id}`);
              }
            }}
          >
            <img className="tab__img-closeicon" src="../img/close_black_24dp.svg" />
          </button>
        }
        </div>
      </button>
    </li>
  );

}
export default Tab;
