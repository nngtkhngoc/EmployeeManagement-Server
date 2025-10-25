import Joi from "joi";

const authValidation = {
  signInValidate: () => {
    return Joi.object({
      employeeCode: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ0-9]+$/)
        .required()
        .messages({
          "any.required": "Mã nhân viên là bắt buộc",
          "string.empty": "Mã nhân viên không được để trống",
          "string.min": "Mã nhân viên phải lớn hơn 3 kí tự",
          "string.max": "Mã nhân viên phải ít hơn 100 kí tự",
          "string.pattern.base": "Mã nhân viên chỉ được chứa chữ cái và số",
        }),
      password: Joi.string().required().messages({
        "any.required": "Mật khẩu là bắt buộc",
        "string.empty": "Mật khẩu không được để trống",
      }),
    });
  },
  resetPasswordValidate: () => {
    return Joi.object({
      password: Joi.string()
        .min(6)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ỹ0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|-]+$/)
        .required()
        .messages({
          "any.required": "Mật khẩu là bắt buộc",
          "string.empty": "Mật khẩu không được để trống",
          "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
          "string.max": "Mật khẩu không được vượt quá 100 ký tự",
          "string.pattern.base":
            "Mật khẩu chỉ được chứa chữ cái, số và ký tự đặc biệt hợp lệ",
        }),

      confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Mật khẩu xác nhận không khớp",
          "any.required": "Vui lòng nhập lại mật khẩu để xác nhận",
        }),

      token: Joi.string().required().messages({
        "any.required": "Token là bắt buộc",
        "string.empty": "Token không được để trống",
      }),
    });
  },
};

export default authValidation;
