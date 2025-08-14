const admin = require("../firebase-config");

const sendPushToMultipleTokens = async (tokens, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    const failedTokens = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(tokens[idx]);
      }  
    });

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedTokens,
    };
  } catch (error) {
    throw new Error("Error sending notifications: " + error.message);
  }
};

module.exports = { sendPushToMultipleTokens };
