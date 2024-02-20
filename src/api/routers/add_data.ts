import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { puShTi } from '@tools/hash';
import { rent_data_table } from '@db/schema';

const get_pass_verify_status = async (password: string) => {
  const hash = (await db.query.others.findFirst({
    where: ({ key }, { eq }) => eq(key, 'passKey')
  }))!.value;
  const verified = puShTi(password, hash);
  return verified;
};

const password_procedure = t.procedure.input(z.object({ password: z.string() }));

const submit_data = password_procedure
  .input(
    z.object({
      date: z.coerce.date(),
      month: z.coerce.date(),
      amount: z.number().int()
    })
  )
  .output(
    z.object({
      status: z.union([z.literal('wrong_key'), z.literal('success'), z.literal('failed')])
    })
  )
  .mutation(async ({ input }) => {
    const { amount, date, password, month } = input;
    if (!(await get_pass_verify_status(password)))
      return {
        status: 'wrong_key'
      };
    await db.insert(rent_data_table).values({
      amount: amount,
      month: month,
      date: date
    });
    return {
      status: 'success'
    };
  });

export const addDataRouter = t.router({
  verify_pass: password_procedure
    .output(z.object({ verified: z.boolean() }))
    .query(async ({ input: { password } }) => {
      return { verified: await get_pass_verify_status(password) };
    }),
  submit_data: submit_data
});
