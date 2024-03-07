import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredItems, selectListItems } from './app/chromeWindowSlice';
import { searchForText } from './lib/search';

export default function TabFilter() {
  const [filterText, setFilterText ] = useState<string>('');
  const listItems = useSelector(selectListItems);
  const [_filteredItems, _setfilteredItems] = useState<TabListItem[]>(listItems);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (filterText.length > 1) {
      const matchTabs = searchForText(filterText, listItems, [
        'data.url',
        'data.title',
      ]);
      const filteredItems = matchTabs.filter((mt: TabListItem) => mt.type === 'tab');
      dispatch(setFilteredItems(filteredItems));
    }
    // reset the tabs and windows
    if (filterText === '') {
      dispatch(setFilteredItems(listItems));
    }
  }, [filterText, listItems]);

  return (
    <div className="tabfilter">
      <input
        type="text"
        id="tabSearch"
        placeholder="Filter tabs by title or url"
        aria-label="Filter tabs by title or url"
        value={filterText}
        onChange={(val) => setFilterText(val.target.value)}
        ref={inputRef}
        autoFocus
      />
      {filterText.length > 0 &&
        <button
          className='tabfilter__resetbutton'
          tabIndex={-1}
        >
          <img
            src="../img/close_black_24dp.svg"
            alt="Reset search"
            aria-label="Reset search"
            onClick={() => {
              setFilterText('');
              if (inputRef?.current !== null) {
                // @ts-ignore
                inputRef.current.focus();
              }
            }}
          />
        </button>
      }
    </div>
  );
}
