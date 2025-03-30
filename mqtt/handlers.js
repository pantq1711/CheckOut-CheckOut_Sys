const mqtt = require("mqtt");
const { io } = require("../socket");
const db = require("../models");

const MQTT_TOPIC = "library-system/checkin";
const activeScans = new Map();

// Kết nối MQTT
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("✅ MQTT Connected");
  client.subscribe(MQTT_TOPIC);
});

client.on("message", async (topic, message) => {
  if (topic !== MQTT_TOPIC) return;

  const data = JSON.parse(message.toString());
  console.log("📥 Nhận dữ liệu từ ESP32:", data);

  const { cardId } = data;
  if (!cardId) return;

  // Kiểm tra thẻ hợp lệ
  const card = await db.Card.findOne({ where: { cardId, isActive: true } });
  if (!card) return console.log("❌ Thẻ không hợp lệ!");

  const userId = card.userId;

  // Tránh quét nhiều lần liên tục
  if (activeScans.has(userId)) return;
  activeScans.set(userId, true);

  // Gửi thông báo quét mặt tới Frontend
  io.emit("face_scan_required", { userId });

  // Xóa userId sau 30s nếu không quét mặt
  setTimeout(() => activeScans.delete(userId), 30000);
});

module.exports = { activeScans };
