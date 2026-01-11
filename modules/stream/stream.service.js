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

  /**
   * Get all meetings
   * @param {Object} query - Query parameters (page, limit, status, departmentId, etc.)
   * @returns {Object} { data: Meeting[], pagination: {...} }
   */
  async getAllMeetings(query = {}) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const where = {};
      if (query.status) {
        where.status = query.status;
      }
      if (query.departmentId) {
        where.departmentId = query.departmentId;
      }
      if (query.createdById) {
        where.createdById = query.createdById;
      }

      const [meetings, total] = await Promise.all([
        prisma.meeting.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            createdBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.meeting.count({ where }),
      ]);

      // Transform to match expected format
      const formattedMeetings = meetings.map(meeting => ({
        id: meeting.id,
        callId: meeting.callId,
        title: meeting.title,
        description: meeting.description,
        status: meeting.status,
        scheduledAt: meeting.scheduledAt?.toISOString() || null,
        createdAt: meeting.createdAt.toISOString(),
        createdById: meeting.createdById,
        departmentId: meeting.departmentId,
        departmentName: meeting.department?.name || null,
        createdBy: meeting.createdBy
          ? {
              id: meeting.createdBy.id,
              fullName: meeting.createdBy.fullName,
              email: meeting.createdBy.email,
            }
          : null,
      }));

      return {
        data: formattedMeetings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Lỗi khi lấy danh sách cuộc họp: ${error.message}`
      );
    }
  }

  /**
   * Get meeting by ID
   * @param {string} id - Meeting ID
   * @returns {Object} Meeting object
   */
  async getMeetingById(id) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!meeting) {
        throw new BadRequestException("Cuộc họp không tồn tại");
      }

      return {
        id: meeting.id,
        callId: meeting.callId,
        title: meeting.title,
        description: meeting.description,
        status: meeting.status,
        scheduledAt: meeting.scheduledAt?.toISOString() || null,
        createdAt: meeting.createdAt.toISOString(),
        createdById: meeting.createdById,
        departmentId: meeting.departmentId,
        departmentName: meeting.department?.name || null,
        createdBy: meeting.createdBy
          ? {
              id: meeting.createdBy.id,
              fullName: meeting.createdBy.fullName,
              email: meeting.createdBy.email,
            }
          : null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Lỗi khi lấy thông tin cuộc họp: ${error.message}`
      );
    }
  }

  /**
   * Create a new meeting
   * @param {Object} meetingData - Meeting data (title, description, callId, scheduledAt, etc.)
   * @returns {Object} Created meeting
   */
  async createMeeting(meetingData) {
    try {
      const {
        title,
        description,
        callId,
        scheduledAt,
        departmentId,
        createdById,
      } = meetingData;

      if (!title || title.trim() === "") {
        throw new BadRequestException("Tiêu đề cuộc họp là bắt buộc");
      }

      // Generate callId if not provided
      let finalCallId = callId;
      if (!finalCallId || finalCallId.trim() === "") {
        // Generate a unique callId
        const timestamp = Date.now();
        finalCallId = `meeting-${timestamp}`;
      }

      // Create meeting in database
      const meeting = await prisma.meeting.create({
        data: {
          callId: finalCallId,
          title: title.trim(),
          description: description || null,
          status: "SCHEDULED",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          createdById,
          departmentId: departmentId || null,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        id: meeting.id,
        callId: meeting.callId,
        title: meeting.title,
        description: meeting.description,
        status: meeting.status,
        scheduledAt: meeting.scheduledAt?.toISOString() || null,
        createdAt: meeting.createdAt.toISOString(),
        createdById: meeting.createdById,
        departmentId: meeting.departmentId,
        departmentName: meeting.department?.name || null,
        createdBy: meeting.createdBy
          ? {
              id: meeting.createdBy.id,
              fullName: meeting.createdBy.fullName,
              email: meeting.createdBy.email,
            }
          : null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Lỗi khi tạo cuộc họp: ${error.message}`);
    }
  }

  /**
   * Update meeting
   * @param {string} id - Meeting ID
   * @param {Object} meetingData - Updated meeting data
   * @returns {Object} Updated meeting
   */
  async updateMeeting(id, meetingData) {
    try {
      const existingMeeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!existingMeeting) {
        throw new BadRequestException("Cuộc họp không tồn tại");
      }

      const { status, title, description, scheduledAt, departmentId } =
        meetingData;

      // Validate status if provided
      const validStatuses = ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"];
      if (status && !validStatuses.includes(status)) {
        throw new BadRequestException(`Trạng thái không hợp lệ: ${status}`);
      }

      // Build update data
      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description;
      if (scheduledAt !== undefined)
        updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
      if (departmentId !== undefined) updateData.departmentId = departmentId;

      // Update meeting in database
      const updatedMeeting = await prisma.meeting.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        id: updatedMeeting.id,
        callId: updatedMeeting.callId,
        title: updatedMeeting.title,
        description: updatedMeeting.description,
        status: updatedMeeting.status,
        scheduledAt: updatedMeeting.scheduledAt?.toISOString() || null,
        createdAt: updatedMeeting.createdAt.toISOString(),
        createdById: updatedMeeting.createdById,
        departmentId: updatedMeeting.departmentId,
        departmentName: updatedMeeting.department?.name || null,
        createdBy: updatedMeeting.createdBy
          ? {
              id: updatedMeeting.createdBy.id,
              fullName: updatedMeeting.createdBy.fullName,
              email: updatedMeeting.createdBy.email,
            }
          : null,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Lỗi khi cập nhật cuộc họp: ${error.message}`
      );
    }
  }

  /**
   * Delete meeting
   * @param {string} id - Meeting ID
   */
  async deleteMeeting(id) {
    try {
      const existingMeeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!existingMeeting) {
        throw new BadRequestException("Cuộc họp không tồn tại");
      }

      // Delete from database
      await prisma.meeting.delete({
        where: { id },
      });

      return;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Lỗi khi xóa cuộc họp: ${error.message}`);
    }
  }
}

export default new StreamService();
