const { sendPushToMultipleTokens } = require("../utils/firebaseService");
const deviceSchema = require('../models/fcmtoken')

const sendNotification = async (req, res) => {
  // const {title, body } = req.body;

  const users = await deviceSchema.find({});
  const tcs =  users.map((item) =>  item.fcmToken)

  console.log('====================================');
  console.log(tcs);
  console.log('====================================');
  
  // const tokens = users.map(user => user.fcmToken).filter(Boolean);

  // if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
  //   return res.status(400).json({ message: "FCM tokens are required" });
  // }

  // try {
  //   const result = await sendPushToMultipleTokens(tokens, title, body);
  //   res.status(200).json({
  //     message: "Notification sent",
  //     ...result,
  //   });
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
};

module.exports = { sendNotification };
