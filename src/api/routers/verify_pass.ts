import { t } from '@api/trpc_init';
import { db } from '@db/db';
import { puShTi } from '@tools/hash';
import { z } from 'zod';

export const get_pass_verify_status = async (user_id: number, password: string) => {
    const query = (await db.query.users.findFirst({
        columns: { password: true },
        where: ({ id }, { eq }) => eq(id, user_id)
    }))
    if (!query) return false;
    const hash = query.password;
    const verified = puShTi(password, hash);
    return verified;
};

export const password_procedure = t.procedure.input(z.object({ password: z.string(), user_id: z.number().int() }));

export const verify_pass_router = password_procedure.query(async ({ input: { password, user_id } }) => {
    return { verified: await get_pass_verify_status(user_id, password) };
})