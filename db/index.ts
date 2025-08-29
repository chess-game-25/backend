import { PrismaClient } from '../generated/prisma'

const client = new PrismaClient();

export const db = client;