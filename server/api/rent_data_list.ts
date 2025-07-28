import { defineEventHandler, getQuery } from 'h3';
import { db } from '~/db/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { value } = query;

  return {
    d: 4
  };
});
