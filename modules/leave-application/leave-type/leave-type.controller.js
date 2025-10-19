import catchAsync from "../../../common/catchAsync.js";
import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../../common/exceptions/exception.js";
import leaveTypeService from "./leave-type.service.js";

const leaveTypeController = {
  async getAll(req, res) {
    const leaveTypes = await leaveTypeService.read();
    res.status(200).json(new SuccessResponseDto(leaveTypes));
  },

  async getById(req, res) {
    const { id } = req.params;
    const leaveType = await leaveTypeService.readById(parseInt(id));
    if (!leaveType) throw new BadRequestException("Leave type not found");
    res.status(200).json(new SuccessResponseDto(leaveType));
  },

  async create(req, res) {
    const { name, maxDays } = req.body;
    const leaveType = await leaveTypeService.create({ name, maxDays });
    res.status(201).json(new SuccessResponseDto(leaveType));
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, maxDays } = req.body;
    const leaveType = await leaveTypeService.readById(parseInt(id));
    if (!leaveType) throw new BadRequestException("Leave type not found");
    const updated = await leaveTypeService.update(
      { id: parseInt(id) },
      { name, maxDays }
    );
    res.status(200).json(new SuccessResponseDto(updated));
  },

  async delete(req, res) {
    const { id } = req.params;
    const leaveType = await leaveTypeService.readById(parseInt(id));
    if (!leaveType) throw new BadRequestException("Leave type not found");
    await leaveTypeService.delete({ id: parseInt(id) });
    res.status(200).json(new SuccessResponseDto({}));
  },
};

Object.entries(leaveTypeController).forEach(([key, value]) => {
  leaveTypeController[key] = catchAsync(value);
});

export default leaveTypeController;
