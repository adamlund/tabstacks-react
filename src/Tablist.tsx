import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tab from './Tab';
import {
  selectFilteredListItems,
  selectListItems,
  selectFilterText,
  toggleSearchMode,
  fetchHistory,
  selectHistoryLoaded,
  selectFilteredHistoryItems,
} from './app/chromeWindowSlice';
import { AppDispatch } from './app/store';
import './styles.css';

function Tablist() {
  const listItems = useSelector(selectFilteredListItems);
  const unfilteredListItems = useSelector(selectListItems);
  const filterText = useSelector(selectFilterText);
  const historyLoaded = useSelector(selectHistoryLoaded);
  const historyItems = useSelector(selectFilteredHistoryItems);
  const [isActive, setActive] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const hasFilter = (filterText && filterText !== '' && filterText.length > 1);
  const displayItems: TabListItem[] = (hasFilter) ? [...listItems] : [...unfilteredListItems];

  if (hasFilter && listItems.length === 0 && !historyLoaded) {
    dispatch(fetchHistory());
  }

  if (hasFilter && listItems.length === 0 && historyLoaded && historyItems.length > 0) {
    return (
      <div id="open_tabs" className="tablist">
        <ul>
          <li
            className="tab_row"
            role="presentation"
            id="tabcontainer-history"
          >
            <button
              role="menuitem"
              id="tab-history"
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              onMouseEnter={() => setActive(true)}
              onMouseLeave={() => setActive(false)}
              className={`tab_primary${(isActive) ? ' isactive' : ''} flex-center-vertical`}
              onClick={() => {
                dispatch(toggleSearchMode());
              }}
            >
              <div className="favicon">
                <img className="tab__img-muted" src="../img/history_w400_24.svg" loading="lazy" />
              </div>
              <div className="tab__text_display">
                {historyItems.length} matching items in history (CTRL+S to toggle)
              </div>
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div id="open_tabs" className="tablist">
      <ul>
        {displayItems.map((item: TabListItem) => {
          if (item.type === 'window') {
            return <li className="window-break"></li>
          }
          else {
            return <Tab {...item.data as chrome.tabs.Tab} />
          }
        })}
      </ul>
    </div>
  );
};

export default Tablist;
