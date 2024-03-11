import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { rent_data, verification_requests } from '@db/schema';
import { eq, inArray } from 'drizzle-orm';
import { get_user_info_from_jwt } from './verify_pass';

export const edit_data_router = t.procedure
  .input(
    z.object({
      jwt_token: z.string(),
      to_verify: z.array(z.number().int()),
      to_delete: z.number().int().array(),
      to_change: z
        .object({
          id: z.number().int(),
          date: z.coerce.date(),
          month: z.coerce.date(),
          amount: z.number().int()
        })
        .array()
    })
  )
  .output(
    z.object({
      status: z.union([
        z.literal('wrong_key'),
        z.literal('success'),
        z.literal('failed'),
        z.literal('unauthorized')
      ])
    })
  )
  .mutation(async ({ input }) => {
    const { jwt_token } = input;
    let user_info: ReturnType<typeof get_user_info_from_jwt>;
    try {
      user_info = get_user_info_from_jwt(jwt_token);
    } catch {
      return {
        status: 'wrong_key'
      };
    }

    if (!user_info.is_admin)
      return {
        status: 'unauthorized'
      };

    const { to_change, to_delete, to_verify } = input;
    const operations: Promise<any>[] = [];

    for (let dt of to_change)
      operations.push(db.update(rent_data).set(dt).where(eq(rent_data.id, dt.id)));
    if (to_delete.length !== 0) {
      const delete_resp = db.delete(rent_data).where(inArray(rent_data.id, to_delete));
      operations.push(delete_resp);
    }
    if (to_verify.length !== 0) {
      const veriiable_items_remove_resp = db
        .delete(verification_requests)
        .where(inArray(verification_requests.id, to_verify));
      operations.push(veriiable_items_remove_resp);
    }
    if (to_delete.length !== 0) {
      const delete_resp = db.delete(rent_data).where(inArray(rent_data.id, to_delete));
      operations.push(delete_resp);
    }
    if (operations.length !== 0) await Promise.all(operations);
    return {
      status: 'success'
    };
  });
