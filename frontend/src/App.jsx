import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// 1. Tạo Nhanh các Trang (Sau này bạn tách ra từng file riêng cho gọn)
const HomePage = () => (
  <div>
    <h1>🦷 Trang chủ Phòng khám</h1>
    <p>Chào mừng bạn! Dưới đây là danh sách Dịch vụ và Bác sĩ...</p>
    <Link to="/login"><button>Đăng nhập / Đăng ký</button></Link>
  </div>
);

const AdminDoctorPage = () => <h2>Trang Quản trị dành cho Admin & Bác sĩ 👨‍⚕️</h2>;
const PatientBookingPage = () => <h2>Trang Đặt lịch dành cho Bệnh nhân 📅</h2>;

// 2. Trang Đăng nhập & Logic bẻ lái
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi API Đăng nhập bạn đã viết ở Backend
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        
        // CHÌA KHÓA NẰM Ở ĐÂY: Dựa vào role_id để bẻ lái
        if (data.data.role_id === 1 || data.data.role_id === 2) {
          navigate('/admin'); // Admin & Bác sĩ vào đây
        } else if (data.data.role_id === 3) {
          navigate('/patient'); // Bệnh nhân vào đây
        }
      } else {
        alert(data.message); // Báo lỗi sai mật khẩu, sai email...
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

// 3. Cấu hình các đường dẫn (Routes) của dự án
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Các trang dành cho 2 bạn kia code */}
        <Route path="/admin" element={<AdminDoctorPage />} />
        <Route path="/patient" element={<PatientBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;