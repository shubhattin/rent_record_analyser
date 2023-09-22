import { Deta } from "deta";

const KEY = process.env.DETA_KEY;
const deta = Deta(KEY);

export const Base = (baseName: string) => {
  return deta.Base(baseName);
};
export const Drive = (driveName: string) => {
  return deta.Drive(driveName);
};
