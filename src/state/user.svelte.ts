import { writable } from 'svelte/store';
import { z } from 'zod';

const user_info_schema = z.object({
  id: z.number().int(),
  name: z.string(),
  user_type: z.enum(['admin', 'non-admin'])
});

export let user_info = writable<z.infer<typeof user_info_schema> | null>(null);
