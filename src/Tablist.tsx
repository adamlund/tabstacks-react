import React from 'react';
import { useSelector } from 'react-redux';
import Tab from './Tab';
import { selectFilteredListItems } from './app/chromeWindowSlice';
import './styles.css';

function Tablist() {
  const listItems = useSelector(selectFilteredListItems);

  return (
    <div id="open_tabs" className="tablist">
      <ul>
        {listItems.map((item: TabListItem) => {
          if (item.type === 'window') {
            return <li className="window-break"></li>
          }
          else {
            return <li role="presentation">
              <Tab {...item.data as chrome.tabs.Tab} />
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tablist;
