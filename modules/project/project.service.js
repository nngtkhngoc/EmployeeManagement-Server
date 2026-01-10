import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";

class ProjectService extends BaseService {
  constructor() {
    super(prisma.project);
  }

  async create(projectData) {
    const { employeeIds = [], managerId, ...data } = projectData;

    return prisma.$transaction(async tx => {
      // Validate manager if provided
      if (managerId) {
        const manager = await tx.employee.findFirst({
          where: { id: managerId, isActive: true },
        });
        if (!manager) {
          throw new Error("Manager not found or inactive");
        }
      }

      // Create project with manager
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: data.status,
          budget: data.budget,
          managerId: managerId || null,
        },
      });

      // Add members if provided
      if (employeeIds.length > 0) {
        await this.addMultipleEmployees(tx, project.id, employeeIds);
      }

      // Fetch and return the project with manager and members
      return tx.project.findUnique({
        where: { id: project.id },
        include: {
          manager: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              role: true,
              joinedAt: true,
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
    });
  }

  async update(where, updateData) {
    const { employeeIds, managerId, ...data } = updateData;

    return prisma.$transaction(async tx => {
      const existingProject = await tx.project.findUnique({ where });
      if (!existingProject) throw new Error("Project not found");

      // Validate manager if provided
      if (managerId !== undefined && managerId !== null) {
        const manager = await tx.employee.findFirst({
          where: { id: managerId, isActive: true },
        });
        if (!manager) {
          throw new Error("Manager not found or inactive");
        }
      }

      // Update project basic fields including manager
      const updateFields = {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      };

      // Only update managerId if it's explicitly provided in updateData
      if (managerId !== undefined) {
        updateFields.managerId = managerId;
      }

      const project = await tx.project.update({
        where,
        data: updateFields,
      });

      // Replace members if provided
      if (Array.isArray(employeeIds)) {
        await tx.projectMember.deleteMany({
          where: { projectId: project.id },
        });

        if (employeeIds.length > 0) {
          await this.addMultipleEmployees(tx, project.id, employeeIds);
        }
      }

      // Return updated project with manager and members
      return tx.project.findUnique({
        where: { id: project.id },
        include: {
          manager: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              role: true,
              joinedAt: true,
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
    });
  }

  async addEmployee(projectId, employeeId, role = "MEMBER") {
    return prisma.$transaction(async tx => {
      const project = await tx.project.findUnique({ where: { id: projectId } });
      if (!project) throw new Error("Project not found");

      const employee = await tx.employee.findFirst({
        where: { id: employeeId, isActive: true },
      });
      if (!employee) throw new Error("Employee not found or inactive");

      const exists = await tx.projectMember.findUnique({
        where: { projectId_employeeId: { projectId, employeeId } },
      });
      if (exists) throw new Error("Employee already assigned");

      return tx.projectMember.create({
        data: { projectId, employeeId, role },
        include: {
          employee: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });
    });
  }

  async removeEmployee(projectId, employeeId) {
    return prisma.projectMember.delete({
      where: { projectId_employeeId: { projectId, employeeId } },
    });
  }

  async addMultipleEmployees(tx, projectId, employeeData) {
    const employeeIds = employeeData.map(e =>
      typeof e === "object" ? e.employeeId : e
    );

    const validEmployees = await tx.employee.findMany({
      where: { id: { in: employeeIds }, isActive: true },
      select: { id: true },
    });

    if (validEmployees.length !== employeeIds.length) {
      throw new Error("Some employees not found or inactive");
    }

    return tx.projectMember.createMany({
      data: employeeData.map(emp => ({
        projectId,
        employeeId: typeof emp === "object" ? emp.employeeId : emp,
        role: typeof emp === "object" ? emp.role ?? "MEMBER" : "MEMBER",
      })),
      skipDuplicates: true,
    });
  }

  async findManyWithPagination(queryObj = {}, options = {}) {
    const { page = 1, limit = 20, sortBy, sortOrder = "asc" } = options;

    const skip = (page - 1) * parseInt(limit);
    const take = parseInt(limit);

    const queryOptions = {
      ...queryObj,
      skip,
      take,
      include: {
        manager: {
          select: {
            id: true,
            // assignedAt: true,
            // employee: {
            //   select: {
            //     id: true,
            //     fullName: true,
            //     email: true,
            //   },
            // },
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
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
    };

    if (sortBy) {
      queryOptions.orderBy = { [sortBy]: sortOrder };
    }

    const [data, total] = await Promise.all([
      prisma.project.findMany(queryOptions),
      prisma.project.count({ where: queryObj.where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new ProjectService();
