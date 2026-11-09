import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Đoạn code chèn vào trong phần render giao diện menu (Sidebar):
<div className="sidebar-menu">
  <Link to="/admin/dashboard" className="menu-item">
    📊 Tổng quan Admin
  </Link>
  
  <Link to="/admin/schedule" className="menu-item">
    📅 Quản lý lịch khám
  </Link>
</div>
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để biết đang đứng ở đường dẫn nào nhằm tô sáng menu
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Nếu không có user (đã đăng xuất), đá văng về trang login
      // Thuộc tính replace: true vô cùng quan trọng: Nó sẽ ghi đè lịch sử duyệt web
      navigate('/login', { replace: true }); 
    }
  }, [navigate]);
  
  // 1. Đọc thông tin người dùng từ localStorage khi mở trang (giống MainLayout)
  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        const parsed = JSON.parse(loggedInUser);
        setUser(parsed.data || parsed.user || parsed);
      }
    } catch (error) {
      console.error("Lỗi đọc dữ liệu người dùng tại Admin:", error);
      setUser(null);
    }
  }, []);

  // 2. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // 3. Trích xuất tên hiển thị và Vai trò (Role) dựa theo bảng roles trong Database
  const displayName = user?.full_name || user?.name || user?.email || 'Quản trị viên';
  const roleBadge = user?.role_id === 1 
    ? 'Quản trị viên (Admin)' 
    : user?.role_id === 2 
    ? 'Bác sĩ nha khoa' 
    : 'Nhân sự trực ban';

  // 4. Danh sách các mục Menu bên thanh Sidebar trái
  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Tổng quan (Dashboard)' },
    { path: '/admin/schedule', icon: '📅', label: 'Quản lý Lịch khám' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' }}>
      
      {/* ========================================== */}
      {/* CỘT TRÁI: THANH ĐIỀU HƯỚNG (SIDEBAR)       */}
      {/* ========================================== */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#1a365d', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Logo Phòng khám */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '30px' }}>🦷</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 'bold', color: '#ffffff' }}>Nha Khoa Smile</h2>
            <span style={{ fontSize: '11px', color: '#90cdf4', letterSpacing: '1px', fontWeight: 'bold' }}>HỆ THỐNG QUẢN TRỊ</span>
          </div>
        </div>

        {/* Các mục Menu */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            // Kiểm tra xem đường dẫn hiện tại có trùng với nút menu này không
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#cbd5e0',
                  backgroundColor: isActive ? '#2980b9' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '15px' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Nút quay về xem giao diện trang chủ của Khách */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>🏠</span> Về trang chủ khách hàng
          </Link>
        </div>
      </aside>

      {/* ========================================== */}
      {/* CỘT PHẢI: HEADER QUẢN TRỊ + NỘI DUNG CHÍNH */}
      {/* ========================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Thanh Header trên cùng */}
        <header style={{ 
          backgroundColor: '#ffffff', 
          padding: '15px 30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>
              Bảng Điều Khiển Dành Cho Bác Sĩ & Lễ Tân
            </h3>
          </div>

          {/* Thông tin tài khoản đang đăng nhập & nút Đăng xuất */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>
                👨‍⚕️ {displayName}
              </div>
              <span style={{ 
                fontSize: '12px', 
                backgroundColor: '#ebf8ff', 
                color: '#2b6cb0', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {roleBadge}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Vùng hiển thị nội dung các trang con (AdminDashboard hoặc DoctorSchedule) */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;