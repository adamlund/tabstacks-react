import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import TabStacks from './TabStacks';
import SettingsPage from './Settings';
import './styles.css';

const isOptionsPage = (document.location.href.endsWith('options.html'));

const root = document.createElement("div");
root.id = "TabStacks";
root.className = (isOptionsPage) ? "options__container" : "tab__container";

document.body.appendChild(root);
if (isOptionsPage) {
  document.body.classList.add('use-settings');
}
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Provider store={store}>
      {(isOptionsPage) ? <SettingsPage /> : <TabStacks />}
    </Provider>
  </React.StrictMode>
);
