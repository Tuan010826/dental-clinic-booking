import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- TRANG ĐĂNG KÝ ---
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // State quản lý việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, phone })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Đăng ký thành công! Đang chuyển hướng về trang đăng nhập...");
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#3498db', marginBottom: '5px' }}>Tạo tài khoản mới</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px', fontSize: '14px' }}>Nhanh chóng và dễ dàng.</p>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '12px' }}>
        <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} required 
               style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}/>
        
        <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} required 
               style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}/>
        
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required 
               style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}/>
        
        {/* Khối bọc ô mật khẩu */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showPassword ? "text" : "password"} // Thay đổi type dựa vào biến showPassword
            placeholder="Mật khẩu mới" 
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
                style={{ padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
          Đăng ký
        </button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#3498db', fontSize: '14px' }}>Bạn đã có tài khoản?</Link>
      </div>
    </div>
  );
};

export default RegisterPage