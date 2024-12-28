// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Inicia uma instância do Prisma Client
const prisma = new PrismaClient();

// Exporta a instância para ser usada nas suas APIs ou em outros lugares no projeto
export { prisma };
