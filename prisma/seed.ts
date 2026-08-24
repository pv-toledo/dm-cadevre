
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
    async function seedStudents() {
    const studentData: Prisma.StudentCreateInput[] = [
        // Children
        { name: "Ana Beatriz Souza Lima", birthDate: new Date("2012-03-14"), church: "Igreja Batista Central", address: "Rua das Palmeiras, 123 - Centro", responsibleName: "Marta Souza Lima", responsiblePhoneNumber: "(21) 98765-4321", email: "anabeatriz.lima@email.com" },
        { name: "Pedro Henrique Alves", birthDate: new Date("2014-07-22"), church: "Igreja Presbiteriana da Fé", address: "Av. das Acácias, 456 - Jardim Botânico", responsibleName: "Carlos Alves", responsiblePhoneNumber: "(21) 98123-4567" },
        { name: "Maria Eduarda Costa", birthDate: new Date("2011-11-05"), church: "Comunidade Cristã Vida Nova", address: "Rua São Clemente, 78 - Botafogo", responsibleName: "Fernanda Costa", responsiblePhoneNumber: "(21) 99876-1234", email: "eduarda.costa@email.com" },
        { name: "Lucas Gabriel Ferreira", birthDate: new Date("2013-01-30"), church: "Igreja Católica Nossa Senhora Aparecida", address: "Rua Voluntários da Pátria, 890 - Botafogo", responsibleName: "Roberto Ferreira", responsiblePhoneNumber: "(21) 97654-3210" },
        { name: "Sophia Rodrigues Martins", birthDate: new Date("2015-09-18"), church: "Igreja Assembleia de Deus", address: "Rua Marquês de Abrantes, 234 - Flamengo", responsibleName: "Juliana Martins", responsiblePhoneNumber: "(21) 96543-2109", email: "sophia.martins@email.com" },
        { name: "Enzo Gabriel Pereira", birthDate: new Date("2016-04-02"), church: "Igreja Metodista Central", address: "Rua Real Grandeza, 345 - Botafogo", responsibleName: "André Pereira", responsiblePhoneNumber: "(21) 95432-1098" },
        { name: "Isabela Cristina Santos", birthDate: new Date("2010-12-25"), church: "Comunidade Evangélica Renascer", address: "Rua General Polidoro, 567 - Botafogo", responsibleName: "Cristina Santos", responsiblePhoneNumber: "(21) 94321-0987", email: "isabela.santos@email.com", status: "INACTIVE" },
        { name: "Miguel Augusto Oliveira", birthDate: new Date("2017-06-11"), church: "Igreja Batista Central", address: "Rua Muniz Barreto, 12 - Botafogo", responsibleName: "Augusto Oliveira", responsiblePhoneNumber: "(21) 93210-9876" },
        { name: "Laura Beatriz Nunes", birthDate: new Date("2012-08-08"), church: "Igreja Presbiteriana da Fé", address: "Rua Álvaro Ramos, 89 - Botafogo", responsibleName: "Patrícia Nunes", responsiblePhoneNumber: "(21) 92109-8765", email: "laura.nunes@email.com" },
        { name: "Davi Lucca Barbosa", birthDate: new Date("2014-02-19"), church: "Comunidade Cristã Vida Nova", address: "Rua Farani, 34 - Botafogo", responsibleName: "Renato Barbosa", responsiblePhoneNumber: "(21) 91098-7654" },
        { name: "Alice Vitória Ramos", birthDate: new Date("2016-10-30"), church: "Igreja Católica Nossa Senhora Aparecida", address: "Rua Bambina, 156 - Botafogo", responsibleName: "Vitória Ramos", responsiblePhoneNumber: "(21) 90987-6543", email: "alice.ramos@email.com" },
        { name: "Gabriel Henrique Dias", birthDate: new Date("2011-05-27"), church: "Igreja Assembleia de Deus", address: "Rua Sorocaba, 278 - Botafogo", responsibleName: "Henrique Dias", responsiblePhoneNumber: "(21) 89876-5432" },
        { name: "Manuela Cristina Rocha", birthDate: new Date("2013-09-14"), church: "Igreja Metodista Central", address: "Rua Nelson Mandela, 45 - Botafogo", responsibleName: "Cristina Rocha", responsiblePhoneNumber: "(21) 88765-4321", email: "manuela.rocha@email.com" },
        { name: "Théo Bernardo Cardoso", birthDate: new Date("2015-01-03"), church: "Comunidade Evangélica Renascer", address: "Rua Barão de Icaraí, 67 - Botafogo", responsibleName: "Bernardo Cardoso", responsiblePhoneNumber: "(21) 87654-3210" },

        // Adults
        { name: "João Vitor Almeida", birthDate: new Date("1995-03-12"), church: "Igreja Batista Central", address: "Rua Visconde de Caravelas, 89 - Botafogo", studentPhoneNumber: "(21) 98111-2233", email: "joaovitor.almeida@email.com" },
        { name: "Camila Fernanda Duarte", birthDate: new Date("1988-07-29"), church: "Igreja Presbiteriana da Fé", address: "Rua da Passagem, 200 - Botafogo", studentPhoneNumber: "(21) 98222-3344", email: "camila.duarte@email.com" },
        { name: "Rafael Augusto Teixeira", birthDate: new Date("2000-11-19"), church: "Comunidade Cristã Vida Nova", address: "Rua São João Batista, 34 - Botafogo", studentPhoneNumber: "(21) 98333-4455" },
        { name: "Juliana Beatriz Moraes", birthDate: new Date("1992-04-06"), church: "Igreja Católica Nossa Senhora Aparecida", address: "Rua Assis Bueno, 56 - Botafogo", studentPhoneNumber: "(21) 98444-5566", email: "juliana.moraes@email.com" },
        { name: "Fernando José Carvalho", birthDate: new Date("1979-09-23"), church: "Igreja Assembleia de Deus", address: "Rua Praia de Botafogo, 300 - Botafogo", studentPhoneNumber: "(21) 98555-6677" },
        { name: "Patrícia Helena Gonçalves", birthDate: new Date("1985-01-15"), church: "Igreja Metodista Central", address: "Rua Dezenove de Fevereiro, 78 - Botafogo", studentPhoneNumber: "(21) 98666-7788", email: "patricia.goncalves@email.com" },
        { name: "Bruno César Monteiro", birthDate: new Date("1998-06-08"), church: "Comunidade Evangélica Renascer", address: "Rua Ceará, 90 - Botafogo", studentPhoneNumber: "(21) 98777-8899" },
        { name: "Larissa Maria Pinto", birthDate: new Date("2003-12-02"), church: "Igreja Batista Central", address: "Rua Paulo Barreto, 123 - Botafogo", studentPhoneNumber: "(21) 98888-9900", email: "larissa.pinto@email.com" },
        { name: "Rodrigo Souza Batista", birthDate: new Date("1990-08-17"), church: "Igreja Presbiteriana da Fé", address: "Rua Arnaldo Quintela, 45 - Botafogo", studentPhoneNumber: "(21) 98999-0011" },
        { name: "Amanda Cristina Freitas", birthDate: new Date("1997-02-28"), church: "Comunidade Cristã Vida Nova", address: "Rua Professor Alfredo Gomes, 67 - Botafogo", studentPhoneNumber: "(21) 97111-2233", email: "amanda.freitas@email.com", status: "INACTIVE" },
        { name: "Thiago Henrique Correia", birthDate: new Date("1983-10-05"), church: "Igreja Católica Nossa Senhora Aparecida", address: "Rua Dona Mariana, 89 - Botafogo", studentPhoneNumber: "(21) 97222-3344" },
        { name: "Vanessa Lopes Azevedo", birthDate: new Date("1975-05-21"), church: "Igreja Assembleia de Deus", address: "Rua Gago Coutinho, 12 - Laranjeiras", studentPhoneNumber: "(21) 97333-4455", email: "vanessa.azevedo@email.com" },
        { name: "Marcelo Antônio Vieira", birthDate: new Date("1968-03-09"), church: "Igreja Metodista Central", address: "Rua das Laranjeiras, 234 - Laranjeiras", studentPhoneNumber: "(21) 97444-5566", status: "INACTIVE" },
        { name: "Renata Silva Cavalcanti", birthDate: new Date("2001-07-14"), church: "Comunidade Evangélica Renascer", address: "Rua Alice, 56 - Laranjeiras", studentPhoneNumber: "(21) 97555-6677", email: "renata.cavalcanti@email.com" },
        { name: "Eduardo Machado Nogueira", birthDate: new Date("1993-11-27"), church: "Igreja Batista Central", address: "Rua Pereira da Silva, 78 - Laranjeiras", studentPhoneNumber: "(21) 97666-7788" },
        { name: "Beatriz Fernandes Xavier", birthDate: new Date("1980-09-30"), church: "Igreja Presbiteriana da Fé", address: "Rua Silveira Martins, 90 - Catete", studentPhoneNumber: "(21) 97777-8899", email: "beatriz.xavier@email.com" },
    ];

    await prisma.student.createMany({ data: studentData });
}

export async function main() {
    await seedModalities()
    await seedCourses()
    await seedClassPlans()
    await seedStudents()
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