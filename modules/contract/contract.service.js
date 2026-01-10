import BaseService from "../../core/service/baseService.js";
import { prisma } from "../../config/db.js";
import { BadRequestException } from "../../common/exceptions/exception.js";

class ContractService extends BaseService {
  constructor(repository) {
    super(repository);
  }

  async create(contractData) {
    return prisma.$transaction(async tx => {
      // Validate employee tồn tại
      const employee = await tx.employee.findUnique({
        where: { id: contractData.employeeId },
      });
      if (!employee) {
        throw new BadRequestException("Nhân viên không tồn tại");
      }

      // Validate signedBy tồn tại
      const signer = await tx.employee.findUnique({
        where: { id: contractData.signedById },
      });
      if (!signer) {
        throw new BadRequestException("Người ký không tồn tại");
      }

      // Tự động generate contractCode nếu không có
      if (
        !contractData.contractCode ||
        contractData.contractCode.trim() === ""
      ) {
        let contractCode;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Generate unique contract code
        while (!isUnique && attempts < maxAttempts) {
          const timestamp = Date.now().toString();
          contractCode = `CT${timestamp.slice(-6)}`; // CT + last 6 digits of timestamp

          const existingContract = await tx.contract.findFirst({
            where: { contractCode },
          });

          if (!existingContract) {
            isUnique = true;
          } else {
            attempts++;
            // Wait a bit before retrying to get a different timestamp
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }

        if (!isUnique) {
          throw new BadRequestException(
            "Không thể tạo mã hợp đồng duy nhất. Vui lòng thử lại."
          );
        }

        contractData.contractCode = contractCode;
      } else {
        // Kiểm tra contract code unique nếu được cung cấp
        const existingContract = await tx.contract.findFirst({
          where: { contractCode: contractData.contractCode },
        });
        if (existingContract) {
          throw new BadRequestException("Mã hợp đồng đã tồn tại");
        }
      }

      // Validate dates
      const startDate = new Date(contractData.startDate);
      const endDate = new Date(contractData.endDate);
      const signedDate = new Date(contractData.signedDate);

      if (endDate <= startDate) {
        throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
      }

      if (signedDate > startDate) {
        throw new BadRequestException("Ngày ký không được sau ngày bắt đầu");
      }

      // Tạo contract
      return tx.contract.create({
        data: contractData,
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          signedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  async update(id, contractData) {
    return prisma.$transaction(async tx => {
      const existingContract = await tx.contract.findUnique({
        where: { id },
      });
      if (!existingContract) {
        throw new BadRequestException("Hợp đồng không tồn tại");
      }

      // Validate dates nếu có
      if (contractData.startDate || contractData.endDate) {
        const startDate = contractData.startDate
          ? new Date(contractData.startDate)
          : new Date(existingContract.startDate);
        const endDate = contractData.endDate
          ? new Date(contractData.endDate)
          : new Date(existingContract.endDate);

        if (endDate <= startDate) {
          throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }
      }

      return tx.contract.update({
        where: { id },
        data: contractData,
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          signedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  async updateStatus(id, status) {
    return prisma.$transaction(async tx => {
      const contract = await tx.contract.findUnique({
        where: { id },
      });
      if (!contract) {
        throw new BadRequestException("Hợp đồng không tồn tại");
      }

      // Business logic: Nếu activate contract, có thể cần deactivate contract cũ
      if (status === "ACTIVE") {
        // Tìm contract ACTIVE khác của cùng employee
        const activeContract = await tx.contract.findFirst({
          where: {
            employeeId: contract.employeeId,
            status: "ACTIVE",
            id: { not: id },
          },
        });

        if (activeContract) {
          // Có thể tự động expire contract cũ hoặc throw error
          // Ở đây mình sẽ throw error để admin quyết định
          throw new BadRequestException(
            `Nhân viên đã có hợp đồng ACTIVE (${activeContract.contractCode}). Vui lòng kết thúc hợp đồng cũ trước.`
          );
        }
      }

      return tx.contract.update({
        where: { id },
        data: { status },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          signedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  async renew(id, renewData) {
    return prisma.$transaction(async tx => {
      const oldContract = await tx.contract.findUnique({
        where: { id },
      });
      if (!oldContract) {
        throw new BadRequestException("Hợp đồng không tồn tại");
      }

      // Validate dates
      const startDate = new Date(renewData.startDate);
      const endDate = new Date(renewData.endDate);
      const signedDate = new Date(renewData.signedDate);

      if (endDate <= startDate) {
        throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
      }

      if (signedDate > startDate) {
        throw new BadRequestException("Ngày ký không được sau ngày bắt đầu");
      }

      // Tạo contract mới với contractCode mới
      const newContractCode = `CT${Date.now().toString().slice(-6)}`;

      // Update contract cũ thành RENEWED
      await tx.contract.update({
        where: { id },
        data: { status: "RENEWED" },
      });

      // Tạo contract mới
      return tx.contract.create({
        data: {
          contractCode: newContractCode,
          type: oldContract.type,
          startDate: renewData.startDate,
          endDate: renewData.endDate,
          signedDate: renewData.signedDate,
          status: "ACTIVE",
          dailySalary: renewData.dailySalary,
          allowance: renewData.allowance,
          note:
            renewData.note || `Gia hạn từ hợp đồng ${oldContract.contractCode}`,
          signedById: oldContract.signedById,
          employeeId: oldContract.employeeId,
        },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          signedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  // Method để tự động update expired contracts (gọi từ scheduled job)
  async updateExpiredContracts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.$transaction(async tx => {
      // Tìm tất cả contract ACTIVE có endDate < today
      const expiredContracts = await tx.contract.findMany({
        where: {
          status: "ACTIVE",
          endDate: {
            lt: today,
          },
        },
      });

      // Update status thành EXPIRED
      if (expiredContracts.length > 0) {
        await tx.contract.updateMany({
          where: {
            status: "ACTIVE",
            endDate: {
              lt: today,
            },
          },
          data: {
            status: "EXPIRED",
          },
        });
      }

      return {
        updated: expiredContracts.length,
        contracts: expiredContracts.map(c => c.contractCode),
      };
    });
  }

  // Method để check và update status khi query (optional)
  async readById(id, queryObj = {}) {
    const contract = await this.repository.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        signedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      ...queryObj,
    });

    // Auto-check expired nếu contract đang ACTIVE
    if (contract && contract.status === "ACTIVE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(contract.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < today) {
        // Auto-update trong background (không block response)
        this.updateStatus(id, "EXPIRED").catch(console.error);
        contract.status = "EXPIRED";
      }
    }

    return contract;
  }

  async read(queryObj = {}, options = {}) {
    // Extract where clause separately to ensure it's clean for count()
    const where = queryObj.where || {};

    const queryOptions = {
      where,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        signedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    };

    return super.read(queryOptions, options);
  }

  async readByEmployee(employeeId) {
    return this.repository.findMany({
      where: { employeeId },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        signedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async readByManager(managerId) {
    return this.repository.findMany({
      where: { signedById: managerId },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        signedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getStats() {
    const [total, active, expired, draft, terminated, pending, renewed] =
      await Promise.all([
        this.repository.count(),
        this.repository.count({ where: { status: "ACTIVE" } }),
        this.repository.count({ where: { status: "EXPIRED" } }),
        this.repository.count({ where: { status: "DRAFT" } }),
        this.repository.count({ where: { status: "TERMINATED" } }),
        this.repository.count({ where: { status: "PENDING" } }),
        this.repository.count({ where: { status: "RENEWED" } }),
      ]);

    return {
      total,
      active,
      expired,
      draft,
      terminated,
      pending,
      renewed,
    };
  }
}

export default new ContractService(prisma.contract);
