function ArrowCommand(key: string) {
  const currentFocusedElement = document.activeElement;
  const tabElements = document.querySelectorAll('button[id^="tab-"]');
  const tabsArray = Array.from(tabElements);

  const currentIndex = tabsArray.findIndex(el => el === currentFocusedElement);

  if (currentIndex <= 0) {
    document.getElementById('tabSearch')?.focus();
  }

  const nextIndex = (key === 'ArrowDown')
    ? (currentIndex >= 0 && currentIndex < tabsArray.length - 1) ? currentIndex + 1 : 0
    // arrowup
    : currentIndex - 1;

  // Select the next tab element, if available
  const nextTabElement = tabsArray[nextIndex];

  if (nextTabElement) {
    //@ts-ignore
    nextTabElement.focus();
    return;
  }
}

function DeleteTab(tabId: string) {
  const tabElem = document.getElementById(`tab-${tabId}`);
  const tabElementsAll = document.querySelectorAll('button[id^="tab-"]');
  const tabsArrayAll = Array.from(tabElementsAll);
  const currentIndex = tabsArrayAll.findIndex(el => el === tabElem);

  if (tabId) {
    chrome.tabs.remove(Number(tabId)).then(() => {
      const tabElements = document.querySelectorAll('button[id^="tab-"]');
      const tabsArray = Array.from(tabElements);
      if (tabsArray.length === 0 || currentIndex === tabsArray.length - 1) {
        document.getElementById('tabSearch')?.focus();
      } else {
        //@ts-ignore
        tabsArray[currentIndex].focus();
      }
    });
  }
}

export {
  DeleteTab,
  ArrowCommand,
}
