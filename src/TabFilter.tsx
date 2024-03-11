import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilterText,
  selectListItems,
  selectSearchMode,
} from './app/chromeWindowSlice';

export default function TabFilter() {
  const [filterText, _setFilterText ] = useState<string>('');
  const listItems = useSelector(selectListItems);
  const [_filteredItems, _setfilteredItems] = useState<TabListItem[]>(listItems);
  const mode = useSelector(selectSearchMode);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const label = (mode === 'tabs') ? "Filter tabs by title or url" : 'Filter history items';

  const forceFocus = () => {
    if (inputRef.current !== null) {
      // @ts-ignore
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    forceFocus();
  },[mode]);

  return (
    <div className="tabfilter">
      <input
        type="text"
        id="tabSearch"
        placeholder={label}
        aria-label={label}
        value={filterText}
        onChange={(val) => { 
          _setFilterText(val.target.value);
          dispatch(setFilterText(val.target.value));
        }}
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
              _setFilterText('');
              dispatch(setFilterText(''));
              forceFocus();
            }}
          />
        </button>
      }
    </div>
  );
}
