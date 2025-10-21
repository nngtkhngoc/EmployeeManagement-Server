import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";
import { comparePassword } from "../../config/bcrypt.js";
import { generateAccessTokenAndRefreshToken } from "../../utils/generateAccessTokenAndRefreshToken.js";
import redis from "../../config/redis.js";

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
}

export default new AuthService(prisma.employee);
