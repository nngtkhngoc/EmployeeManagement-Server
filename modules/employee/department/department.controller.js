import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";

import departmentValidation from "../../../validations/department.validation.js";
import departmentService from "./department.service.js";

const departmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const {
        q, // Query search for departmentCode and name
        page: tmpPage,
        limit: tmpLimit,
        managerId,
        status, // Filter by status (ACTIVE or INACTIVE)
        created_at_from,
        created_at_to,
        created_date_from, // Legacy support
        created_date_to, // Legacy support
        updated_at_from,
        updated_at_to,
        updated_by_from, // Note: Department doesn't have updatedBy field, treating as updated_at
        updated_by_to, // Note: Department doesn't have updatedBy field, treating as updated_at
        ...departmentInfor
      } = req.query;

      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const where = {};
      const andConditions = [];

      // Filter by query (q) - search in departmentCode and name
      if (q) {
        const queryString = typeof q === "string" ? q.trim() : String(q).trim();
        if (queryString.length > 0) {
          andConditions.push({
            OR: [
              {
                departmentCode: {
                  contains: queryString,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: queryString,
                  mode: "insensitive",
                },
              },
            ],
          });
        }
      }

      // Filter by status
      if (status) {
        const statusArray = Array.isArray(status)
          ? status
          : typeof status === "string"
          ? status.split(",").map(s => s.trim().toUpperCase())
          : [];

        const validStatuses = statusArray.filter(
          s => s === "ACTIVE" || s === "INACTIVE"
        );

        if (validStatuses.length === 1) {
          where.status = validStatuses[0];
        } else if (validStatuses.length > 1) {
          where.status = { in: validStatuses };
        }
      }

      // Filter by managerId (exact match or comma-separated list or array)
      if (managerId) {
        const managerIds = Array.isArray(managerId)
          ? managerId.map(id => parseInt(id)).filter(id => !isNaN(id))
          : typeof managerId === "string"
          ? managerId
              .split(",")
              .map(id => parseInt(id.trim()))
              .filter(id => !isNaN(id))
          : [];

        if (managerIds.length === 1) {
          where.managerId = managerIds[0];
        } else if (managerIds.length > 1) {
          where.managerId = { in: managerIds };
        }
      }

      // Filter by created date range (support both naming conventions)
      const createdFrom = created_at_from || created_date_from || undefined;
      const createdTo = created_at_to || created_date_to || undefined;

      if (createdFrom || createdTo) {
        const createdAtFilter = {};
        if (createdFrom) {
          const timestamp = parseInt(createdFrom);
          if (!isNaN(timestamp)) {
            createdAtFilter.gte = new Date(timestamp * 1000);
          }
        }
        if (createdTo) {
          const timestamp = parseInt(createdTo);
          if (!isNaN(timestamp)) {
            createdAtFilter.lte = new Date(timestamp * 1000);
          }
        }
        if (Object.keys(createdAtFilter).length > 0) {
          where.createdAt = createdAtFilter;
        }
      }

      // Filter by updated date range
      // Note: Department model doesn't have updatedAt field in Prisma schema
      // To enable this filter, add: updatedAt DateTime @updatedAt @map("updated_at") to Department model
      // For now, we'll prepare the filter structure but it won't work until schema is updated
      const updatedFrom = updated_at_from || updated_by_from || undefined;
      const updatedTo = updated_at_to || updated_by_to || undefined;

      if (updatedFrom || updatedTo) {
        // Uncomment this block after adding updatedAt to Department schema
        // const updatedAtFilter = {};
        // if (updatedFrom) {
        //   const timestamp = parseInt(updatedFrom);
        //   if (!isNaN(timestamp)) {
        //     updatedAtFilter.gte = new Date(timestamp * 1000);
        //   }
        // }
        // if (updatedTo) {
        //   const timestamp = parseInt(updatedTo);
        //   if (!isNaN(timestamp)) {
        //     updatedAtFilter.lte = new Date(timestamp * 1000);
        //   }
        // }
        // if (Object.keys(updatedAtFilter).length > 0) {
        //   where.updatedAt = updatedAtFilter;
        // }

        // For now, log a warning that this filter requires schema changes
        console.warn(
          "Warning: updated_at_from/updated_at_to filters require updatedAt field in Department schema"
        );
      }

      // Filter by other department fields (OR search for text fields)
      // Supports: name, departmentCode, description
      const textSearchFields = ["name", "departmentCode", "description"];
      Object.entries(departmentInfor).forEach(([key, value]) => {
        if (value && textSearchFields.includes(key)) {
          const valueArray = Array.isArray(value)
            ? value
            : value.split(",").map(v => v.trim());
          const orConditions = valueArray
            .filter(v => v && v.length > 0)
            .map(v => ({
              [key]: {
                contains: v,
                mode: "insensitive",
              },
            }));

          if (orConditions.length > 0) {
            andConditions.push({ OR: orConditions });
          }
        }
      });

      // Combine all conditions
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      const options = { page, limit };
      const include = {
        manager: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            avatar: true,
            email: true,
            phone: true,
          },
        },
        employees: true,
      };

      const departments = await departmentService.read(
        { where, include },
        { options }
      );

      return res.status(200).json(new SuccessResponseDto(departments));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getDepartment: async (req, res) => {
    const { id } = req.params;
    const department = await departmentService.readById(parseInt(id), {
      include: {
        manager: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            avatar: true,
            email: true,
            phone: true,
          },
        },
        employees: true,
      },
    });

    if (!department) throw new Error("Phòng ban không tồn tại.");
    return res.status(200).json(new SuccessResponseDto(department));
  },

  createDepartment: async (req, res) => {
    const value = await departmentValidation
      .createDepartmentValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const departmentData = {
      departmentCode: value.departmentCode,
      name: value.name,
      foundedAt: value.foundedAt,
      description: value.description,
      managerId: value.managerId,
      status: value.status || "ACTIVE", // Default to ACTIVE if not provided
    };

    const newDepartment = await departmentService.create(departmentData);

    return res.status(201).json(new SuccessResponseDto(newDepartment));
  },

  deleteDepartment: async (req, res) => {
    const existingDept = await departmentService.readById(
      parseInt(req.params.id)
    );
    if (!existingDept) throw new Error("Phòng ban không tồn tại.");

    await departmentService.delete({ id: parseInt(req.params.id) });

    return res.status(204).json(new SuccessResponseDto(""));
  },

  updateDepartment: async (req, res) => {
    const value = await departmentValidation
      .updateDepartmentValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const departmentData = {
      departmentCode: value.departmentCode,
      name: value.name,
      foundedAt: value.foundedAt,
      description: value.description,
      managerId: value.managerId,
      status: value.status, // Allow updating status
    };

    const updatedDepartment = await departmentService.update(
      parseInt(req.params.id),
      departmentData
    );

    return res.status(200).json(new SuccessResponseDto(updatedDepartment));
  },
};

Object.entries(departmentController).forEach(([key, value]) => {
  departmentController[key] = catchAsync(value);
});

export default departmentController;
