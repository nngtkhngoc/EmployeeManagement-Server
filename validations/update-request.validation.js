import Joi from "joi";

const updateRequestValidation = {
  createUpdateRequestValidate: () => {
    return Joi.object({
      content: Joi.string().required().messages({
        "any.required": "Nội dung đơn xin là bắt buộc",
        "string.empty": "Nội dung đơn xin không được để trống",
      }),
      requestedById: Joi.number().integer().required().messages({
        "any.required": "ID người yêu cầu là bắt buộc",
        "number.base": "ID người yêu cầu phải là số",
      }),
    });
  },

  updateUpdateRequestValidate: () => {
    return Joi.object({
      content: Joi.string().optional().messages({
        "string.empty": "Nội dung đơn xin không được để trống",
      }),
      reviewedById: Joi.number().integer().optional().messages({
        "number.base": "ID người review phải là số",
      }),
      status: Joi.string()
        .valid("PENDING", "APPROVED", "NOT_APPROVED")
        .optional()
        .messages({
          "any.only":
            "Trạng thái phải là PENDING, APPROVED hoặc NOT_APPROVED",
        }),
    });
  },

  assignReviewerValidate: () => {
    return Joi.object({
      reviewedById: Joi.number().integer().required().messages({
        "any.required": "ID người review là bắt buộc",
        "number.base": "ID người review phải là số",
      }),
    });
  },

  reviewRequestValidate: () => {
    return Joi.object({
      status: Joi.string()
        .valid("APPROVED", "NOT_APPROVED")
        .required()
        .messages({
          "any.required": "Trạng thái review là bắt buộc",
          "any.only": "Trạng thái review phải là APPROVED hoặc NOT_APPROVED",
        }),
    });
  },

  getUpdateRequestsValidate: () => {
    return Joi.object({
      status: Joi.string()
        .valid("PENDING", "APPROVED", "NOT_APPROVED")
        .optional()
        .messages({
          "any.only":
            "Trạng thái phải là PENDING, APPROVED hoặc NOT_APPROVED",
        }),
      requestedById: Joi.number().integer().optional().messages({
        "number.base": "ID người yêu cầu phải là số",
        "number.integer": "ID người yêu cầu phải là số nguyên",
      }),
      reviewedById: Joi.number().integer().optional().messages({
        "number.base": "ID người review phải là số",
        "number.integer": "ID người review phải là số nguyên",
      }),
      content: Joi.string().optional().messages({
        "string.empty": "Nội dung tìm kiếm không được để trống",
      }),
      page: Joi.number().integer().min(1).optional().messages({
        "number.base": "Trang phải là số",
        "number.integer": "Trang phải là số nguyên",
        "number.min": "Trang phải lớn hơn 0",
      }),
      limit: Joi.number().integer().min(1).max(1000).optional().messages({
        "number.base": "Số lượng bản ghi phải là số",
        "number.integer": "Số lượng bản ghi phải là số nguyên",
        "number.min": "Số lượng bản ghi phải lớn hơn 0",
        "number.max": "Số lượng bản ghi không được vượt quá 1000",
      }),
      sort: Joi.string().optional().messages({
        "string.empty": "Sắp xếp không được để trống",
      }),
      created_date_from: Joi.date().optional().messages({
        "date.base": "Ngày tạo từ không hợp lệ",
      }),
      created_date_to: Joi.date().optional().messages({
        "date.base": "Ngày tạo đến không hợp lệ",
      }),
      updated_date_from: Joi.date().optional().messages({
        "date.base": "Ngày cập nhật từ không hợp lệ",
      }),
      updated_date_to: Joi.date().optional().messages({
        "date.base": "Ngày cập nhật đến không hợp lệ",
      }),
    });
  },
};

export default updateRequestValidation;
