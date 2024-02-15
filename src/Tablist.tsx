import React, { useState, useEffect } from 'react';
import Tab from './Tab';
import './styles.css';

interface TabListItem {
  type: string;
  data: ChromeWindow | ChromeTab;
}

function Tablist(props: TablistProps) {

  const [ listItems, setListItems ] = useState<TabListItem[]>([]);

  useEffect(() => {
    if (props.windows && Array.isArray(props.windows) && props.windows.length > 0) {
      const list: TabListItem[] = [];
      props.windows.forEach((window: ChromeWindow) => {
        list.push({ type: 'window', data: window });
        window.tabs.forEach((tab: ChromeTab) => {
          list.push({ type: 'tab', data: tab });
        });
      });
      setListItems(list);
    }
  }, [props.windows]);


  return (
    <div id="open_tabs" className="tablist">
      <ul>
        {listItems.map((item: TabListItem) => {
          if (item.type === 'window') {
            return <li className="window-break"></li>
          }
          else {
            return <li role="presentation">
              <Tab {...item.data as ChromeTab} />
            </li>
          }
        })}
      </ul>
    </div>
  );
};

export default Tablist;
