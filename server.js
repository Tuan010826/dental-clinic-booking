const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Cấu hình một Route cơ bản để test hiển thị
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #2c3e50;">🚀 Chúc mừng! Server Express đã hoạt động.</h1>
            <p style="font-size: 18px; color: #7f8c8d;">Hệ thống Đặt lịch Nha khoa của nhóm bạn đã sẵn sàng để phát triển.</p>
        </div>
    `);
});

// Khởi động server
app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(` Server đang chạy thành công tại địa chỉ: ${url}`);
    
    // Tự động mở trình duyệt (Dành cho hệ điều hành Windows)
    exec(`start ${url}`); 
});