import crypto from "crypto";

/**
 * Generate UserSig for TRTC authentication
 * @param {Object} params - Parameters for generating UserSig
 * @param {string} params.userID - User identifier (only letters, numbers, underscore, hyphen)
 * @param {number} params.SDKAppID - TRTC SDK App ID
 * @param {string} params.SecretKey - TRTC Secret Key
 * @param {number} params.expire - Expire time in seconds (default: 15552000 = 180 days)
 * @returns {string} UserSig token
 */
export function genTestUserSig({ userID, SDKAppID, SecretKey, expire = 15552000 }) {
  if (!userID || !SDKAppID || !SecretKey) {
    throw new Error("userID, SDKAppID, and SecretKey are required");
  }

  // Validate userID format (only letters, numbers, underscore, hyphen)
  const userIDPattern = /^[a-zA-Z0-9_-]+$/;
  if (!userIDPattern.test(userID)) {
    throw new Error(
      "userID chỉ được chứa chữ cái (a-z, A-Z), số (0-9), dấu gạch dưới và dấu gạch ngang"
    );
  }

  // Calculate expire timestamp (current time + expire seconds)
  const expireTime = Math.floor(Date.now() / 1000) + expire;

  // Create the document to sign
  const document = {
    userID: userID,
    SDKAppID: SDKAppID,
    expire: expireTime,
  };

  // Convert document to JSON string
  const documentStr = JSON.stringify(document);

  // Create HMAC-SHA256 signature
  const hmac = crypto.createHmac("sha256", SecretKey);
  hmac.update(documentStr);
  const signature = hmac.digest("base64");

  // Create the final token structure
  const token = {
    ...document,
    version: "2.0",
    signature: signature,
  };

  // Convert to JSON and encode in base64
  const tokenStr = JSON.stringify(token);
  const userSig = Buffer.from(tokenStr).toString("base64");

  return { userSig, expire: expireTime };
}

/**
 * Generate UserSig with custom expire time
 * @param {Object} params - Parameters for generating UserSig
 * @param {string} params.userID - User identifier
 * @param {number} params.SDKAppID - TRTC SDK App ID
 * @param {string} params.SecretKey - TRTC Secret Key
 * @param {number} params.expire - Expire time in seconds
 * @returns {Object} { userSig, expire }
 */
export function generateUserSig({ userID, SDKAppID, SecretKey, expire = 15552000 }) {
  return genTestUserSig({ userID, SDKAppID, SecretKey, expire });
}

export default { genTestUserSig, generateUserSig };

