/*
 * This is for filtering number in react tables
 *
 * @param String search string
 * @param String row value to compare with
 * @param Integer number of decimals we expect in the row value
 *
 * @return Boolean
 */
const filterNumber = (search, value, precision = 2) => {
  const filter = search.replace(/,/g, ''); // remove commas as we're going to convert it into a float
  const string = parseFloat(value).toFixed(precision);
  return string.includes(parseFloat(filter));
};

export default filterNumber;
