/**
 * Shared Prisma Client singleton.
 *
 * Prisma 5 reads DATABASE_URL directly from the environment
 * (loaded by dotenv/config in server.js) and needs no constructor args.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
