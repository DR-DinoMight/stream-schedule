export const sortByDate = (array, byValue) => {
  array.sort((a, b) => {
    return new Date(a[byValue]) - new Date(b[byValue]);
  });

  return array;
}
