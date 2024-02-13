import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  rent_data: RentDataTable;
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
