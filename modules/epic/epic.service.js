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
      include: {
        executors: {
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
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
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

    console.log(epicData, "!!");
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
        ...(updateData.startDate && {
          startDate: new Date(updateData.startDate),
        }),
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

  // Executor management - set all executors at once
  async setExecutors(epicId, employeeIds) {
    return prisma.$transaction(async tx => {
      // Verify epic exists
      const epic = await tx.epic.findUnique({
        where: { id: parseInt(epicId) },
      });
      if (!epic) throw new Error("Epic not found");

      // Verify all employees exist and are active
      if (employeeIds && employeeIds.length > 0) {
        const employees = await tx.employee.findMany({
          where: {
            id: { in: employeeIds.map(id => parseInt(id)) },
            isActive: true,
          },
        });
        if (employees.length !== employeeIds.length) {
          throw new Error("Some employees not found or inactive");
        }
      }

      // Delete all existing executors
      await tx.epicExecutor.deleteMany({
        where: { epicId: parseInt(epicId) },
      });

      // Add new executors if provided
      if (employeeIds && employeeIds.length > 0) {
        await tx.epicExecutor.createMany({
          data: employeeIds.map(employeeId => ({
            epicId: parseInt(epicId),
            employeeId: parseInt(employeeId),
          })),
        });
      }

      // Return updated epic with executors
      return tx.epic.findUnique({
        where: { id: parseInt(epicId) },
        include: {
          executors: {
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
          },
        },
      });
    });
  }
}

export default new EpicService();
