import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import leaveApplicationService from "./leave-application.service.js";

const leaveApplicationController = {
  async getAll(req, res) {
    const leaveApplications = await leaveApplicationService.read(
      req.body,
      req.query
    );
    res.status(200).json(new SuccessResponseDto(leaveApplications));
  },

  async getById(req, res) {
    const { applicationId } = req.params;
    const leaveApplication = await leaveApplicationService.readById(
      parseInt(applicationId)
    );

    res.status(200).json(new SuccessResponseDto(leaveApplication));
  },

  async create(req, res) {
    const { startDate, endDate, reason, employeeId, leaveTypeId } = req.body;
    const leaveApplication = await leaveApplicationService.create({
      startDate,
      endDate,
      reason,
      employeeId,
      leaveTypeId,
    });
    res.status(201).json(new SuccessResponseDto(leaveApplication));
  },

  async update(req, res) {
    const { applicationId } = req.params;

    const application = await leaveApplicationService.readById(
      parseInt(applicationId)
    );

    if (!application)
      throw new BadRequestException("Leave application not found");

    const { status, reason, employeeId, leaveTypeId, startDate, endDate } =
      req.body;
    const updated = await leaveApplicationService.update(
      { id: parseInt(applicationId) },
      { status, reason, employeeId, leaveTypeId, startDate, endDate }
    );

    res.status(201).json(new SuccessResponseDto(updated));
  },

  async delete(req, res) {
    const { applicationId } = req.params;
    const application = await leaveApplicationService.readById(
      parseInt(applicationId)
    );

    if (!application)
      throw new BadRequestException("Leave application not found");

    await leaveApplicationService.delete({ id: parseInt(applicationId) });
    res.status(200).json(new SuccessResponseDto({}));
  },
};

Object.entries(leaveApplicationController).forEach(([key, value]) => {
  leaveApplicationController[key] = catchAsync(value);
});

export default leaveApplicationController;
