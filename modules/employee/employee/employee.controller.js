import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";

import employeeValidation from "../../../validations/employee.validation.js";
import employeeService from "./employee.service.js";

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const {
        q, // Query search for employeeCode and fullName
        departmentId,
        positionId,
        isActive,
        created_date_from,
        created_date_to,
        updated_date_from,
        updated_date_to,
        page: tmpPage,
        limit: tmpLimit,
        ...personalInfor
      } = req.query;
      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const filter = {};
      const andConditions = [];

      // Filter by query (q) - search in employeeCode and fullName
      if (q) {
        const queryString = typeof q === "string" ? q.trim() : String(q).trim();
        if (queryString.length > 0) {
          andConditions.push({
            OR: [
              {
                employeeCode: {
                  contains: queryString,
                  mode: "insensitive",
                },
              },
              {
                fullName: {
                  contains: queryString,
                  mode: "insensitive",
                },
              },
            ],
          });
        }
      }

      // Filter by personal information (supports OR search)
      Object.entries(personalInfor).forEach(([key, value]) => {
        if (value) {
          const valueArray = Array.isArray(value) ? value : value.split(",");
          const orConditions = valueArray
            .filter(v => v && String(v).trim().length > 0)
            .map(v => ({
              [key]: {
                contains: String(v).trim(),
                mode: "insensitive",
              },
            }));

          if (orConditions.length > 0) {
            andConditions.push({ OR: orConditions });
          }
        }
      });

      // Filter by active status
      if (isActive !== undefined) {
        filter.isActive = isActive === "true" || isActive === true;
      }

      // Filter by departmentId (supports multiple IDs)
      if (departmentId) {
        const departmentIdArray = Array.isArray(departmentId)
          ? departmentId.map(id => parseInt(id)).filter(id => !isNaN(id))
          : typeof departmentId === "string"
          ? departmentId
              .split(",")
              .map(id => parseInt(id.trim()))
              .filter(id => !isNaN(id))
          : [];

        if (departmentIdArray.length === 1) {
          filter.departmentId = departmentIdArray[0];
        } else if (departmentIdArray.length > 1) {
          filter.departmentId = {
            in: departmentIdArray,
          };
        }
      }

      // Filter by positionId (supports multiple IDs)
      if (positionId) {
        const positionIdArray = Array.isArray(positionId)
          ? positionId.map(id => parseInt(id)).filter(id => !isNaN(id))
          : typeof positionId === "string"
          ? positionId
              .split(",")
              .map(id => parseInt(id.trim()))
              .filter(id => !isNaN(id))
          : [];

        if (positionIdArray.length === 1) {
          filter.positionId = positionIdArray[0];
        } else if (positionIdArray.length > 1) {
          filter.positionId = {
            in: positionIdArray,
          };
        }
      }

      // Filter by created date range
      if (created_date_from || created_date_to) {
        filter.createdAt = {};
        if (created_date_from) {
          const timestamp = parseInt(created_date_from);
          if (!isNaN(timestamp)) {
            filter.createdAt.gte = new Date(timestamp * 1000);
          }
        }
        if (created_date_to) {
          const timestamp = parseInt(created_date_to);
          if (!isNaN(timestamp)) {
            filter.createdAt.lte = new Date(timestamp * 1000);
          }
        }
      }

      // Note: Employee schema doesn't have updatedAt field
      // If you need updated date filtering, add updatedAt field to the Prisma schema:
      // updatedAt DateTime @updatedAt @map("updated_at")
      // Then uncomment below:
      /*
      if (updated_date_from || updated_date_to) {
        filter.updatedAt = {};
        if (updated_date_from) {
          const timestamp = parseInt(updated_date_from);
          if (!isNaN(timestamp)) {
            filter.updatedAt.gte = new Date(timestamp * 1000);
          }
        }
        if (updated_date_to) {
          const timestamp = parseInt(updated_date_to);
          if (!isNaN(timestamp)) {
            filter.updatedAt.lte = new Date(timestamp * 1000);
          }
        }
      }
      */

      // Combine all AND conditions
      if (andConditions.length > 0) {
        filter.AND = andConditions;
      }

      const options = { page, limit };
      const where = filter;
      const include = {
        department: true,
        position: true,
        managedDepartment: true,
        contractsAsSigner: true,
        contractsSigned: true,
        workHistory: true,
        leaveApplications: true,
        updateRequestsMade: true,
        updateRequestsReviewed: true,
        payrollDetails: true,
        attendanceDetails: true,
        performanceDetails: true,
        supervisedReports: true,
      };
      const employees = await employeeService.read(
        { where, include },
        {
          options,
        }
      );

      return res.status(200).json(new SuccessResponseDto(employees));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getEmployee: async (req, res) => {
    const { id } = req.params;
    const employee = await employeeService.readById(parseInt(id), {
      include: {
        department: true,
        position: true,
        managedDepartment: true,
        contractsAsSigner: true,
        contractsSigned: true,
        workHistory: true,
        leaveApplications: true,
        updateRequestsMade: true,
        updateRequestsReviewed: true,
        payrollDetails: true,
        attendanceDetails: true,
        performanceDetails: true,
        supervisedReports: true,
      },
    });

    if (!employee) throw new Error("Employee not found");
    return res.status(200).json(new SuccessResponseDto(employee));
  },

  createEmployee: async (req, res) => {
    const value = await employeeValidation
      .createEmployeeValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const employeeData = {
      fullName: value.fullName,
      avatar: value.avatar,
      gender: value.gender,
      birthday: value.birthday,
      citizenId: value.citizenId,
      phone: value.phone,
      email: value.email,
      ethnicity: value.ethnicity,
      religion: value.religion,
      education: value.education,
      major: value.major,
      siNo: value.siNo,
      hiNo: value.hiNo,
      resumeLink: value.resumeLink,
      bankAccount: value.bankAccount,
      maritalStatus: value.maritalStatus,
      permanentAddress: value.permanentAddress,
      currentAddress: value.currentAddress,
      school: value.school,
      studyPeriod: value.studyPeriod,
      degreeCertificate: value.degreeCertificate,
      foreignLanguageLevel: value.foreignLanguageLevel,
      itSkillLevel: value.itSkillLevel,
      healthCertificate: value.healthCertificate,
      // departmentId: value.departmentId,
      positionId: value.positionId,
    };

    const newEmployee = await employeeService.create(employeeData);

    return res.status(201).json(new SuccessResponseDto(newEmployee));
  },

  deleteEmployee: async (req, res) => {},

  updateEmployee: async (req, res) => {
    const value = await employeeValidation
      .updateEmployeeValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const employeeData = {
      fullName: value.fullName,
      avatar: value.avatar,
      gender: value.gender,
      birthday: value.birthday,
      citizenId: value.citizenId,
      phone: value.phone,
      email: value.email,
      ethnicity: value.ethnicity,
      religion: value.religion,
      education: value.education,
      major: value.major,
      siNo: value.siNo,
      hiNo: value.hiNo,
      resumeLink: value.resumeLink,
      bankAccount: value.bankAccount,
      maritalStatus: value.maritalStatus,
      permanentAddress: value.permanentAddress,
      currentAddress: value.currentAddress,
      school: value.school,
      studyPeriod: value.studyPeriod,
      degreeCertificate: value.degreeCertificate,
      foreignLanguageLevel: value.foreignLanguageLevel,
      itSkillLevel: value.itSkillLevel,
      healthCertificate: value.healthCertificate,
      departmentId: value.departmentId,
      positionId: value.positionId,
      workStatus: value.workStatus,
    };

    const updatedEmployee = await employeeService.update(
      parseInt(req.params.id),
      employeeData
    );

    return res.status(200).json(new SuccessResponseDto(updatedEmployee));
  },
};

Object.entries(employeeController).forEach(([key, value]) => {
  employeeController[key] = catchAsync(value);
});

export default employeeController;
