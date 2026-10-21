import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- TRANG ĐĂNG NHẬP ---
const LoginPage = () => {
  const navigate = useNavigate();
  // Giữ nguyên tên biến email để gửi cho backend, dù nó có thể chứa số điện thoại
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });
      const data = await response.json();

      if (response.ok) {
        // LƯU THÔNG TIN NGƯỜI DÙNG VÀO BỘ NHỚ TRÌNH DUYỆT
        localStorage.setItem('user', JSON.stringify(data.data));

        if (data.data.role_id === 1 || data.data.role_id === 2) {
          navigate('/admin'); // Admin/Bác sĩ vẫn vào trang quản trị
        } else if (data.data.role_id === 3) {
          navigate('/'); // Bệnh nhân được đưa về lại Trang chủ
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#3498db', marginBottom: '20px' }}>Đăng nhập vào Phòng khám</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '12px' }}>
        
        {/* Đã sửa type="email" thành type="text" để cho phép nhập cả sđt và không bị trình duyệt báo lỗi */}
        <input 
          type="text" 
          placeholder="Email hoặc số điện thoại" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
        />
        
        {/* Khối bọc ô mật khẩu */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mật khẩu" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
          />
          <span 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', userSelect: 'none' }}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? '🙉' : '🙈'}
          </span>
        </div>
        
        <button type="submit" 
                style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
          Đăng nhập
        </button>
      </form>

      <div style={{ marginTop: '15px', color: '#3498db', cursor: 'pointer', fontSize: '13px' }}>
        Quên mật khẩu?
      </div>

      <hr style={{ width: '320px', margin: '25px 0', border: '0.5px solid #eaeaea' }} />

      <button 
        onClick={() => navigate('/register')} 
        style={{ padding: '12px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
      >
        Tạo tài khoản mới
      </button>
    </div>
  );
};
export default LoginPage;