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
};

export default authValidation;
