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
      resumeLink: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link sơ yếu lí lịch phải là URL hợp lệ",
      }),
      bankAccount: Joi.string().allow(null).max(500).optional().messages({
        "string.max": "Thông tin tài khoản ngân hàng không được quá 500 kí tự",
      }),
      maritalStatus: Joi.string()
        .valid("SINGLE", "MARRIED", "DIVORCED", "WIDOWED")
        .allow(null)
        .optional()
        .messages({
          "any.only": "Tình trạng hôn nhân không hợp lệ",
        }),
      permanentAddress: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Địa chỉ thường trú không được quá 255 kí tự",
      }),
      currentAddress: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Địa chỉ hiện tại không được quá 255 kí tự",
      }),
      school: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Tên trường không được quá 255 kí tự",
      }),
      studyPeriod: Joi.string().allow(null).max(50).optional().messages({
        "string.max": "Thời gian học không được quá 50 kí tự",
      }),
      degreeCertificate: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link bằng cấp phải là URL hợp lệ",
      }),
      foreignLanguageLevel: Joi.string().allow(null).max(100).optional().messages({
        "string.max": "Trình độ ngoại ngữ không được quá 100 kí tự",
      }),
      itSkillLevel: Joi.string().allow(null).max(100).optional().messages({
        "string.max": "Trình độ tin học không được quá 100 kí tự",
      }),
      healthCertificate: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link giấy khám sức khỏe phải là URL hợp lệ",
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
  updateEmployeeValidate: () => {
    return Joi.object({
      fullName: Joi.string()
        .optional()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
        .messages({
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
        .optional()
        .valid("MALE", "FEMALE", "OTHER")
        .messages({
          "any.only": "Giới tính phải là MALE, FEMALE hoặc OTHER",
          "string.empty": "Giới tính của nhân viên không được để trống",
        }),
      birthday: Joi.date().optional().less("now").messages({
        "date.less": "Sinh nhật phải nhỏ hơn ngày hiện tại",
      }),
      citizenId: Joi.string()
        .optional()
        .pattern(/^[0-9]{9,12}$/)
        .messages({
          "string.empty": "CCCD của nhân viên không được để trống",
          "string.pattern.base": "CCCD chỉ được chứa 9-12 chữ số",
        }),
      phone: Joi.string()
        .optional()
        .pattern(/^[0-9]{10,15}$/)
        .messages({
          "string.pattern.base": "Số điện thoại không hợp lệ",
        }),
      email: Joi.string().optional().email().messages({
        "string.email": "Email không hợp lệ",
      }),
      ethnicity: Joi.string().optional().max(50).messages({
        "string.max": "Dân tộc không được quá 50 kí tự",
      }),
      religion: Joi.string().optional().max(50).messages({
        "string.max": "Tôn giáo không được quá 50 kí tự",
      }),
      education: Joi.string()
        .optional()
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
        .messages({
          "any.only": "Trình độ học vấn không hợp lệ",
        }),
      major: Joi.string().optional().max(100).optional().messages({
        "string.max": "Ngành học không được quá 100 kí tự",
      }),
      siNo: Joi.string()
        .optional()
        .pattern(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": "Số sổ BHXH phải đúng 10 chữ số",
        }),
      hiNo: Joi.string()
        .optional()
        .pattern(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": "Số thẻ BHYT phải đúng 10 chữ số",
        }),
      resumeLink: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link sơ yếu lí lịch phải là URL hợp lệ",
      }),
      bankAccount: Joi.string().allow(null).max(500).optional().messages({
        "string.max": "Thông tin tài khoản ngân hàng không được quá 500 kí tự",
      }),
      maritalStatus: Joi.string()
        .valid("SINGLE", "MARRIED", "DIVORCED", "WIDOWED")
        .allow(null)
        .optional()
        .messages({
          "any.only": "Tình trạng hôn nhân không hợp lệ",
        }),
      permanentAddress: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Địa chỉ thường trú không được quá 255 kí tự",
      }),
      currentAddress: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Địa chỉ hiện tại không được quá 255 kí tự",
      }),
      school: Joi.string().allow(null).max(255).optional().messages({
        "string.max": "Tên trường không được quá 255 kí tự",
      }),
      studyPeriod: Joi.string().allow(null).max(50).optional().messages({
        "string.max": "Thời gian học không được quá 50 kí tự",
      }),
      degreeCertificate: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link bằng cấp phải là URL hợp lệ",
      }),
      foreignLanguageLevel: Joi.string().allow(null).max(100).optional().messages({
        "string.max": "Trình độ ngoại ngữ không được quá 100 kí tự",
      }),
      itSkillLevel: Joi.string().allow(null).max(100).optional().messages({
        "string.max": "Trình độ tin học không được quá 100 kí tự",
      }),
      healthCertificate: Joi.string().allow(null).uri().optional().messages({
        "string.uri": "Link giấy khám sức khỏe phải là URL hợp lệ",
      }),
      departmentId: Joi.number().integer().optional().messages({
        "number.base": "Phòng ban phải là số",
      }),
      positionId: Joi.number().integer().optional().messages({
        "number.base": "Chức vụ phải là số",
      }),
      workStatus: Joi.string()
        .optional()
        .valid(
          "WORKING_ONSITE",
          "WORK_FROM_HOME",
          "BUSINESS_TRIP",
          "TRAINING",
          "ON_LEAVE_PERSONAL",
          "ON_LEAVE_SICK",
          "ON_LEAVE_MATERNITY",
          "ON_LEAVE_VACATION",
          "OFF_DUTY",
          "ABSENT",
          "RESIGNED",
          "TERMINATED",
          "RETIRED"
        )
        .messages({
          "any.only": "Tình trạng làm việc không hợp lệ",
        }),
    });
  },
};

export default employeeValidation;
