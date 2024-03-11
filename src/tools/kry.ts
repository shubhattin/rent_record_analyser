export const search_with_key = <T>(data_list: T[], key: keyof T, value: T[typeof key]) => {
  // this function can also be used in frontend despite of this file using node modules (using treeshaking)
  for (let i = 0; i < data_list.length; i++) if (data_list[i][key] === value) return i;
  return -1;
};
export const get_with_key = <T>(data_list: T[], key: keyof T, value: T[typeof key]) => {
  const index = search_with_key(data_list, key, value);
  if (index !== -1) return data_list[index];
};
