import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MainLayout = () => {
  const primaryColor = '#2980b9'; 
  const navigate = useNavigate();
  
  // Biến lưu trạng thái người dùng
  const [user, setUser] = useState(null);

  // Kiểm tra xem có ai đang đăng nhập không mỗi khi Layout được tải
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa trí nhớ
    setUser(null); // Reset state
    navigate('/'); // F5 lại trang chủ
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      <header style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* Hàng 1: Logo và Nút Đăng nhập / Lời chào */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '32px' }}>🦷</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ color: primaryColor, margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Nha Khoa Smile</h2>
              <span style={{ color: '#7f8c8d', fontSize: '12px' }}>CHUYÊN NGHIỆP & TẬN TÂM</span>
            </div>
          </Link>

          {/* HIỂN THỊ CÓ ĐIỀU KIỆN */}
          <div>
            {user ? (
              // Nếu đã đăng nhập: Hiện lời chào và nút Đăng xuất
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '500' }}>
                  Chào, <strong>{user.full_name}</strong> 👋
                </span>
                <button onClick={handleLogout} style={{ 
                  padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', 
                  border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' 
                }}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              // Nếu chưa đăng nhập: Hiện nút như cũ
              <Link to="/login">
                <button style={{ 
                  padding: '10px 20px', backgroundColor: primaryColor, color: 'white', 
                  border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' 
                }}>
                  Đăng nhập / Đăng ký
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Hàng 2: Thanh Điều Hướng (Nav) */}
        <div style={{ backgroundColor: primaryColor }}> 
          <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', padding: '12px 0' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px' }}>TRANG CHỦ</Link>
            <Link to="/doctors" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px' }}>ĐỘI NGŨ BÁC SĨ</Link>
            <Link to="/services" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px' }}>DỊCH VỤ</Link>
            <Link to="/guide" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '15px' }}>HƯỚNG DẪN</Link>
            
            {/* Nếu là bệnh nhân (role_id = 3) thì hiện thêm nút ĐẶT LỊCH nổi bật */}
            {user && user.role_id === 3 && (
              <Link to="/patient" style={{ 
                textDecoration: 'none', color: '#f39c12', fontWeight: '900', fontSize: '15px', 
                borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '40px' 
              }}>
                📅 ĐẶT LỊCH NGAY
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}> 
        <Outlet /> 
      </main>

      <footer style={{ backgroundColor: primaryColor, color: 'white', textAlign: 'center', padding: '30px 20px', marginTop: 'auto' }}>
        <h3 style={{ marginBottom: '10px' }}>Nha Khoa Smile</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>Địa chỉ: Yên Nghĩa, Hà Đông, Hà Nội</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>Hotline: 0988.888.888 | Email: contact@nhakhoasmile.com</p>
      </footer>

    </div>
  );
};

export default MainLayout;