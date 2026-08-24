
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

const INDIVIDUAL_ONLY_COURSES = ["Violão", "Guitarra", "Baixo", "Teclado", "Bateria"]

async function seedClassPlans() {
    const courseData = await prisma.course.findMany()

    for (const c of courseData) {
        if (INDIVIDUAL_ONLY_COURSES.includes(c.name)) {
            await prisma.classPlan.upsert({
                where: { courseId_modalityType: { courseId: c.id, modalityType: "INDIVIDUAL" } },
                update: {},
                create: { courseId: c.id, modalityType: "INDIVIDUAL" }
            });
        } else {
            await prisma.classPlan.upsert({
                where: { courseId_modalityType: { courseId: c.id, modalityType: "GROUP" } },
                update: {},
                create: { courseId: c.id, modalityType: "GROUP" }
            });
            await prisma.classPlan.upsert({
                where: { courseId_modalityType: { courseId: c.id, modalityType: "INDIVIDUAL" } },
                update: {},
                create: { courseId: c.id, modalityType: "INDIVIDUAL" }
            });
        }
    }
}

export async function main() {
    await seedModalities()
    await seedCourses()
    await seedClassPlans()
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