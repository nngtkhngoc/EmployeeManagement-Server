import { SuccessResponseDto } from "../../../common/dtos/successResponseDto.js";
import catchAsync from "../../../common/catchAsync.js";
import positionService from "./position.service.js";
import positionValidation from "../../../validations/position.validation.js";

const positionController = {
  getAllPositions: async (req, res) => {
    try {
      const { page: tmpPage, limit: tmpLimit, ...positionInfor } = req.query;
      const page = parseInt(tmpPage) || 1;
      const limit = parseInt(tmpLimit) || 100;

      const filter = {};

      Object.entries(positionInfor).forEach(([key, value]) => {
        if (value) {
          const valueArray = Array.isArray(value) ? value : value.split(",");
          filter.OR = valueArray.map(v => ({
            [key]: {
              contains: v,
              mode: "insensitive",
            },
          }));
        }
      });

      const options = { page, limit };
      const where = filter;
      const include = {
        employees: true,
      };
      const positions = await positionService.read(
        { where, include },
        {
          options,
        }
      );

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
      positionCode: value.positionCode,
      name: value.name,
      foundedAt: value.foundedAt,
      description: value.description,
      managerId: value.managerId,
    };

    const newPosition = await positionService.create(positionData);

    return res.status(201).json(new SuccessResponseDto(newPosition));
  },

  deletePosition: async (req, res) => {
    const existingDept = await positionService.readById(
      parseInt(req.params.id)
    );
    if (!existingDept) throw new Error("Phòng ban không tồn tại.");

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
    };

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
