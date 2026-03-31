// Modificado por IA: Prisma v7 requiere un driver adapter en el constructor; se usa @prisma/adapter-pg para PostgreSQL
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
