import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredListItems, selectListItems, selectSearchMode } from './app/chromeWindowSlice';

function Note() {
  const mode = useSelector(selectSearchMode);
  const fli = useSelector(selectFilteredListItems);
  const sli = useSelector(selectListItems);

  let notifMessage = '';
  let showNotif = false;

  if (mode === 'tabs' && fli.length !== sli.length) {
    showNotif = true;
    notifMessage = `${fli.length} tab${(fli.length === 1) ? '' : 's'} found`
  }
  if (mode === 'tabs' && showNotif) {
    return (
      <div className="note note-display" role="region" aria-live="polite">
        <div className="w-70" role="alert">{notifMessage}</div>
        <div className="w-30 align-right">
          <button
            className="button__historysearch"
            onClick={(event) => {
              
            }}
          >History
          (CTRL+S)
          </button>
        </div>
      </div>
    );
  } else if (mode === 'history') {
    notifMessage = "Items in history";
    return (
      <div className="note note-display" role="region" aria-live="polite">
        <div className="w-70" role="alert">{notifMessage}</div>
        <div className="w-30 align-right">
          <button
            className="button__historysearch"
            onClick={(event) => {
              
            }}
          >Tabs (CTRL+T)
          </button>
        </div>
      </div>
    );
  }
  const tabCount = sli.filter((ti: TabListItem) => ti.type === 'tab').length;
  notifMessage = `${tabCount} open tabs`;
  return (
    <div className="note" role="region" aria-live="polite">
      <div className="accessibilityText" role="alert">{notifMessage}</div>
    </div>
  );
}
export default Note;
