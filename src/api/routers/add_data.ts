import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { rent_data, verification_requests } from '@db/schema';
import { INVALID_USER_ERROR } from './verify_pass';

export const add_data_router = t.procedure
  .input(
    z.object({
      data: z.object({
        date: z.coerce.date(),
        month: z.coerce.date(),
        amount: z.number().int()
      })
    })
  )
  .mutation(
    async ({
      input: {
        data: { month, amount, date }
      },
      ctx: { user }
    }) => {
      if (!user) throw INVALID_USER_ERROR;

      const returned_data = await db
        .insert(rent_data)
        .values({
          amount: amount,
          month: month,
          date: date,
          user_id: user.id
        })
        .returning();

      const id = returned_data[0].id;

      if (!user.is_admin)
        await db.insert(verification_requests).values({
          id: id
        });
      return {
        status: 'success'
      };
    }
  );
