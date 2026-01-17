import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class TaskService extends BaseService {
  constructor() {
    super(prisma.task);
  }

  async findAllByEpic(epicId) {
    return prisma.task.findMany({
      where: {
        epicId: parseInt(epicId),
        parentTaskId: null, // Only root tasks
      },
      include: {
        subtasks: true,
        assignments: {
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
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id) {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        epic: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            name: true,
          },
        },
        subtasks: {
          include: {
            assignments: {
              include: {
                employee: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        assignments: {
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
              },
            },
          },
        },
      },
    });
    if (!task) throw new Error("Task not found");
    return task;
  }

  async create(taskData) {
    const { epicId, parentTaskId, ...data } = taskData;
    console.log(parentTaskId, "parentTaskId");
    // Verify epic exists
    const epic = await prisma.epic.findUnique({
      where: { id: parseInt(epicId) },
    });
    if (!epic) throw new Error("Epic not found");

    // Verify parent task if provided
    if (parentTaskId) {
      const parentTask = await prisma.task.findUnique({
        where: { id: parseInt(parentTaskId) },
      });
      if (!parentTask) throw new Error("Parent task not found");
      if (parentTask.epicId !== parseInt(epicId)) {
        throw new Error("Parent task must belong to the same epic");
      }
    }

    return prisma.task.create({
      data: {
        ...data,
        epicId: parseInt(epicId),
        parentTaskId: parentTaskId ? parseInt(parentTaskId) : null,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      },
      include: {
        epic: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id, updateData) {
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingTask) throw new Error("Task not found");

    return prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        ...(updateData.startDate && {
          startDate: new Date(updateData.startDate),
        }),
        ...(updateData.dueDate && { dueDate: new Date(updateData.dueDate) }),
      },
      include: {
        epic: {
          select: {
            id: true,
            name: true,
          },
        },
        assignments: {
          include: {
            employee: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id) {
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingTask) throw new Error("Task not found");

    return prisma.task.delete({
      where: { id: parseInt(id) },
    });
  }

  // Assignment management - set all assignments at once
  async setAssignments(taskId, employeeIds) {
    return prisma.$transaction(async tx => {
      const task = await tx.task.findUnique({
        where: { id: parseInt(taskId) },
      });
      if (!task) throw new Error("Task not found");

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

      // Delete all existing assignments
      await tx.taskAssignment.deleteMany({
        where: { taskId: parseInt(taskId) },
      });

      // Add new assignments if provided
      console.log(employeeIds, "@employeeIds");
      if (employeeIds && employeeIds.length > 0) {
        await tx.taskAssignment.createMany({
          data: employeeIds.map(employeeId => ({
            taskId: parseInt(taskId),
            employeeId: parseInt(employeeId),
          })),
        });
      }

      // Return updated task with assignments
      return tx.task.findUnique({
        where: { id: parseInt(taskId) },
        include: {
          assignments: {
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

export default new TaskService();
