import contractService from "../modules/contract/contract.service.js";

export async function runContractExpiryJob() {
  try {
    console.log("[Contract Expiry Job] Bắt đầu kiểm tra hợp đồng hết hạn...");
    const result = await contractService.updateExpiredContracts();
    console.log(
      `[Contract Expiry Job] Đã cập nhật ${result.updated} hợp đồng hết hạn:`,
      result.contracts
    );
    return result;
  } catch (error) {
    console.error("[Contract Expiry Job] Lỗi:", error);
    throw error;
  }
}

export function startContractExpiryScheduler() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    runContractExpiryJob();
    setInterval(runContractExpiryJob, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  console.log("[Contract Expiry Scheduler] Đã khởi động scheduled job");
}

