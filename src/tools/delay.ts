/**
 * A function to similate delay
 */
export const delay = (ms: number) => {
  return new Promise((rs) => {
    setTimeout(() => rs(null), ms);
  });
};
