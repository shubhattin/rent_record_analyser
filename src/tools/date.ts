/**
 * Normalize Dates :- `2023-09-08` -> `8/9/2023`
 */
export const normaliseDate = (date: string) => {
  // This Normalization is useful while comparing dates
  // dd/mm/yyyy
  const lst = date.split("-").map((v) => parseInt(v));
  lst.reverse();
  return lst.join("/");
  // yyyy-mm-dd
};

/**
 * Normalize Dates :- `8/9/2023` -> `2023-9-8`
 */
export const unNormaliseDate = (date: string) => {
  // dd/mm/yyyy
  const lst = date.split("/").map((v) => parseInt(v));
  lst.reverse();
  return lst.join("-");
  // yyyy-mm-dd
};

/**
 * Evaluates `a > b` .Both dates should be in `yyyy-mm-dd` format
 */
export const compare_dates = (a: string, b: string) =>
  new Date(a) >= new Date(b);
