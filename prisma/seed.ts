
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate(monthsAgo: number): Date {
    const now = new Date();
    const past = new Date(now);
    past.setMonth(past.getMonth() - randomInt(1, monthsAgo));
    return past;
}

const ENROLLMENT_STATUS_POOL = [
    ...Array(7).fill("ACTIVE"),
    ...Array(2).fill("LOCKED"),
    ...Array(1).fill("ENDED"),
];

function pickUniqueByCourse<T extends { courseId: string }>(items: T[], count: number): T[] {
    const byCourse = new Map<string, T[]>();
    for (const item of items) {
        const list = byCourse.get(item.courseId) ?? [];
        list.push(item);
        byCourse.set(item.courseId, list);
    }

    const courseIds = shuffle([...byCourse.keys()]).slice(0, count);
    return courseIds.map((id) => randomItem(byCourse.get(id)!));
}

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

async function seedEnrollments() {
    const students = await prisma.student.findMany();
    const classPlans = await prisma.classPlan.findMany();

    for (const student of students) {
        const chosenPlans = pickUniqueByCourse(classPlans, randomInt(1, 3));

        for (const plan of chosenPlans) {
            const status = randomItem(ENROLLMENT_STATUS_POOL);
            const startedAt = randomPastDate(18);

            let lockedAt: Date | null = null;
            let endedAt: Date | null = null;

            if (status === "LOCKED") {
                lockedAt = randomPastDate(3);
            }
            if (status === "ENDED") {
                endedAt = randomPastDate(2);
            }

            await prisma.enrollment.create({
                data: {
                    studentId: student.id,
                    classPlanId: plan.id,
                    courseId: plan.courseId,
                    status,
                    startedAt,
                    lockedAt,
                    endedAt,
                },
            });
        }
    }
}

async function seedInstruments() {
    const courses = await prisma.course.findMany();
    const courseIdByName = new Map(courses.map((c) => [c.name, c.id]));

    const instrumentData: (Omit<Prisma.InstrumentCreateInput, "course"> & { courseName: string })[] = [
        { courseName: "Clarinete", name: "Clarinete Yamaha 1", tag: "CL-001", brand: "Yamaha", model: "YCL-255", serialNumber: "YCL2255891", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Clarinete", name: "Clarinete Yamaha 2", tag: "CL-002", brand: "Yamaha", model: "YCL-255", condition: "DEFECTIVE", conditionDescription: "Chave de sol amassada, precisa de regulagem", status: "MAINTENANCE" },
        { courseName: "Flauta transversal", name: "Flauta Jahnke 1", tag: "FL-001", brand: "Jahnke", model: "JFL-100", serialNumber: "JFL100223", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Flauta transversal", name: "Flauta Jahnke 2", tag: "FL-002", brand: "Jahnke", model: "JFL-100", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Violino", name: "Violino Eagle 1", tag: "VI-001", brand: "Eagle", model: "VE441", serialNumber: "VE441087", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Violino", name: "Violino Eagle 2", tag: "VI-002", brand: "Eagle", model: "VE441", condition: "DEFECTIVE", conditionDescription: "Uma corda arrebentada, cavalete levemente desalinhado", status: "AVAILABLE" },
        { courseName: "Violoncelo", name: "Violoncelo Michael 1", tag: "VC-001", brand: "Michael", model: "VCM130", serialNumber: "VCM130045", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Saxofone alto", name: "Sax Alto Weril 1", tag: "SA-001", brand: "Weril", model: "EAM2003", serialNumber: "EAM2003198", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Saxofone tenor", name: "Sax Tenor Weril 1", tag: "ST-001", brand: "Weril", model: "ETM2003", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Trompete", name: "Trompete Michael 1", tag: "TP-001", brand: "Michael", model: "WTR-30", serialNumber: "WTR30076", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Trompete", name: "Trompete Michael 2", tag: "TP-002", brand: "Michael", model: "WTR-30", condition: "PERFECT", status: "RETIRED" },
        { courseName: "Trombone", name: "Trombone de Vara Eagle 1", tag: "TB-001", brand: "Eagle", model: "TV601", serialNumber: "TV601034", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Violão", name: "Violão Giannini 1", tag: "VL-001", brand: "Giannini", model: "GN-15", serialNumber: "GN15221", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Violão", name: "Violão Giannini 2", tag: "VL-002", brand: "Giannini", model: "GN-15", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Violão", name: "Violão Giannini 3", tag: "VL-003", brand: "Giannini", model: "GN-15", condition: "DEFECTIVE", conditionDescription: "Tarraxa do Ré travando, dificulta afinação", status: "AVAILABLE" },
        { courseName: "Viola", name: "Viola Caipira Rozini 1", tag: "VA-001", brand: "Rozini", model: "RZ10", serialNumber: "RZ10309", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Guitarra", name: "Guitarra Tagima 1", tag: "GT-001", brand: "Tagima", model: "TW-55", serialNumber: "TW55412", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Baixo", name: "Baixo Tagima 1", tag: "BX-001", brand: "Tagima", model: "TB-300", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Teclado", name: "Teclado Yamaha PSR 1", tag: "TC-001", brand: "Yamaha", model: "PSR-E373", serialNumber: "PSRE373190", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Bateria", name: "Bateria Odery 1", tag: "BT-001", brand: "Odery", model: "Fluence", condition: "PERFECT", status: "AVAILABLE" },
        { courseName: "Bateria", name: "Bateria Odery 2", tag: "BT-002", brand: "Odery", model: "Fluence", condition: "DEFECTIVE", conditionDescription: "Pele do bumbo furada, precisa troca", status: "MAINTENANCE" },
    ];

    for (const { courseName, ...data } of instrumentData) {
        const courseId = courseIdByName.get(courseName);
        if (!courseId) {
            throw new Error(`Course not found for instrument seed: ${courseName}`);
        }

        await prisma.instrument.create({
            data: { ...data, courseId },
        });
    }
}

async function seedLoans() {
    const enrollments = await prisma.enrollment.findMany();
    const instruments = await prisma.instrument.findMany();

    const instrumentsByCourse = new Map<string, typeof instruments>();
    for (const instrument of instruments) {
        const list = instrumentsByCourse.get(instrument.courseId) ?? [];
        list.push(instrument);
        instrumentsByCourse.set(instrument.courseId, list);
    }

    const busyInstrumentIds = new Set<string>();

    async function createLoan(
        enrollment: (typeof enrollments)[number],
        forceOpen: boolean
    ): Promise<boolean> {
        const candidates = (instrumentsByCourse.get(enrollment.courseId) ?? []).filter(
            (i) => i.status === "AVAILABLE" && !busyInstrumentIds.has(i.id)
        );
        if (candidates.length === 0) return false;

        const instrument = randomItem(candidates);
        const isOpen = forceOpen || Math.random() < 0.4;

        const loanedAt = randomPastDate(6);
        const loanCondition = randomItem(["PERFECT", "PERFECT", "PERFECT", "DEFECTIVE"] as const);
        const loanConditionDescription =
            loanCondition === "DEFECTIVE" ? "Pequeno desgaste identificado na retirada" : null;

        if (isOpen) {
            busyInstrumentIds.add(instrument.id);
            await prisma.loan.create({
                data: {
                    instrumentId: instrument.id,
                    enrollmentId: enrollment.id,
                    loanCondition,
                    loanConditionDescription,
                    loanedAt,
                    returnedAt: null,
                },
            });
            await prisma.instrument.update({
                where: { id: instrument.id },
                data: { status: "LOANED" },
            });
        } else {
            const returnedAt = new Date(loanedAt);
            returnedAt.setMonth(returnedAt.getMonth() + randomInt(1, 3));
            const returnCondition = randomItem(["PERFECT", "PERFECT", "DEFECTIVE"] as const);
            const returnConditionDescription =
                returnCondition === "DEFECTIVE" ? "Pequeno arranhão identificado na devolução" : null;

            await prisma.loan.create({
                data: {
                    instrumentId: instrument.id,
                    enrollmentId: enrollment.id,
                    loanCondition,
                    loanConditionDescription,
                    loanedAt,
                    returnedAt,
                    returnCondition,
                    returnConditionDescription,
                },
            });
        }

        return true;
    }

    const usedEnrollmentIds = new Set<string>();

    const lockedEnrollments = enrollments.filter((e) => e.status === "LOCKED");
    if (lockedEnrollments.length > 0) {
        const chosen = randomItem(lockedEnrollments);
        const success = await createLoan(chosen, true);
        if (success) usedEnrollmentIds.add(chosen.id);
    }

    for (const enrollment of enrollments) {
        if (usedEnrollmentIds.has(enrollment.id)) continue;
        if (Math.random() < 0.35) {
            await createLoan(enrollment, false);
        }
    }
}

const SEED_ADMIN_ID = "00000000-0000-0000-0000-000000000001";
const SEED_STAFF_ID = "00000000-0000-0000-0000-000000000002";

async function seedUserProfiles() {
    await prisma.userProfile.upsert({
        where: { id: SEED_ADMIN_ID },
        update: {},
        create: { id: SEED_ADMIN_ID, role: "ADMIN" },
    });
    await prisma.userProfile.upsert({
        where: { id: SEED_STAFF_ID },
        update: {},
        create: { id: SEED_STAFF_ID, role: "STAFF" },
    });
}

function dateOnly(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day));
}

function toDateOnly(d: Date): Date {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function monthsBetween(start: Date, end: Date): Date[] {
    const months: Date[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cursor <= last) {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
    }
    return months;
}

async function seedTuitionPayments() {
    const activeEnrollments = await prisma.enrollment.findMany({ where: { status: "ACTIVE" } });
    const classPlans = await prisma.classPlan.findMany();
    const modalities = await prisma.modality.findMany();

    const priceByModality = new Map(modalities.map((m) => [m.type, m.priceCents]));
    const classPlanById = new Map(classPlans.map((cp) => [cp.id, cp]));
    const now = new Date();

    for (const enrollment of activeEnrollments) {
        const classPlan = classPlanById.get(enrollment.classPlanId);
        if (!classPlan) continue;
        const amountCents = priceByModality.get(classPlan.modalityType);
        if (amountCents === undefined) continue;

        const earliestMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const startMonth = enrollment.startedAt > earliestMonth ? enrollment.startedAt : earliestMonth;

        for (const month of monthsBetween(startMonth, now)) {
            const referenceMonth = dateOnly(month.getFullYear(), month.getMonth(), 1);
            const dueDate = dateOnly(month.getFullYear(), month.getMonth(), 10);
            const isCurrentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();

            let paidAt: Date | null = null;
            let confirmedAt: Date | null = null;
            let method: "CASH" | "PIX" | null = null;
            let confirmedByUserId: string | null = null;

            if (!isCurrentMonth) {
                const outcome = randomItem(["PAID_ON_TIME", "PAID_ON_TIME", "PAID_ON_TIME", "PAID_LATE", "OVERDUE"] as const);

                if (outcome !== "OVERDUE") {
                    const offset = outcome === "PAID_ON_TIME" ? -randomInt(0, 5) : randomInt(3, 20);
                    const paymentDate = new Date(dueDate);
                    paymentDate.setUTCDate(paymentDate.getUTCDate() + offset);
                    paidAt = toDateOnly(paymentDate);
                    confirmedAt = paidAt;
                    method = randomItem(["CASH", "PIX"] as const);
                    confirmedByUserId = randomItem([SEED_ADMIN_ID, SEED_STAFF_ID]);
                }
            }

            await prisma.tuitionPayment.create({
                data: { enrollmentId: enrollment.id, referenceMonth, amountCents, dueDate, paidAt, confirmedAt, method, confirmedByUserId },
            });
        }
    }
}

const MAINTENANCE_FEE_AMOUNT_CENTS = 8000

async function seedMaintenanceFees() {
    const loans = await prisma.loan.findMany();

    const yearsByEnrollment = new Map<string, Set<number>>();
    for (const loan of loans) {
        const year = loan.loanedAt.getFullYear();
        const set = yearsByEnrollment.get(loan.enrollmentId) ?? new Set<number>();
        set.add(year);
        yearsByEnrollment.set(loan.enrollmentId, set);
    }

    for (const [enrollmentId, years] of yearsByEnrollment) {
        for (const year of years) {
            const fee = await prisma.maintenanceFee.create({
                data: {
                    enrollmentId,
                    referenceYear: dateOnly(year, 0, 1),
                    amountCents: MAINTENANCE_FEE_AMOUNT_CENTS,
                    dueDate: dateOnly(year, 6, 31),
                },
            });

            const scenario = randomItem(["UNPAID", "UNPAID", "PARTIAL", "PAID_ONE_SHOT", "PAID_INSTALLMENTS"] as const);
            if (scenario === "UNPAID") continue;

            const yearStart = dateOnly(year, 0, 1);
            const windowEnd = new Date() < dateOnly(year, 11, 31) ? new Date() : dateOnly(year, 11, 31);
            const randomDateInYear = (): Date => {
                const t = yearStart.getTime() + Math.random() * Math.max(0, windowEnd.getTime() - yearStart.getTime());
                return toDateOnly(new Date(t));
            };

            const makePayment = (amountCents: number) =>
                prisma.maintenanceFeePayment.create({
                    data: {
                        maintenanceFeeId: fee.id,
                        amountCents,
                        paidAt: randomDateInYear(),
                        method: randomItem(["CASH", "PIX"] as const),
                        confirmedByUserId: randomItem([SEED_ADMIN_ID, SEED_STAFF_ID]),
                    },
                });

            if (scenario === "PARTIAL") {
                await makePayment(Math.round(MAINTENANCE_FEE_AMOUNT_CENTS * (0.3 + Math.random() * 0.4)));
            } else if (scenario === "PAID_ONE_SHOT") {
                await makePayment(MAINTENANCE_FEE_AMOUNT_CENTS);
            } else if (scenario === "PAID_INSTALLMENTS") {
                const first = Math.round(MAINTENANCE_FEE_AMOUNT_CENTS * 0.5);
                await makePayment(first);
                await makePayment(MAINTENANCE_FEE_AMOUNT_CENTS - first);
            }
        }
    }
}


export async function main() {
    await seedModalities()
    await seedCourses()
    await seedClassPlans()
    await seedStudents()
    await seedEnrollments()
    await seedInstruments()
    await seedLoans()
    await seedUserProfiles()
    await seedTuitionPayments()
    await seedMaintenanceFees()
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