import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Prisma } from '@prisma/client'

export type TestType = Prisma.$TestPayload['scalars']

const prisma = new PrismaClient()
    .$extends(withAccelerate())

export function getPrismaClient() {
    return prisma
}

export async function getAllTests() {
    return await prisma.test.findMany()
}

export async function getTestById(testId: number) {
    return await prisma.test.findUnique({ where: { id: testId } })
}

export function getRunsByTestId(testId: number) {

    return prisma.run.findMany({ where: { testId: testId } })
}

export async function getRunEventsByRunId(runId: number) {

    return await prisma.runEvent.findMany({ where: { runId: runId } })
}