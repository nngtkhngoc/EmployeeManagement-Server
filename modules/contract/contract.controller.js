import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import contractService from "./contract.service.js";
import * as contractValidation from "../../validations/contract.validation.js";

const contractController = {
  async getAllContracts(req, res) {
    // Pre-parse query params to convert string numbers to numbers
    const query = { ...req.query };
    if (query.page) query.page = parseInt(query.page) || query.page;
    if (query.limit) query.limit = parseInt(query.limit) || query.limit;
    if (query.employeeId)
      query.employeeId = parseInt(query.employeeId) || query.employeeId;
    if (query.signedById)
      query.signedById = parseInt(query.signedById) || query.signedById;

    const validatedQuery = await contractValidation.contractQuerySchema.validateAsync(
      query,
      {
        abortEarly: false,
      }
    );

    // Extract pagination and sorting params
    const {
      page: tmpPage,
      limit: tmpLimit,
      sort: tmpSort,
      ...filterParams
    } = validatedQuery;

    // Parse page and limit, ensure they are valid numbers
    let page = 1;
    if (tmpPage !== undefined && tmpPage !== null) {
      const parsedPage = parseInt(tmpPage);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }

    let limit = 20;
    if (tmpLimit !== undefined && tmpLimit !== null) {
      const parsedLimit = parseInt(tmpLimit);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // Parse sort: format "field:asc" or "field:desc" or just "field" (default asc)
    // Use actual Prisma field names from schema
    const validSortFields = [
      "id",
      "contractCode",
      "type",
      "status",
      "startDate",
      "endDate",
      "signedDate",
      "createdAt",
      "updatedAt",
      "employeeId",
      "signedById",
    ];

    let sortBy = "createdAt"; // Default to createdAt
    let sortOrder = "desc";
    if (tmpSort && typeof tmpSort === "string" && tmpSort.trim() !== "") {
      const sortParts = tmpSort.split(":");
      if (sortParts[0] && sortParts[0].trim() !== "") {
        const field = sortParts[0].trim();
        // Use field as-is if valid, otherwise default to createdAt
        sortBy = validSortFields.includes(field) ? field : "createdAt";
        if (
          sortParts[1] &&
          (sortParts[1].toLowerCase() === "desc" ||
            sortParts[1].toLowerCase() === "asc")
        ) {
          sortOrder = sortParts[1].toLowerCase();
        } else {
          sortOrder = "asc";
        }
      }
    }

    // Build options for baseService.read
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    try {
      const contracts = await contractService.read(filterParams, options);
      res.status(200).json(new SuccessResponseDto(contracts));
    } catch (error) {
      console.error("Error in getAllContracts:", error);
      throw error;
    }
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

  async extractContractFromPDF(req, res) {
    if (!req.file) {
      throw new BadRequestException("Vui lòng upload file PDF");
    }

    // Check if file is PDF
    if (req.file.mimetype !== "application/pdf") {
      throw new BadRequestException("Chỉ chấp nhận file PDF");
    }

    // Get file buffer from memory storage
    const fileBuffer = req.file.buffer;

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException("File PDF không hợp lệ");
    }

    // Extract contract info using AI agent
    const { extractContractInfoFromPDF } = await import("../../ai/agent.js");
    const contractInfo = await extractContractInfoFromPDF(fileBuffer);

    res.status(200).json(new SuccessResponseDto(contractInfo));
  },
};

Object.entries(contractController).forEach(([key, value]) => {
  contractController[key] = catchAsync(value);
});

export default contractController;
