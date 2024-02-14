import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  rent_data: RentDataTable;
  others: Others;
}

interface RentDataTable {
  id: Generated<number>;
  amount: number;
  date: Date;
  month: Date;
}
export type RentData = Selectable<RentDataTable>;
export type NewRentData = Insertable<RentDataTable>;
export type RentDataUpdate = Updateable<RentDataTable>;
interface OthersTable {
  id: string;
  value: string;
}
export type Others = Selectable<OthersTable>;
