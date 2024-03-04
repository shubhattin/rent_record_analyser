import prisma from '$lib/server/prisma';
import { t } from '../trpc_init';
import { z } from 'zod';
import { puShTi } from '@tools/hash';

const get_pass_verify_status = async (password: string) => {
  const hash = (await prisma.others.findFirst({
    where: {
      key: {
        equals: 'passKey'
      }
    }
  }))!.value;
  const verified = puShTi(password, hash);
  return verified;
};

const password_procedure = t.procedure.input(z.object({ password: z.string() }));

const submit_data = password_procedure
  .input(
    z.object({
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
      status: z.union([z.literal('wrong_key'), z.literal('success'), z.literal('failed')])
    })
  )
  .mutation(async ({ input }) => {
    const { password, to_change, to_delete } = input;
    if (!(await get_pass_verify_status(password)))
      return {
        status: 'wrong_key'
      };

    const operations: Promise<any>[] = [];

    for (let dt of to_change)
      operations.push(
        prisma.rent_data.update({
          data: dt,
          where: {
            id: dt.id
          }
        })
      );
    if (to_delete.length !== 0) {
      const delete_resp = prisma.rent_data.deleteMany({
        where: {
          id: {
            in: to_delete
          }
        }
      });
      operations.push(delete_resp);
    }
    if (operations.length !== 0) await Promise.all(operations);
    return {
      status: 'success'
    };
  });

export const editDataRouter = t.router({
  verify_pass: password_procedure
    .output(z.object({ verified: z.boolean() }))
    .query(async ({ input: { password } }) => {
      return { verified: await get_pass_verify_status(password) };
    }),
  submit_data: submit_data
});
