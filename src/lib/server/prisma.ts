import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

export type RentData = Prisma.rent_dataGetPayload<{ select: Prisma.rent_dataSelect }>;
