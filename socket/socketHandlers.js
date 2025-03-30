/**
 * Xử lý các sự kiện Socket.IO (Check-in/Check-out bằng nhận diện khuôn mặt)
 */

const attendanceService = require("../services/attendanceService");
const { clearActiveUserAfterTimeout } = require("../mqtt/handlers");

// Định nghĩa hằng số sự kiện Socket.IO
const ATTENDANCE_UPDATE = "attendance_update";

/**
 * Xử lý xác thực khuôn mặt để Check-in/Check-out
 * @param {object} data - Dữ liệu xác thực khuôn mặt
 * @param {object} io - Socket.IO instance
 * @param {object} socket - Socket instance
 */
async function handleFaceAuth(data, io, socket) {
  try {
    console.log("Nhận dữ liệu xác thực khuôn mặt:", data);

    const { userId, faceImage } = data;

    // Kiểm tra dữ liệu đầu vào hợp lệ
    if (!userId || !faceImage) {
      throw new Error("Thiếu userId hoặc ảnh khuôn mặt");
    }

    // TODO: Tích hợp nhận diện khuôn mặt thực tế tại đây
    const faceVerified = true; // Giả lập xác thực thành công

    // Xử lý Check-in/Check-out
    const { attendance, action, user } = await attendanceService.processFaceAuth(userId, faceVerified);

    // Gửi kết quả đến Frontend qua Socket.IO
    io.emit(ATTENDANCE_UPDATE, {
      userId: user.id,
      userName: user.name,
      action,
      time: action === "check-in" ? attendance.checkInTime : attendance.checkOutTime,
    });

    // Xóa thông tin quét sau khi xử lý
    clearActiveUserAfterTimeout(userId);

    // Gửi phản hồi cho client
    socket?.emit("face_auth_result", {
      success: true,
      message: `${action === "check-in" ? "Check-in" : "Check-out"} thành công`,
      attendance,
      action,
    });

    console.log(`Người dùng ${user.name} (${user.id}) đã ${action} thành công`);
  } catch (error) {
    console.error("Lỗi khi xử lý xác thực khuôn mặt:", error);

    // Gửi phản hồi lỗi cho client
    socket?.emit("face_auth_result", {
      success: false,
      message: error.message || "Lỗi xác thực khuôn mặt",
    });
  }
}

module.exports = {
  handleFaceAuth,
};
