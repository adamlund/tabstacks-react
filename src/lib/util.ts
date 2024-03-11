
export function flattenTabListItemURL(listItems: TabListItem[]): string[] {
  if (!listItems || listItems.length === 0) {
    return [];
  }
  const tabsOnly = listItems.filter((mt: TabListItem) => mt.type === 'tab');
  const urlsOnly = tabsOnly.map((tli: TabListItem) => {
    const data = {...tli.data} as chrome.tabs.Tab;
    if (data?.url) {
      return data.url;
    }
    return '';
  });
  return urlsOnly;
}
