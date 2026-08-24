
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
            where: { type: m.type },
            update: {},
            create: m
        });
    }
}

async function seedCourses() {
    const courseData: Prisma.CourseCreateInput[] = [
        {
            name: "Clarinete"
        },
        {
            name: "Flauta transversal"
        },
        {
            name: "Violino"
        },
        {
            name: "Violoncelo"
        },
        {
            name: "Saxofone alto"
        },
        {
            name: "Saxofone tenor"
        },
        {
            name: "Trompete"
        },
        {
            name: "Trombone"
        },
        {
            name: "Violão"
        },
        {
            name: "Guitarra"
        },
        {
            name: "Baixo"
        },
        {
            name: "Teclado"
        },
        {
            name: "Bateria"
        },
        {
            name: "Canto"
        },
        {
            name: "Viola"
        },
        {
            name: "Teoria musical"
        }

    ]

    await prisma.course.createMany({ data: courseData, skipDuplicates: true });
}

export async function main() {
    await seedModalities()
    await seedCourses()
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