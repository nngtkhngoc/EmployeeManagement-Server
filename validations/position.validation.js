import Joi from "joi";

const positionValidation = {
  createPositionValidate: () => {
    return Joi.object({
      name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s&]+$/)
        .required()
        .messages({
          "any.required": "Tên vị trí là bắt buộc",
          "string.empty": "Tên vị trí không được để trống",
          "string.min": "Tên vị trí phải có ít nhất 3 ký tự",
          "string.max": "Tên vị trí không được quá 100 ký tự",
          "string.pattern.base":
            "Tên vị trí chỉ được chứa chữ cái, khoảng trắng và dấu &",
        }),
    });
  },

  updatePositionValidate: () => {
    return Joi.object({
      name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s&]+$/)
        .optional()
        .messages({
          "string.empty": "Tên vị trí không được để trống",
          "string.min": "Tên vị trí phải có ít nhất 3 ký tự",
          "string.max": "Tên vị trí không được quá 100 ký tự",
          "string.pattern.base":
            "Tên vị trí chỉ được chứa chữ cái, khoảng trắng và dấu &",
        }),
    });
  },
};

export default positionValidation;
