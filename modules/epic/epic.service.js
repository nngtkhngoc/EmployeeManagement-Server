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
}

export default new EpicService();
