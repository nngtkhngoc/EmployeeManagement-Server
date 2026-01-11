import { prisma } from "../../config/db.js";
import { BadRequestException } from "../../common/exceptions/exception.js";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

class StreamService {
  /**
   * Generate Stream token for video calling
   * @param {number} userId - Employee ID
   * @param {string} callId - Call ID (typically department ID)
   * @returns {Object} { token, apiKey, userId }
   */
  async generateStreamToken(userId, callId = null) {
    try {
      // Get Stream API Key and Secret from environment
      const apiKey = process.env.STREAM_API_KEY;
      const apiSecret = process.env.STREAM_API_SECRET;

      if (!apiKey || !apiSecret) {
        throw new BadRequestException(
          "Stream API Key hoặc Secret chưa được cấu hình. Vui lòng kiểm tra biến môi trường."
        );
      }

      // Get employee with department info
      const employee = await prisma.employee.findUnique({
        where: { id: userId },
        include: {
          department: true,
        },
      });

      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      // Initialize Stream Chat client for token generation
      // StreamChat is used for both Chat and Video token generation
      const serverClient = StreamChat.getInstance(apiKey, apiSecret);

      // Generate user token - this creates a JWT token for the user
      const userIdString = userId.toString();
      const token = serverClient.createToken(userIdString);

      return {
        token,
        apiKey,
        userId: userId.toString(),
        userName: employee.fullName || employee.employeeCode,
        userImage: employee.avatar || null,
        departmentId: employee.departmentId,
        departmentName: employee.department?.name || null,
        callId: callId || `department-${employee.departmentId}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Lỗi khi tạo Stream token: ${error.message}`
      );
    }
  }

  /**
   * Verify if user can join a call (same department check)
   * @param {number} userId - Employee ID
   * @param {string} callId - Call ID (department ID format: department-{id})
   * @returns {Object} { canJoin, departmentId, departmentName }
   */
  async verifyCallAccess(userId, callId) {
    try {
      // Get employee with department
      const employee = await prisma.employee.findUnique({
        where: { id: userId },
        include: {
          department: true,
        },
      });

      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      // Extract department ID from callId (format: department-{id})
      const callDepartmentId = callId.startsWith("department-")
        ? parseInt(callId.replace("department-", ""))
        : null;

      // Check if user belongs to the department in the call
      const canJoin = employee.departmentId === callDepartmentId;

      if (!canJoin) {
        return {
          canJoin: false,
          departmentId: employee.departmentId,
          departmentName: employee.department?.name || null,
          message:
            "Bạn không thuộc phòng ban này. Chỉ có thể tham gia call của phòng ban mình.",
        };
      }

      return {
        canJoin: true,
        departmentId: employee.departmentId,
        departmentName: employee.department?.name || null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Lỗi khi kiểm tra quyền truy cập: ${error.message}`
      );
    }
  }

  /**
   * Get department call ID for a user
   * @param {number} userId - Employee ID
   * @returns {Object} { callId, departmentId, departmentName }
   */
  async getDepartmentCallId(userId) {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: userId },
        include: {
          department: true,
        },
      });

      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      if (!employee.departmentId) {
        throw new BadRequestException(
          "Nhân viên chưa được gán vào phòng ban nào"
        );
      }

      return {
        callId: `department-${employee.departmentId}`,
        departmentId: employee.departmentId,
        departmentName: employee.department?.name || null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Lỗi khi lấy thông tin phòng ban: ${error.message}`
      );
    }
  }
}

export default new StreamService();
