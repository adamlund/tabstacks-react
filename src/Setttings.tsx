import React, { ChangeEvent, useState} from 'react';
import { PullHistory } from './chrome_commands';

function SettingsPage() {
  const [history, setHistory] = useState<string>('');
  const [historyArrSize, setHistoryArrSize] = useState(0);
  const [historyLength, setHistoryLength] = useState(5);

  function convertToStr(historyArr: chrome.history.HistoryItem[]): string {
    let strBuf = '';
    historyArr.forEach((hi: chrome.history.HistoryItem) => {
      strBuf += `${JSON.stringify(hi)},\n`;
    });
    return strBuf;
  }

  return (
    <div className="settings">
      <h1>TabStacks Settings</h1>
      <p>Preferences for tab and history search view.</p>
      <div>
      <button
          onClick={() => {
            PullHistory('', historyLength).then((hist: chrome.history.HistoryItem[]) => {
              console.log('pulled hist from onclick', hist.length);
              setHistoryArrSize(hist.length);
              setHistory(convertToStr(hist));
            });
          }}
        >Pull History</button>
        Days
        <input
          type='number'
          min={1}
          max={120}
          value={historyLength}
          onChange={(event: ChangeEvent) => {
            //@ts-ignore
            setHistoryLength(event?.target?.value);
          }} />
      </div>
      <div>{historyArrSize} history items in last {historyLength} days</div>
      <div><textarea rows={25} cols={100} value={history} /></div>
    </div>
  );
}

export default SettingsPage;
