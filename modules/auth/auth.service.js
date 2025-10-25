import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";
import { comparePassword } from "../../config/bcrypt.js";
import { generateAccessTokenAndRefreshToken } from "../../utils/generateAccessTokenAndRefreshToken.js";
import redis from "../../config/redis.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail.js";
import { addMinutes } from "date-fns";

class AuthService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async signIn(signInData) {
    const validUser = await prisma.employee.findUnique({
      where: { employeeCode: signInData.employeeCode },
    });
    if (!validUser) throw new Error("Tên đăng nhập hoặc mật khẩu không hợp lệ");

    const isMatch = await comparePassword(
      signInData.password,
      validUser.password
    );
    if (!isMatch) throw new Error("Tên đăng nhập hoặc mật khẩu không hợp lệ");

    return generateAccessTokenAndRefreshToken({
      id: validUser.id,
      role: validUser.role,
    });
  }

  async signOut(employeeId, refreshToken) {
    await redis.del(`refresh:employee:${employeeId}:${refreshToken}`);
  }

  async resetPassword(email) {
    return await prisma.$transaction(async tx => {
      const validUser = await tx.employee.findUnique({ where: { email } });
      if (!validUser) throw new Error("Không tồn tại người dùng này.");

      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(token, 10);

      await tx.passwordResetToken.deleteMany({
        where: { userId: validUser.id },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: validUser.id,
          token: hashedToken,
          expiresAt: addMinutes(new Date(), 10),
        },
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await sendEmail(
        validUser.email,
        "Đặt lại mật khẩu của bạn",
        `
        <h2>Xin chào ${validUser.name || "bạn"},</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản WorkWise của mình.</p>
        <p>Vui lòng nhấn vào liên kết bên dưới để tạo mật khẩu mới (liên kết có hiệu lực trong 10 phút):</p>
        <a href="${resetLink}" style="color:#1a73e8;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.</p>
        <p>– Đội ngũ WorkWise</p>
        `
      );

      return { message: "Reset link sent successfully." };
    });
  }
}

export default new AuthService(prisma.employee);
