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
  contractCode: Joi.string().trim().max(10).required().messages({
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
    .required()
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
    .optional(),
  status: Joi.string()
    .valid(...ContractStatusEnum)
    .optional(),
  employeeId: Joi.number().integer().optional(),
  signedById: Joi.number().integer().optional(),
  q: Joi.string().allow("").optional(),
  //page: Joi.number().integer().min(1).default(1),
  //limit: Joi.number().integer().min(1).max(100).default(10),
});
