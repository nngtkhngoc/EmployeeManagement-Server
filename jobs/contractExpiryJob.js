import contractService from "../modules/contract/contract.service.js";

/**
 * Scheduled job để tự động update expired contracts
 * Có thể gọi từ:
 * 1. Cron job external (cron trên server)
 * 2. SetInterval trong server.js
 * 3. Manual trigger từ API endpoint
 */
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

/**
 * Start scheduled job với setInterval
 * Chạy mỗi ngày lúc 00:00 (cần tính toán delay)
 */
export function startContractExpiryScheduler() {
  // Tính thời gian đến 00:00 tiếp theo
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  // Chạy lần đầu sau khi đến 00:00
  setTimeout(() => {
    runContractExpiryJob();
    // Sau đó chạy mỗi 24 giờ
    setInterval(runContractExpiryJob, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  console.log("[Contract Expiry Scheduler] Đã khởi động scheduled job");
}

