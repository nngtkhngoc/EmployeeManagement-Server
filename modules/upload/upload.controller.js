import catchAsync from "../../common/catchAsync.js";
import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

const uploadController = {
  uploadSingle: async (req, res) => {
    if (!req.file) {
      throw new BadRequestException("Vui lòng upload file");
    }

    // CloudinaryStorage trả về URL trong req.file.path
    const fileUrl = req.file.path;

    return res.status(200).json(
      new SuccessResponseDto({
        url: fileUrl,
        file_name: req.file.filename,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      })
    );
  },

  uploadMultiple: async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new BadRequestException("Vui lòng upload ít nhất một file");
    }

    const files = req.files.map((file) => ({
      url: file.path,
      file_name: file.filename,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    return res.status(200).json(new SuccessResponseDto({ files }));
  },
};

Object.entries(uploadController).forEach(([key, value]) => {
  uploadController[key] = catchAsync(value);
});

export default uploadController;

