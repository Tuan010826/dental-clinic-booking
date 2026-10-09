require('dotenv').config();
const express = require('express');
const { testConnection } = require('./src/config/connectDB');
const initAPIRoutes = require('./src/routes/api');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

// Bật CORS cho phép tất cả các cổng (Frontend) được gọi API
app.use(cors());
// Cấu hình để server đọc được data gửi lên dạng JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Khởi tạo API Routes
initAPIRoutes(app);

// Khởi động server
app.listen(port, async () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
    // Gọi hàm test kết nối DB ngay khi server bật
    await testConnection();
});