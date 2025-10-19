// import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
// import workHistoryValidation from "../../../validations/workHistory.validation.js";
// import catchAsync from "../../../common/catchAsync.js";
// import workHistoryService from "./workHistory.service.js";

// const workHistoryController = {
//   getAllWorkHistory: async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 100;

//     const { name, department, position, isActive } = req.query;

//     const filter = {};

//     if (name) {
//       filter.fullName = {
//         contains: name,
//         mode: "insensitive",
//       };
//     }

//     if (department) {
//       filter.department = {
//         name: {
//           contains: department,
//           mode: "insensitive",
//         },
//       };
//     }

//     if (position) {
//       filter.position = {
//         name: {
//           contains: position,
//           mode: "insensitive",
//         },
//       };
//     }

//     if (isActive !== undefined) {
//       filter.isActive = isActive === "true";
//     }

//     const total = await workHistoryService.repository.count({ where: filter });
//     const totalPages = Math.ceil(total / limit);

//     const skip = (page - 1) * limit;

//     const workHistorys = await workHistoryService.read({
//       where: filter,
//       skip,
//       take: limit,
//       include: {
//         department: true,
//         position: true,
//         managedDepartment: true,
//         contractsAsSigner: true,
//         contractsSigned: true,
//         workHistory: true,
//         leaveApplications: true,
//         updateRequestsMade: true,
//         updateRequestsReviewed: true,
//         payrollDetails: true,
//         attendanceDetails: true,
//         performanceDetails: true,
//         supervisedReports: true,
//       },
//       orderBy: [{ fullName: "desc" }, { createdAt: "desc" }],
//     });

//     const respondData = {
//       data: workHistorys,
//       pagination: { page, limit, total, totalPages },
//     };
//     return res.status(200).json(new SuccessResponseDto(respondData));
//   },

//   getWorkHistory: async (req, res) => {
//     const { id } = req.params;
//     const workHistory = await workHistoryService.readById(parseInt(id));

//     if (!workHistory) throw new Error("WorkHistory not found");
//     return res.status(200).json(new SuccessResponseDto(workHistory));
//   },

//   createWorkHistory: async (req, res) => {
//     const value = await workHistoryValidation
//       .createWorkHistoryValidate()
//       .validateAsync(req.body, {
//         abortEarly: false,
//       });

//     const workHistoryData = {
//       fullName: value.fullName,
//       avatar: value.avatar,
//       gender: value.gender,
//       birthday: value.birthday,
//       citizenId: value.citizenId,
//       phone: value.phone,
//       email: value.email,
//       ethnicity: value.ethnicity,
//       religion: value.religion,
//       education: value.education,
//       major: value.major,
//       siNo: value.siNo,
//       hiNo: value.hiNo,
//       departmentId: value.departmentId,
//       positionId: value.positionId,
//     };

//     const newWorkHistory = await workHistoryService.create(workHistoryData);

//     return res.status(201).json(new SuccessResponseDto(newWorkHistory));
//   },

//   deleteWorkHistory: async (req, res) => {},

//   updateWorkHistory: async (req, res) => {},
// };

// Object.entries(workHistoryController).forEach(([key, value]) => {
//   workHistoryController[key] = catchAsync(value);
// });

// export default workHistoryController;
