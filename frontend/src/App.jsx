import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Tạo state để lưu trữ danh sách chuyên khoa lấy từ Database
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Dùng useEffect để tự động gọi API khi trang web vừa load xong
  useEffect(() => {
    // Gọi đường dẫn API Backend của bạn (đảm bảo Backend đang chạy ở port 3000)
    fetch('http://localhost:3000/api/v1/specialties')
      .then((response) => response.json())
      .then((data) => {
        // Lưu dữ liệu backend trả về vào state
        setSpecialties(data.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi kết nối Backend:", error);
        setLoading(false);
      });
  }, []); // Dấu [] giúp API chỉ gọi 1 lần duy nhất khi vào web

  // 3. Hiển thị dữ liệu ra màn hình
  return (
    <div className="container">
      <h1>🦷 Hệ thống Đặt lịch Nha khoa</h1>
      <h2>Danh sách Chuyên khoa</h2>
      
      {loading ? (
        <p>Đang tải dữ liệu từ Database...</p>
      ) : (
        <ul style={{ textAlign: "left" }}>
          {/* Dùng map() để lặp qua mảng dữ liệu và in ra từng dòng */}
          {specialties.length > 0 ? (
            specialties.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> 
                {item.description ? ` - ${item.description}` : ''}
              </li>
            ))
          ) : (
            <p>Chưa có dữ liệu chuyên khoa nào trong Database.</p>
          )}
        </ul>
      )}
    </div>
  )
}

export default App