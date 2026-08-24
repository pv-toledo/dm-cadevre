
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function seedModalities() {
    const modalityData: Prisma.ModalityCreateInput[] =
        [
            {
                type: "INDIVIDUAL",
                priceCents: 10000
            },
            {
                type: "GROUP",
                priceCents: 8000
            }
        ]

    for (const m of modalityData) {
        await prisma.modality.upsert({ 
            where: {type: m.type},
            update: {},
            create: m
        });
    }
}

export async function main() {
    await seedModalities()
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });