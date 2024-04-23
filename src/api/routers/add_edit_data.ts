import { protectedProcedure, t, protectedAdminProcedure } from '@api/trpc_init';
import { db } from '@db/db';
import { z } from 'zod';
import { electricity_bills, rent_data, verification_requests } from '@db/schema';
import { eq, inArray } from 'drizzle-orm';

export const add_data_router = protectedProcedure
  .input(
    z.object({
      bill_type: z.union([z.literal('rent'), z.literal('electricity')]),
      data: z.object({
        date: z.coerce.date(),
        month: z.coerce.date(),
        amount: z.number().int()
      })
    })
  )
  .output(
    z.object({
      status: z.union([z.literal('success'), z.literal('already_exists')])
    })
  )
  .mutation(
    async ({
      input: {
        data: { month, amount, date },
        bill_type
      },
      ctx: { user }
    }) => {
      if (bill_type === 'rent') {
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
      // else if (bill_type === 'electricity') {
      const prev_data = await db.query.electricity_bills.findFirst({
        where: (dt, { eq }) => eq(dt.month, month)
      });
      if (!!prev_data) {
        return {
          status: 'already_exists'
        };
      }
      await db.insert(electricity_bills).values({
        amount: amount,
        month: month,
        date: date,
        user_id: user.id
      });
      return {
        status: 'success'
      };
      // }
    }
  );

export const edit_data_router = protectedAdminProcedure
  .input(
    z.object({
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
      status: z.union([z.literal('success'), z.literal('failed')])
    })
  )
  .mutation(async ({ input, ctx: { user } }) => {
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

export const data_add_edit_router = t.router({
  add_data: add_data_router,
  edit_data: edit_data_router
});
