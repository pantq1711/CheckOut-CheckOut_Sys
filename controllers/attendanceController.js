const attendanceService = require('../services/attendanceService');

/**
 * Quét thẻ RFID
 */
const cardScan = async (req, res) => {
  try {
    const { cardId } = req.body;
    const result = await attendanceService.processCardScan(cardId);
    res.status(200).json({ success: true, message: "Thẻ hợp lệ", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Xác thực khuôn mặt & Check-in/Check-out
 */
const faceAuth = async (req, res) => {
  try {
    const { userId, faceVerified } = req.body;
    const result = await attendanceService.processFaceAuth(userId, faceVerified);
    res.status(200).json({ success: true, message: `Đã ${result.action}`, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { cardScan, faceAuth };
