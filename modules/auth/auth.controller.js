import { SuccessResponseDto } from "../../common/dtos/successResponseDto.js";
import catchAsync from "../../common/catchAsync.js";

import authService from "./auth.service.js";
import authValidation from "../../validations/auth.validation.js";

const authController = {
  signIn: async (req, res) => {
    await authValidation.signInValidate().validateAsync(req.body, {
      abortEarly: false,
    });

    const token = await authService.signIn(req.body);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(new SuccessResponseDto());
  },

  signOut: async (req, res) => {
    const employeeId = req.user.id;
    const refreshToken = req.cookies.refreshToken;

    await authService.signOut(employeeId, refreshToken);
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });

    return res.status(200).json(new SuccessResponseDto());
  },

  resetPassword: async (req, res) => {},

  signInGoogle: async (req, res) => {},
};

Object.entries(authController).forEach(([key, value]) => {
  authController[key] = catchAsync(value);
});

export default authController;
