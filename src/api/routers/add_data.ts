import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { rent_data, verification_requests } from '@db/schema';
import { get_user_info_from_jwt } from './verify_pass';

export const add_data_router = t.procedure
  .input(
    z.object({
      data: z.object({
        date: z.coerce.date(),
        month: z.coerce.date(),
        amount: z.number().int()
      }),
      jwt_token: z.string()
    })
  )
  .mutation(
    async ({
      input: {
        jwt_token,
        data: { month, amount, date }
      }
    }) => {
      let user_info: ReturnType<typeof get_user_info_from_jwt>;
      try {
        user_info = get_user_info_from_jwt(jwt_token);
      } catch {
        return {
          status: 'wrong_key'
        };
      }
      const returned_data = await db
        .insert(rent_data)
        .values({
          amount: amount,
          month: month,
          date: date,
          user_id: user_info.id
        })
        .returning();

      const id = returned_data[0].id;

      if (!user_info.is_admin)
        await db.insert(verification_requests).values({
          id: id
        });
      return {
        status: 'success'
      };
    }
  );
