import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { rent_data, users, UsersSchemaZod, verification_requests } from '@db/schema';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@db/db_utils';

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
  .output(
    z.object({
      status: z.union([z.literal('wrong_key'), z.literal('success'), z.literal('failed')])
    })
  )
  .mutation(
    async ({
      input: {
        jwt_token,
        data: { month, amount, date }
      }
    }) => {
      // if (!(await get_pass_verify_status(password)))
      //   return {
      //     status: 'wrong_key'
      //   };
      const jwt_payload_schema = UsersSchemaZod.pick({
        id: true,
        is_admin: true
      });
      let payload: z.infer<typeof jwt_payload_schema>;
      try {
        payload = jwt_payload_schema.parse(jwt.verify(jwt_token, JWT_SECRET));
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
          user_id: payload.id
        })
        .returning();

      const id = returned_data[0].id;

      if (!payload.is_admin)
        await db.insert(verification_requests).values({
          id: id
        });
      return {
        status: 'success'
      };
    }
  );
