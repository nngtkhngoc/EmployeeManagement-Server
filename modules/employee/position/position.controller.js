import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";

import positionValidation from "../../../validations/position.validation.js";
import positionService from "./position.service.js";

const positionController = {
  getAllPositions: async (req, res) => {
    try {
      const {
        page: tmpPage,
        limit: tmpLimit,
        status, // Filter by status (ACTIVE or INACTIVE)
        ...positionInfor
      } = req.query;
      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const filter = {};
      const andConditions = [];

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
          filter.status = validStatuses[0];
        } else if (validStatuses.length > 1) {
          filter.status = { in: validStatuses };
        }
      }

      // Filter by other position fields (OR search for text fields)
      // Supports: name
      const textSearchFields = ["name"];
      Object.entries(positionInfor).forEach(([key, value]) => {
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
        filter.AND = andConditions;
      }

      const options = { page, limit };
      const where = filter;
      const include = {
        employees: true,
      };
      const positions = await positionService.read({ where, include }, options);

      return res.status(200).json(new SuccessResponseDto(positions));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPosition: async (req, res) => {
    const { id } = req.params;
    const position = await positionService.readById(parseInt(id), {
      include: {
        employees: true,
      },
    });

    if (!position) throw new Error("Vị trí không tồn tại.");
    return res.status(200).json(new SuccessResponseDto(position));
  },

  createPosition: async (req, res) => {
    const value = await positionValidation
      .createPositionValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const positionData = {
      name: value.name,
      status: value.status || "ACTIVE", // Default to ACTIVE if not provided
    };

    const newPosition = await positionService.create(positionData);

    return res.status(201).json(new SuccessResponseDto(newPosition));
  },

  deletePosition: async (req, res) => {
    const existingPosition = await positionService.readById(
      parseInt(req.params.id)
    );
    if (!existingPosition) throw new Error("Vị trí không tồn tại.");

    await positionService.delete({ id: parseInt(req.params.id) });

    return res.status(204).json(new SuccessResponseDto(""));
  },

  updatePosition: async (req, res) => {
    const existingPosition = await positionService.readById(
      parseInt(req.params.id)
    );

    if (!existingPosition) throw new Error("Vị trí không tồn tại.");

    const value = await positionValidation
      .updatePositionValidate()
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const positionData = {
      name: value.name,
      status: value.status, // Allow updating status
    };

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(positionData).forEach(key => {
      if (positionData[key] === undefined) {
        delete positionData[key];
      }
    });

    const updatedPosition = await positionService.update(
      { id: parseInt(req.params.id) },
      positionData
    );

    return res.status(200).json(new SuccessResponseDto(updatedPosition));
  },
};

Object.entries(positionController).forEach(([key, value]) => {
  positionController[key] = catchAsync(value);
});

export default positionController;
