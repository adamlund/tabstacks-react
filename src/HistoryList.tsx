import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectFilteredHistoryItems,
  selectHistoryItems,
  selectFilterText,
  selectListItems,
} from './app/chromeWindowSlice';
import { flattenTabListItemURL } from './lib/util';
import { formatDistanceToNow } from 'date-fns';
import { DEFAULT_HISTORY_ITEMS } from './constants';
import './styles.css';

function ftw(dateStamp: number) {
  return formatDistanceToNow(dateStamp, { addSuffix: true });
}

const sortLatestFirst = (a: chrome.history.HistoryItem, b: chrome.history.HistoryItem) => {
  if (a?.lastVisitTime && b?.lastVisitTime) {
    return (b.lastVisitTime * 1000) - (a.lastVisitTime * 1000);
  }
  return 0;
}

function HistoryList() {
  const filteredItems = useSelector(selectFilteredHistoryItems);
  const allHistoryItems = useSelector(selectHistoryItems);
  const filterText = useSelector(selectFilterText);
  const listItems = useSelector(selectListItems);

  const isFiltered = (filterText && filterText !== '' && filterText.length > 1);

  let displayItems: chrome.history.HistoryItem[] = (isFiltered)
    ? [...filteredItems] : [...allHistoryItems];
  
  // flatten listitems to url array
  const tabUrlArray: string[] = flattenTabListItemURL(listItems);

  // filter out open tabs from url
  displayItems = displayItems.filter((item: chrome.history.HistoryItem) => {
    if (item && item?.url) {
      return !tabUrlArray.includes(item.url);
    }
    return true;
  });

  // sort by most recent first
  if (displayItems && displayItems.length > 0) {
    displayItems.sort(sortLatestFirst);
  }
  // unfiltered show last default number of items
  if (!isFiltered) {
    displayItems = displayItems.slice(0, DEFAULT_HISTORY_ITEMS);
  }

  return (
    <div id="open_tabs" className="historylist">
      {displayItems.map((item: chrome.history.HistoryItem) => {
        const timeago = (item?.lastVisitTime)
          ? ftw(item?.lastVisitTime)
          : '';
        const viewcount = (item?.visitCount)
          ? `${item.visitCount} view${(item.visitCount === 1) ? '' : 's'}` : ''; 
        return (
          <a
            id={`history-${item.id}`}
            className="historyitem"
            href={item.url}
            target="_blank"
            title={item.url}
            aria-label={item.title}
          >
            <div className="historyitem__title">{item.title}</div>
            <div className="historyitem__url">{item.url}</div>
            <div className="historyitem__visits">{timeago} &mdash; {viewcount}</div>
          </a>
        );
      })}
    </div>
  );
};

export default HistoryList;
