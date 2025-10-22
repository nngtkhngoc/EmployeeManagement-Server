import Joi from "joi";

const attendanceReportDetailValidation = {
  updateValidation: () => {
    return Joi.object({
      note: Joi.string().max(500).allow(null, "").optional().messages({
        "string.max": "Ghi chú không được quá 500 kí tự",
      }),
    });
  },
};

export default attendanceReportDetailValidation;
