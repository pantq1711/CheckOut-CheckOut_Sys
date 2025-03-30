const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mqttClient = require('./config/mqtt');
const { initSocket } = require('./socket/socketHandler');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

initSocket(server);

server.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));
