import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Extract text from PDF using pdfjs
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);

  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text += content.items.map(item => item.str).join(" ") + "\n";
  }

  return text.trim();
}

/**
 * Extract contract information from PDF file
 * @param {Buffer} pdfBuffer
 * @returns {Promise<Object>}
 */
export const extractContractInfoFromPDF = async pdfBuffer => {
  try {
    /* =======================
       1. Parse PDF
    ======================= */
    const pdfText = await extractTextFromPDF(pdfBuffer);

    if (!pdfText) {
      throw new Error("PDF không có nội dung văn bản (có thể là file scan)");
    }

    /* =======================
       2. Prompt
    ======================= */
    const prompt = `
Hãy đọc văn bản hợp đồng lao động sau đây và trích xuất thông tin theo JSON:

{
  "contractCode": null,
  "type": null,
  "startDate": null,
  "endDate": null,
  "signedDate": null,
  "dailySalary": null,
  "allowance": 0,
  "note": null,
  "employeeName": null,
  "employeeId": null,
  "signedByName": null
}

Quy tắc:
- Chỉ trả về JSON hợp lệ
- Không markdown, không text thừa
- Date format: YYYY-MM-DD
- Salary chỉ lấy số

Mapping type:
- toàn thời gian / full-time → FULL_TIME
- bán thời gian / part-time → PART_TIME
- thực tập → INTERNSHIP
- thử việc → PROBATION
- freelance → FREELANCE
- outsource → OUTSOURCE

Văn bản:
${pdfText}
`;

    /* =======================
       3. Call Gemini with retry logic for rate limiting
    ======================= */
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 3000; // 3 seconds - increased to reduce rate limiting
    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Add delay before request (including first attempt to reduce rate limiting)
        if (attempt > 0) {
          // Exponential backoff: 3s, 6s, 12s
          const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
          console.log(
            `[Retry ${attempt}/${MAX_RETRIES}] Waiting ${delay}ms before retry...`
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Small delay even on first attempt to prevent immediate rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const { data } = await axios.post(
          `${GEMINI_API_URL}?key=${API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 60000, // 60 seconds timeout
          }
        );

        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error("Gemini không trả dữ liệu");
        }

        // Success! Extract JSON and return
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Không tìm thấy JSON trong phản hồi AI");
        }

        const contractInfo = JSON.parse(jsonMatch[0]);

        /* =======================
           4. Normalize output
        ======================= */
        return {
          contractCode: contractInfo.contractCode ?? null,
          type: contractInfo.type ?? null,
          startDate: contractInfo.startDate ?? null,
          endDate: contractInfo.endDate ?? null,
          signedDate: contractInfo.signedDate ?? null,
          dailySalary:
            contractInfo.dailySalary !== null
              ? Number(contractInfo.dailySalary)
              : null,
          allowance:
            contractInfo.allowance !== null
              ? Number(contractInfo.allowance)
              : 0,
          note: contractInfo.note ?? null,
          employeeName: contractInfo.employeeName ?? null,
          employeeId: contractInfo.employeeId ?? null,
          signedByName: contractInfo.signedByName ?? null,
        };
      } catch (error) {
        lastError = error;

        // Check if it's a rate limit error (429)
        if (error.response?.status === 429) {
          const retryAfter =
            error.response.headers["retry-after"] ||
            error.response.headers["Retry-After"];

          if (retryAfter) {
            // Use Retry-After header if available
            const delay = parseInt(retryAfter) * 1000;
            console.log(
              `[Rate Limited] Retry-After: ${retryAfter}s. Waiting ${delay}ms...`
            );

            if (attempt < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Retry with delay from header
            } else {
              throw new Error(
                `Rate limit exceeded. Vui lòng đợi ${retryAfter} giây và thử lại. ` +
                  `(Đã thử ${attempt + 1} lần)`
              );
            }
          } else if (attempt < MAX_RETRIES) {
            // No Retry-After header, use exponential backoff
            console.log(
              `[Rate Limited] No Retry-After header, using exponential backoff...`
            );
            continue; // Will retry with exponential backoff on next iteration
          } else {
            // Max retries reached
            throw new Error(
              `Rate limit exceeded sau ${attempt + 1} lần thử. ` +
                `Vui lòng đợi một chút và thử lại. ` +
                `(Lỗi: ${error.response?.status} ${
                  error.response?.statusText || ""
                })`
            );
          }
        }

        // For other axios errors, check if retryable
        if (attempt < MAX_RETRIES) {
          // Retry for network errors, timeouts
          if (
            error.code === "ECONNRESET" ||
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNREFUSED" ||
            error.message.includes("timeout")
          ) {
            console.log(`[Network Error] Retrying... (${error.message})`);
            continue;
          }
        }

        // For other errors or max retries reached, throw immediately
        throw error;
      }
    }

    // Should never reach here, but just in case
    if (lastError) {
      throw lastError;
    }
  } catch (err) {
    console.error("extractContractInfoFromPDF error:", err);
    throw new Error(`Lỗi đọc hợp đồng PDF: ${err.message}`);
  }
};
