import Joi from "joi";

const departmentValidation = {
  createDepartmentValidate: () => {
    return Joi.object({
      departmentCode: Joi.string()
        .trim()
        .alphanum()
        .min(2)
        .max(4)
        .required()
        .messages({
          "any.required": "Mã phòng ban là bắt buộc",
          "string.empty": "Mã phòng ban không được để trống",
          "string.alphanum": "Mã phòng ban chỉ được chứa chữ và số",
          "string.min": "Mã phòng ban phải có ít nhất 2 ký tự",
          "string.max": "Mã phòng ban không được quá 4 ký tự",
        }),

      name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s&]+$/)
        .required()
        .messages({
          "any.required": "Tên phòng ban là bắt buộc",
          "string.empty": "Tên phòng ban không được để trống",
          "string.min": "Tên phòng ban phải có ít nhất 3 ký tự",
          "string.max": "Tên phòng ban không được quá 100 ký tự",
          "string.pattern.base":
            "Tên phòng ban chỉ được chứa chữ cái, khoảng trắng và dấu &",
        }),

      foundedAt: Joi.date().max("now").required().messages({
        "any.required": "Ngày thành lập là bắt buộc",
        "date.max": "Ngày thành lập phải nhỏ hơn hoặc bằng ngày hiện tại",
      }),

      description: Joi.string().allow(null, "").max(500).optional().messages({
        "string.max": "Mô tả không được quá 500 ký tự",
      }),

      managerId: Joi.number().integer().allow(null).optional().messages({
        "number.base": "Mã người quản lý phải là số nguyên",
      }),

      status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .optional()
        .messages({
          "any.only": "Trạng thái phòng ban phải là ACTIVE hoặc INACTIVE",
        }),
    });
  },

  updateDepartmentValidate: () => {
    return Joi.object({
      departmentCode: Joi.string()
        .trim()
        .alphanum()
        .min(2)
        .max(4)
        .optional()
        .messages({
          "string.alphanum": "Mã phòng ban chỉ được chứa chữ và số",
          "string.min": "Mã phòng ban phải có ít nhất 2 ký tự",
          "string.max": "Mã phòng ban không được quá 4 ký tự",
        }),

      name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s&]+$/)
        .optional()
        .messages({
          "string.empty": "Tên phòng ban không được để trống",
          "string.min": "Tên phòng ban phải có ít nhất 3 ký tự",
          "string.max": "Tên phòng ban không được quá 100 ký tự",
          "string.pattern.base":
            "Tên phòng ban chỉ được chứa chữ cái, khoảng trắng và dấu &",
        }),

      foundedAt: Joi.date().max("now").optional().messages({
        "date.max": "Ngày thành lập phải nhỏ hơn hoặc bằng ngày hiện tại",
      }),

      description: Joi.string().allow(null, "").max(500).optional().messages({
        "string.max": "Mô tả không được quá 500 ký tự",
      }),

      managerId: Joi.number().integer().allow(null).optional().messages({
        "number.base": "Mã người quản lý phải là số nguyên",
      }),

      status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .optional()
        .messages({
          "any.only": "Trạng thái phòng ban phải là ACTIVE hoặc INACTIVE",
        }),
    });
  },
};

export default departmentValidation;
