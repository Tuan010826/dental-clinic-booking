import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (!email.includes('@') || !email.endsWith('gmail.com')) {
      setErrorMessage('Vui lòng nhập đúng định dạng email (vd: ...@gmail.com)!');
      setTimeout(() => setErrorMessage(''), 2500);
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự!');
      setTimeout(() => setErrorMessage(''), 2500);
      return;
    }
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f5f7fa', fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ textAlign: 'center', color: '#1a365d', marginBottom: '25px', fontWeight: 'bold' }}>
          Tạo Tài Khoản
        </h2>

        {errorMessage && (
          <div style={{ backgroundColor: '#fde8e8', color: '#e74c3c', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f8b4b4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên..."
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>
              Số điện thoại
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại..."
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Ô NHẬP MẬT KHẨU ĐÃ ĐƯỢC BỌC KÍN CÙNG ICON */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' }}>
              Mật khẩu mới
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px', userSelect: 'none' }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            Đăng ký
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#7f8c8d' }}>
          Bạn đã có tài khoản? <Link to="/login" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;