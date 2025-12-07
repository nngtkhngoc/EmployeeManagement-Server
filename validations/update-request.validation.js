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
      }),
      reviewedById: Joi.number().integer().optional().messages({
        "number.base": "ID người review phải là số",
      }),
    });
  },
};

export default updateRequestValidation;
