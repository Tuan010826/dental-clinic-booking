import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Đã thêm state này
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Vui lòng nhập định dạng email hợp lệ!');
      setTimeout(() => setErrorMessage(''), 2500);
      return; 
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userInfo = data.data || data.user || data; 
        localStorage.setItem('user', JSON.stringify(userInfo)); 
        
        if (userInfo.role_id === 1) {
          navigate('/admin'); 
        } else if (userInfo.role_id === 2) {
          navigate('/admin/schedule'); 
        } else {
          navigate('/'); 
        }
      } else {
        setErrorMessage(data.message || 'Email hoặc mật khẩu không chính xác!');
        setTimeout(() => setErrorMessage(''), 2500);
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f5f7fa', fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ textAlign: 'center', color: '#1a365d', marginBottom: '25px', fontWeight: 'bold' }}>
          Đăng Nhập Tài Khoản
        </h2>

        {errorMessage && (
          <div style={{ backgroundColor: '#fde8e8', color: '#e74c3c', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f8b4b4', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '20px' }}>
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
              Mật khẩu
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
            Đăng nhập
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#7f8c8d' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;