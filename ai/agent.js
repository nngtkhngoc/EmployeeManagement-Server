import pdfParse from "pdf-parse";
import axios from "axios";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Extract contract information from PDF file
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} Extracted contract information
 */
export const extractContractInfoFromPDF = async pdfBuffer => {
  try {
    // Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error(
        "Không thể đọc được văn bản từ PDF. Vui lòng kiểm tra file."
      );
    }

    // Create prompt to extract contract information
    const prompt = `
Hãy đọc văn bản hợp đồng lao động sau đây và trích xuất thông tin theo định dạng JSON sau:

{
  "contractCode": "Mã hợp đồng (nếu có, ví dụ: CT001, HĐ-2024-001)",
  "type": "Loại hợp đồng (FULL_TIME, PART_TIME, INTERNSHIP, PROBATION, TEMPORARY, FREELANCE, OUTSOURCE)",
  "startDate": "Ngày bắt đầu hợp đồng (YYYY-MM-DD)",
  "endDate": "Ngày kết thúc hợp đồng (YYYY-MM-DD)",
  "signedDate": "Ngày ký hợp đồng (YYYY-MM-DD)",
  "dailySalary": "Lương ngày (số, không có dấu phẩy hoặc ký tự đặc biệt)",
  "allowance": "Phụ cấp (số, mặc định 0 nếu không có)",
  "note": "Ghi chú hoặc thông tin bổ sung (nếu có)",
  "employeeName": "Tên nhân viên (nếu có)",
  "employeeId": "ID nhân viên (nếu có trong văn bản, nếu không để null)",
  "signedByName": "Tên người ký (nếu có)"
}

Quy tắc:
- Nếu không tìm thấy thông tin, để null hoặc giá trị mặc định
- Đối với type: dựa vào từ khóa trong hợp đồng:
  * "toàn thời gian", "full-time" -> FULL_TIME
  * "bán thời gian", "part-time" -> PART_TIME
  * "thực tập", "internship" -> INTERNSHIP
  * "thử việc", "probation" -> PROBATION
  * "tạm thời", "temporary" -> TEMPORARY
  * "freelance" -> FREELANCE
  * "outsource" -> OUTSOURCE
- Đối với dates: chuyển đổi về định dạng YYYY-MM-DD
- Đối với salary: chỉ trích xuất số, không có ký tự đặc biệt
- Trả về JSON hợp lệ, không có comment hoặc text thừa

Văn bản hợp đồng:
${pdfText}
`;

    // Call Gemini API using axios
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      throw new Error("Không nhận được phản hồi từ AI");
    }

    // Extract JSON from response (remove markdown code blocks if any)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    // Parse JSON
    const contractInfo = JSON.parse(jsonText);

    // Clean and validate data
    return {
      contractCode: contractInfo.contractCode || null,
      type: contractInfo.type || "FULL_TIME",
      startDate: contractInfo.startDate || null,
      endDate: contractInfo.endDate || null,
      signedDate: contractInfo.signedDate || null,
      dailySalary: contractInfo.dailySalary
        ? parseFloat(contractInfo.dailySalary)
        : null,
      allowance: contractInfo.allowance
        ? parseFloat(contractInfo.allowance)
        : 0,
      note: contractInfo.note || null,
      employeeName: contractInfo.employeeName || null,
      employeeId: contractInfo.employeeId || null,
      signedByName: contractInfo.signedByName || null,
    };
  } catch (error) {
    console.error("Error extracting contract info from PDF:", error);
    throw new Error(
      `Lỗi khi đọc PDF: ${error.message}. Vui lòng đảm bảo file PDF có văn bản hợp lệ.`
    );
  }
};
