/**
 * Like lodash.get; retrieve the property value from an object. Returns null if none found.
 * @param {Object} obj Object to retrieve property
 * @param {string} opath String path separated with dot notation for depth '.'
 */
export const _get = (obj: Record<string, any>, opath: string): any => {
  if (!obj || !opath) {
      return null;
  }
  if (opath.indexOf('.') >= 0) {
      const newObj = _get(obj, opath.substring(0, opath.indexOf('.')));
      if (newObj && typeof newObj === 'object') {
          return _get(
              newObj,
              opath.substring(opath.indexOf('.') + 1, opath.length)
          );
      }
      return null;
  }
  return opath in obj ? obj[opath] : null;
};

/**
 * Search inside an array of Objects and specify accessors to return matches.
 * Default algo is AND for terms separated by spaces in 'searchString'
 * @param {string} searchString
 * @param {Array<Object>} searchArray
 * @param {Array<string>} searchArrayAccessors
 */
export const searchForText = (
  searchString: string,
  searchArray: TabListItem[],
  searchArrayAccessors: string[],
) => {
  const regex = new RegExp(
      `(${searchString
          .trim()
          .split(' ')
          .join('.*')}|${searchString
          .trim()
          .split(' ')
          .reverse()
          .join('.*')})`,
      'i'
  );
  return searchArray.filter(item => {
      let hasMatches = false;
      searchArrayAccessors.forEach(accessor => {
        if (regex.test(_get(item, accessor))) {
          hasMatches = true;
        }
      });
      return hasMatches;
  });
};