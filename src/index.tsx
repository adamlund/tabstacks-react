import React from 'react';
import ReactDOM from 'react-dom/client';
import TabStacks from './TabStacks';

const root = document.createElement("div")
root.className = "container";
root.id = "TabStacks";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <TabStacks />
  </React.StrictMode>
);
