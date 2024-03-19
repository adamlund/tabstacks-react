import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectFilterText,
  selectFilteredListItems,
  selectListItems,
  selectSearchMode,
  selectFilteredHistoryItems,
  toggleSearchMode,
  selectPreferences,
} from './app/chromeWindowSlice';
import { DEFAULT_HISTORY_ITEMS } from './constants';

function Note() {
  const mode = useSelector(selectSearchMode);
  const ft = useSelector(selectFilterText);
  const fli = useSelector(selectFilteredListItems);
  const sli = useSelector(selectListItems);
  const fhi = useSelector(selectFilteredHistoryItems);
  const prefs = useSelector(selectPreferences);
  const searchToggleKey = prefs.searchToggleKey;
  const dispatch = useDispatch();

  let notifMessage = '';
  let showNotif = false;
  let isFiltered = (ft && ft !== '' && ft.length > 1);

  if (mode === 'tabs' && isFiltered) {
    showNotif = true;
    notifMessage = `${fli.length} tab${(fli.length === 1) ? '' : 's'} found`
  }
  if (mode === 'tabs' && showNotif) {
    return (
      <div className="note note-display" role="region" aria-live="polite">
        <div className="w-50" role="alert">{notifMessage}</div>
        <div className="w-50 align-right">
          <button
            className="button__historysearch"
            title={`Search history [CTRL+SHIFT+${searchToggleKey?.toUpperCase()}]`}
            onClick={() => {
              dispatch(toggleSearchMode());
            }}
          >Search History
          </button>
        </div>
      </div>
    );
  } else if (mode === 'history') {
    notifMessage = (isFiltered)
      ? `${fhi.length} history items matching \"${ft}\"`
      : `Showing ${DEFAULT_HISTORY_ITEMS} most recent closed tabs`;
    return (
      <div className="note note-display" role="region" aria-live="polite">
        <div className="w-60" role="alert">{notifMessage}</div>
        <div className="w-40 align-right">
          <button
            className="button__historysearch"
            title={`Search tabs [CTRL+SHIFT+${searchToggleKey?.toUpperCase()}]`}
            onClick={() => {
              dispatch(toggleSearchMode());
            }}
          >Search Tabs
          </button>
        </div>
      </div>
    );
  }

  const tabCount = sli.filter((ti: TabListItem) => ti.type === 'tab').length;
  notifMessage = `${tabCount} open tabs`;
  return (
    <div className="note note-default" role="region" aria-live="polite">
      <div className="accessibilityText" role="alert">{notifMessage}</div>
    </div>
  );
}
export default Note;
