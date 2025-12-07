import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import contractService from "./contract.service.js";
import * as contractValidation from "../../validations/contract.validation.js";

const contractController = {
  async getAllContracts(req, res) {
    const query = await contractValidation.contractQuerySchema.validateAsync(
      req.query,
      {
        abortEarly: false,
      }
    );

    // Build where clause from query params
    const where = {};
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.signedById) where.signedById = query.signedById;

    const contracts = await contractService.read({ where }, req.query);
    res.status(200).json(new SuccessResponseDto(contracts));
  },
  async getContractById(req, res) {
    const contractId = parseInt(req.params.id, 10);
    const contract = await contractService.readById(contractId);
    if (!contract) throw new BadRequestException("Hợp đồng không tồn tại");
    res.status(200).json(new SuccessResponseDto(contract));
  },

  async createContract(req, res) {
    const contractData =
      await contractValidation.createContractSchema.validateAsync(req.body, {
        abortEarly: false,
      });

    // Nếu có file upload, lưu URL từ Cloudinary
    if (req.file) {
      contractData.attachment = req.file.path; // Cloudinary trả về path là URL
    }

    const newContract = await contractService.create(contractData);
    res.status(201).json(new SuccessResponseDto(newContract));
  },

  async updateContract(req, res) {
    const id = parseInt(req.params.id, 10);
    const contractData =
      await contractValidation.updateContractSchema.validateAsync(req.body, {
        abortEarly: false,
      });

    // Nếu có file upload mới, lưu URL từ Cloudinary
    if (req.file) {
      contractData.attachment = req.file.path; // Cloudinary trả về path là URL

      // Nếu có file cũ, có thể xóa khỏi Cloudinary (optional)
      // const oldContract = await contractService.readById(id);
      // if (oldContract?.attachment) {
      //   // Extract public_id từ URL và xóa
      //   const publicId = extractPublicIdFromUrl(oldContract.attachment);
      //   await cloudinary.uploader.destroy(publicId);
      // }
    }

    const updated = await contractService.update(id, contractData);
    res.status(200).json(new SuccessResponseDto(updated));
  },

  async deleteContract(req, res) {
    const id = parseInt(req.params.id, 10);
    const deleted = await contractService.delete(id);
    if (!deleted) throw new BadRequestException("Hợp đồng không tồn tại");
    res.status(200).json(new SuccessResponseDto({}));
  },

  async updateContractStatus(req, res) {
    const id = parseInt(req.params.id, 10);
    const { status } =
      await contractValidation.updateContractStatusSchema.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      );
    const updated = await contractService.updateStatus(id, status);
    res.status(200).json(new SuccessResponseDto(updated));
  },

  async getContractsByEmployee(req, res) {
    const employeeId = parseInt(req.params.employeeId, 10);
    const contracts = await contractService.readByEmployee(employeeId);
    res.status(200).json(new SuccessResponseDto(contracts));
  },

  async getContractsByManager(req, res) {
    const managerId = parseInt(req.params.managerId, 10);
    const contracts = await contractService.readByManager(managerId);
    res.status(200).json(new SuccessResponseDto(contracts));
  },

  async renewContract(req, res) {
    const id = parseInt(req.params.id, 10);
    const renewData =
      await contractValidation.renewContractSchema.validateAsync(req.body, {
        abortEarly: false,
      });
    const renewed = await contractService.renew(id, renewData);
    res.status(201).json(new SuccessResponseDto(renewed));
  },

  async getContractStats(req, res) {
    const stats = await contractService.getStats();
    res.status(200).json(new SuccessResponseDto(stats));
  },

  async updateExpiredContracts(req, res) {
    const result = await contractService.updateExpiredContracts();
    res.status(200).json(
      new SuccessResponseDto({
        message: `Đã cập nhật ${result.updated} hợp đồng hết hạn`,
        ...result,
      })
    );
  },
};

Object.entries(contractController).forEach(([key, value]) => {
  contractController[key] = catchAsync(value);
});

export default contractController;
