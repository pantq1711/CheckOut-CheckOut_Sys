const { Attendance, User, Card } = require('../models');

/**
 * Xử lý quét thẻ RFID
 */
const processCardScan = async (cardId) => {
  const card = await Card.findOne({ where: { cardId, isActive: true }, include: User });
  if (!card) throw new Error("Thẻ không hợp lệ hoặc chưa kích hoạt.");
  return { user: card.User };
};

/**
 * Xác thực khuôn mặt & thực hiện Check-in/Check-out
 */
const processFaceAuth = async (userId, faceVerified) => {
  if (!faceVerified) throw new Error("Xác thực khuôn mặt thất bại.");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("Không tìm thấy người dùng.");

  const lastAttendance = await Attendance.findOne({
    where: { userId, checkOutTime: null },
    order: [['createdAt', 'DESC']]
  });

  let attendance, action;
  if (lastAttendance) {
    attendance = await lastAttendance.update({ checkOutTime: new Date(), faceVerified: true });
    action = "check-out";
  } else {
    attendance = await Attendance.create({ userId, checkInTime: new Date(), faceVerified: true });
    action = "check-in";
  }

  return { attendance, action, user };
};

module.exports = { processCardScan, processFaceAuth };
