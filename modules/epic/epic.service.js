import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class EpicService extends BaseService {
    constructor() {
        super(prisma.epic);
    }

    async findAllByProject(projectId) {
        return prisma.epic.findMany({
            where: { projectId: parseInt(projectId) },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(id) {
        const epic = await prisma.epic.findUnique({
            where: { id: parseInt(id) },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!epic) throw new Error("Epic not found");
        return epic;
    }

    async create(epicData) {
        const { projectId, ...data } = epicData;

        // Verify project exists
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId) },
        });
        if (!project) throw new Error("Project not found");

        return prisma.epic.create({
            data: {
                ...data,
                projectId: parseInt(projectId),
                ...(data.startDate && { startDate: new Date(data.startDate) }),
                ...(data.endDate && { endDate: new Date(data.endDate) }),
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async update(id, updateData) {
        const existingEpic = await prisma.epic.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingEpic) throw new Error("Epic not found");

        return prisma.epic.update({
            where: { id: parseInt(id) },
            data: {
                ...updateData,
                ...(updateData.startDate && { startDate: new Date(updateData.startDate) }),
                ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async delete(id) {
        const existingEpic = await prisma.epic.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingEpic) throw new Error("Epic not found");

        return prisma.epic.delete({
            where: { id: parseInt(id) },
        });
    }

    // Executor management methods
    async addExecutor(epicId, employeeId) {
        return prisma.$transaction(async tx => {
            // Verify epic exists
            const epic = await tx.epic.findUnique({
                where: { id: parseInt(epicId) },
            });
            if (!epic) throw new Error("Epic not found");

            // Verify employee exists
            const employee = await tx.employee.findFirst({
                where: { id: parseInt(employeeId), isActive: true },
            });
            if (!employee) throw new Error("Employee not found or inactive");

            // Check if already assigned
            const existing = await tx.epicExecutor.findUnique({
                where: {
                    epicId_employeeId: {
                        epicId: parseInt(epicId),
                        employeeId: parseInt(employeeId),
                    },
                },
            });
            if (existing) throw new Error("Employee already assigned as executor");

            return tx.epicExecutor.create({
                data: {
                    epicId: parseInt(epicId),
                    employeeId: parseInt(employeeId),
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            });
        });
    }

    async removeExecutor(epicId, employeeId) {
        const existing = await prisma.epicExecutor.findUnique({
            where: {
                epicId_employeeId: {
                    epicId: parseInt(epicId),
                    employeeId: parseInt(employeeId),
                },
            },
        });
        if (!existing) throw new Error("Executor assignment not found");

        return prisma.epicExecutor.delete({
            where: {
                epicId_employeeId: {
                    epicId: parseInt(epicId),
                    employeeId: parseInt(employeeId),
                },
            },
        });
    }

    async getExecutors(epicId) {
        const epic = await prisma.epic.findUnique({
            where: { id: parseInt(epicId) },
        });
        if (!epic) throw new Error("Epic not found");

        return prisma.epicExecutor.findMany({
            where: { epicId: parseInt(epicId) },
            include: {
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatar: true,
                        position: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        department: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { assignedAt: "desc" },
        });
    }
}

export default new EpicService();
