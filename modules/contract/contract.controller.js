import contractService from "./contract.service.js";
import contractValidation from "./contract.validation.js";

const contractController = {
  // 🧾 Danh sách hợp đồng (đã có)
  getAllContracts: async (req, res) => {
    try {
      const query = await contractValidation.contractQuerySchema.validateAsync(
        req.query,
        {
          abortEarly: false,
        }
      );
      const contracts = await contractService.read(query);
      return res.status(200).json({ data: contracts });
    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },

  // 🔍 Chi tiết hợp đồng
  getContractById: async (req, res) => {
    try {
      const contractId = parseInt(req.params.id, 10);
      const contract = await contractService.readById(contractId);
      if (!contract)
        return res.status(404).json({ message: "Hợp đồng không tồn tại" });
      return res.status(200).json({ data: contract });
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },

  // ➕ Tạo hợp đồng mới
  createContract: async (req, res) => {
    try {
      const contractData =
        await contractValidation.createContractSchema.validateAsync(req.body, {
          abortEarly: false,
        });
      const newContract = await contractService.create(contractData);
      return res.status(201).json({ data: newContract });
    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },

  // ✏️ Cập nhật hợp đồng
  updateContract: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const contractData =
        await contractValidation.updateContractSchema.validateAsync(req.body, {
          abortEarly: false,
        });
      const updated = await contractService.update(id, contractData);
      return res.status(200).json({ data: updated });
    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },

  // 🗑️ Xoá hợp đồng
  deleteContract: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await contractService.delete(id);
      if (!deleted)
        return res.status(404).json({ message: "Hợp đồng không tồn tại" });
      return res.status(200).json({ message: "Đã xoá hợp đồng thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },

  // ⚙️ Cập nhật trạng thái
  updateContractStatus: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } =
        await contractValidation.updateContractStatusSchema.validateAsync(
          req.body,
          {
            abortEarly: false,
          }
        );
      const updated = await contractService.updateStatus(id, status);
      return res.status(200).json({ data: updated });
    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },

  // 📄 Hợp đồng của 1 nhân viên
  getContractsByEmployee: async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId, 10);
      const contracts = await contractService.readByEmployee(employeeId);
      return res.status(200).json({ data: contracts });
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },

  // 📑 Hợp đồng được ký bởi 1 người
  getContractsByManager: async (req, res) => {
    try {
      const managerId = parseInt(req.params.managerId, 10);
      const contracts = await contractService.readByManager(managerId);
      return res.status(200).json({ data: contracts });
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },

  // 🔁 Gia hạn hợp đồng
  renewContract: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const renewData =
        await contractValidation.renewContractSchema.validateAsync(req.body, {
          abortEarly: false,
        });
      const renewed = await contractService.renew(id, renewData);
      return res.status(201).json({ data: renewed });
    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({
          errors: error.details.map(d => d.message),
        });
      }
      return res.status(500).send();
    }
  },

  // 📊 Thống kê hợp đồng
  getContractStats: async (req, res) => {
    try {
      const stats = await contractService.getStats();
      return res.status(200).json({ data: stats });
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  },
};

export default contractController;
