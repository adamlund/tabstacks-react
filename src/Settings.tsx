import React, { useState, useEffect } from 'react';
import { pushSettings, readSettings, clearSettings } from './chrome_commands';
import {
  DEFAULT_HISTORY_LIMIT,
  DEFAULT_SEARCH_DURATION,
  DEFAULT_SEARCH_TOGGLE_KEY,
} from './constants';
import { _get } from './lib/search';

interface KeyboardOption {
  label: string;
  value: string;
}

const possible_alpha_key_values = ['b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','w','y'];

function KeyboardOptions(): KeyboardOption[] {
  let options: KeyboardOption[] = [];
  for (const item of possible_alpha_key_values) {
    options.push(
      {
        value: item,
        label: item.toUpperCase(),
      }
    );
  }
  return options;
}

function SettingsPage() {
  const [prefsAsRead, setPrefsAsread] = useState<TabStacksSyncSettings>({});
  const [historySearchDays, setHistorySearchDays] = useState(DEFAULT_SEARCH_DURATION);
  const [historySearchLimit, setHistorySearchLimit] = useState(DEFAULT_HISTORY_LIMIT);
  const [searchToggleKey, setSearchToggleKey] = useState(DEFAULT_SEARCH_TOGGLE_KEY);
  const [showURLOnTabs, setShowURLOnTabs] = useState('0');

  const kbOptions = KeyboardOptions();

  useEffect(() => {
    const getAndSetSettings = async () => {
      const prefs = await readSettings();
      setPrefsAsread(prefs);
      const tabURLSet = _get(prefs, 'showURLOnTabs');
      const historyDays = _get(prefs, 'historySearchDays');
      const historyLimit = _get(prefs, 'historySearchLimit');
      const toggleKey = _get(prefs, 'searchToggleKey');

      setShowURLOnTabs((tabURLSet) ? '1' : '0');
      if (historyDays) {
        setHistorySearchDays(historyDays)
      }
      if (historyLimit) {
        setHistorySearchLimit(historyLimit);
      }
      if (toggleKey) {
        setSearchToggleKey(toggleKey);
      }
    };
    getAndSetSettings();
  }, []);

  function resetDefaults() {
    setHistorySearchDays(DEFAULT_SEARCH_DURATION);
    setHistorySearchLimit(DEFAULT_HISTORY_LIMIT);
    setSearchToggleKey(DEFAULT_SEARCH_TOGGLE_KEY);
    setShowURLOnTabs('0');
    clearSettings();
  }

  function savePreferences() {
    let newPrefs: TabStacksSyncSettings = {...prefsAsRead};
    if (showURLOnTabs === '1') {
      newPrefs.showURLOnTabs = true;
    } else if (showURLOnTabs === '0') {
      newPrefs.showURLOnTabs = false;
    }
    if (historySearchDays !== DEFAULT_SEARCH_DURATION
        || _get(prefsAsRead, 'historySearchDays')) {
      newPrefs.historySearchDays = historySearchDays;
    }
    if (historySearchLimit !== DEFAULT_HISTORY_LIMIT
        || _get(prefsAsRead, 'historySearchLimit')) {
      newPrefs.historySearchLimit = historySearchLimit;
    }
    if (searchToggleKey !== DEFAULT_SEARCH_TOGGLE_KEY
      || _get(prefsAsRead, 'searchToggleKey')) {
    newPrefs.searchToggleKey = searchToggleKey;
  }
    pushSettings(newPrefs);
  }

  return (
    <div className="settings">
      <h1 className='align-left'>
        <img
          src="./img/logo32x.png"
          height="24"
          width="24"
          className="options__logo"
        />TabStacks Settings
      </h1>
      <div className='settings-container'>
        <p className='settings-intro align-left'>
          Preferences for tab and history search view. Preferences are saved and synchronized, so changes made here will appear in other browser where the TabStacks extension is installed.</p>
        <h3>Tablist Appearance</h3>
        <div className='settings-group'>
          <div className="settings-label">Show URL on tab</div>
          <div className="settings__input-container">
            <select
              className="settings-input"
              name="showURLOnTabs"
              value={showURLOnTabs}
              onChange={(event) => {
                setShowURLOnTabs(event.target.value);
              }}
            >
              <option value="0">Only on hover or focus</option>
              <option value="1">Always show URL</option>
            </select>
          </div>
        </div>
        <h3>Keyboard Navigation</h3>
        <div className='settings-group'>
          <div className="settings-label">
            <p>Search toggle key.</p>
            <p>Changes search mode between tab and history search.</p>
          </div>
          <div className="settings__input-container">
              {"[CTRL] + "}
              <select
                className="settings__input"
                value={searchToggleKey}
                onChange={(event) => {
                  setSearchToggleKey(event.target.value);
                }}
              >
                {kbOptions.map((opt: KeyboardOption) => <option value={opt.value}>{opt.label}</option>)}
              </select>
          </div>
        </div>
        <h3>History Search</h3>
        <div className='settings-group'>
          <div className="settings-label">Number of days lookback for history search</div>
          <div className="settings__input-container">
            <input
              className="settings-input"
              type='number'
              min={1}
              max={120}
              value={historySearchDays}
              onChange={(event) => {
                setHistorySearchDays(Number(event.target.value));
              }}
            />
          </div>
        </div>
        <div className='settings-group'>
          <div className="settings-label">Maximum limit of history search</div>
          <div className="settings__input-container">
            <input
              className="settings-input"
              type='number'
              min={100}
              max={10000}
              value={historySearchLimit}
              onChange={(event) => {
                setHistorySearchLimit(Number(event.target.value));
              }}
            />
          </div>
        </div>
        <div className="settings-button-container flexcontainer">
          <div className="w-50 align-left">
            <button
              onClick={() => savePreferences()}
              className="settings-button"
            >Save Settings</button>
          </div>
          <div className="w-50 align-right">
            <button
              className="settings-button"
              onClick={async () => await resetDefaults()}
            >Reset to Defaults</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
