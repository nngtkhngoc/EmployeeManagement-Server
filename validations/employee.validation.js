import Joi from "joi";

const employeeValidation = {
  createEmployeeValidate: () => {
    return Joi.object({
      fullName: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
        .required()
        .messages({
          "any.required": "Tên nhân viên là bắt buộc",
          "string.empty": "Tên nhân viên không được để trống",
          "string.min": "Tên nhân viên phải lớn hơn 3 kí tự",
          "string.max": "Tên nhân viên phải ít hơn 100 kí tự",
          "string.pattern.base":
            "Tên nhân viên chỉ được chứa chữ cái và khoảng trắng",
        }),
      avatar: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Avatar phải là URL hợp lệ",
      }),
      gender: Joi.string()
        .valid("MALE", "FEMALE", "OTHER")
        .required()
        .messages({
          "any.required": "Giới tính của nhân viên là bắt buộc",
          "any.only": "Giới tính phải là MALE, FEMALE hoặc OTHER",
          "string.empty": "Giới tính của nhân viên không được để trống",
        }),
      birthday: Joi.date().less("now").required().messages({
        "any.required": "Sinh nhật của nhân viên là bắt buộc",
        "date.less": "Sinh nhật phải nhỏ hơn ngày hiện tại",
      }),
      citizenId: Joi.string()
        .pattern(/^[0-9]{9,12}$/)
        .required()
        .messages({
          "any.required": "CCCD của nhân viên là bắt buộc",
          "string.empty": "CCCD của nhân viên không được để trống",
          "string.pattern.base": "CCCD chỉ được chứa 9-12 chữ số",
        }),
      phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
          "any.required": "Số điện thoại là bắt buộc",
          "string.pattern.base": "Số điện thoại không hợp lệ",
        }),
      email: Joi.string().email().required().messages({
        "any.required": "Email là bắt buộc",
        "string.email": "Email không hợp lệ",
      }),
      ethnicity: Joi.string().max(50).optional().messages({
        "string.max": "Dân tộc không được quá 50 kí tự",
      }),
      religion: Joi.string().max(50).optional().messages({
        "string.max": "Tôn giáo không được quá 50 kí tự",
      }),
      education: Joi.string()
        .valid(
          "HIGH_SCHOOL",
          "ASSOCIATE_DEGREE",
          "BACHELOR_DEGREE",
          "MASTER_DEGREE",
          "DOCTORATE_DEGREE",
          "POST_DOCTORAL",
          "VOCATIONAL_TRAINING",
          "OTHER"
        )
        .required()
        .messages({
          "any.required": "Trình độ học vấn là bắt buộc",
          "any.only": "Trình độ học vấn không hợp lệ",
        }),
      major: Joi.string().max(100).optional().messages({
        "string.max": "Ngành học không được quá 100 kí tự",
      }),
      siNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          "any.required": "Số sổ BHXH là bắt buộc",
          "string.pattern.base": "Số sổ BHXH phải đúng 10 chữ số",
        }),
      hiNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          "any.required": "Số thẻ BHYT là bắt buộc",
          "string.pattern.base": "Số thẻ BHYT phải đúng 10 chữ số",
        }),
      departmentId: Joi.number().integer().required().messages({
        "any.required": "Phòng ban là bắt buộc",
        "number.base": "Phòng ban phải là số",
      }),
      positionId: Joi.number().integer().required().messages({
        "any.required": "Chức vụ là bắt buộc",
        "number.base": "Chức vụ phải là số",
      }),
    });
  },
};

export default employeeValidation;
