import Joi from "joi";

export const ContractTypeEnum = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "PROBATION",
  "TEMPORARY",
  "FREELANCE",
  "OUTSOURCE",
];

export const ContractStatusEnum = [
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
  "PENDING",
  "RENEWED",
];

export const createContractSchema = Joi.object({
  contractCode: Joi.string().trim().max(10).optional().messages({
    "string.empty": "Mã hợp đồng không được để trống",
    "string.max": "Mã hợp đồng tối đa 10 ký tự",
  }),

  type: Joi.string()
    .valid(...ContractTypeEnum)
    .required()
    .messages({ "any.only": "Loại hợp đồng không hợp lệ" }),

  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  signedDate: Joi.date().required(),

  status: Joi.string()
    .valid(...ContractStatusEnum)
    .default("PENDING")
    .messages({ "any.only": "Trạng thái hợp đồng không hợp lệ" }),

  dailySalary: Joi.number()
    .positive()
    .required()
    .messages({ "number.positive": "Lương ngày phải là số dương" }),

  allowance: Joi.number().min(0).default(0),

  note: Joi.string().allow("").optional(),
  attachment: Joi.string().uri().optional(),

  employeeId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({ "number.base": "employeeId phải là số" }),

  signedById: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({ "number.base": "signedById phải là số" }),
});

export const updateContractSchema = createContractSchema.fork(
  Object.keys(createContractSchema.describe().keys),
  schema => schema.optional()
);

export const updateContractStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...ContractStatusEnum)
    .required()
    .messages({ "any.only": "Trạng thái hợp đồng không hợp lệ" }),
});

export const renewContractSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "any.required": "Ngày bắt đầu là bắt buộc",
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),
  endDate: Joi.date().required().messages({
    "any.required": "Ngày kết thúc là bắt buộc",
    "date.base": "Ngày kết thúc không hợp lệ",
  }),
  signedDate: Joi.date().required().messages({
    "any.required": "Ngày ký là bắt buộc",
    "date.base": "Ngày ký không hợp lệ",
  }),
  dailySalary: Joi.number().positive().required().messages({
    "any.required": "Lương ngày là bắt buộc",
    "number.positive": "Lương ngày phải là số dương",
  }),
  allowance: Joi.number().min(0).default(0).messages({
    "number.min": "Phụ cấp không được âm",
  }),
  note: Joi.string().allow("").optional(),
});

export const contractQuerySchema = Joi.object({
  type: Joi.string()
    .valid(...ContractTypeEnum)
    .optional()
    .messages({
      "any.only": "Loại hợp đồng không hợp lệ",
    }),
  status: Joi.string()
    .valid(...ContractStatusEnum)
    .optional()
    .messages({
      "any.only": "Trạng thái hợp đồng không hợp lệ",
    }),
  employeeId: Joi.number().integer().optional().messages({
    "number.base": "ID nhân viên phải là số",
    "number.integer": "ID nhân viên phải là số nguyên",
  }),
  signedById: Joi.number().integer().optional().messages({
    "number.base": "ID người ký phải là số",
    "number.integer": "ID người ký phải là số nguyên",
  }),
  contractCode: Joi.string().optional().messages({
    "string.empty": "Mã hợp đồng không được để trống",
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
  start_date_from: Joi.date().optional().messages({
    "date.base": "Ngày bắt đầu từ không hợp lệ",
  }),
  start_date_to: Joi.date().optional().messages({
    "date.base": "Ngày bắt đầu đến không hợp lệ",
  }),
  end_date_from: Joi.date().optional().messages({
    "date.base": "Ngày kết thúc từ không hợp lệ",
  }),
  end_date_to: Joi.date().optional().messages({
    "date.base": "Ngày kết thúc đến không hợp lệ",
  }),
  created_date_from: Joi.date().optional().messages({
    "date.base": "Ngày tạo từ không hợp lệ",
  }),
  created_date_to: Joi.date().optional().messages({
    "date.base": "Ngày tạo đến không hợp lệ",
  }),
});
