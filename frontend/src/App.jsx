import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// === IMPORT CÁC TRANG CỦA KHÁCH & BỆNH NHÂN (Bạn đã làm) ===
import MainLayout from './components/MainLayout';
import { HomePage, DoctorListPage, ServicesPage, GuidePage, PatientPage } from './pages/StaticPages';

// === IMPORT CÁC TRANG XÁC THỰC ===
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// === KHUNG GIỮ CHỖ CHO ADMIN & BÁC SĨ (Đồng đội sẽ làm và thay thế sau) ===
// (Lưu ý: Các hàm dưới đây chỉ là giữ chỗ tạm thời để code không bị lỗi. 
// Sau này đồng đội của bạn sẽ xóa chúng đi và import các file .jsx thật của họ vào đây)
const AdminLayout = ({ children }) => (
  <div style={{ backgroundColor: '#2c3e50', minHeight: '100vh', color: 'white', padding: '20px' }}>
    <h2 style={{ borderBottom: '1px solid white', paddingBottom: '10px' }}>⚙️ ĐÂY LÀ GIAO DIỆN ADMIN LAYOUT CHUNG</h2>
    {/* Outlet sẽ được thay thế sau, tạm thời render children */}
    <div style={{ marginTop: '20px' }}>{children}</div>
  </div>
);
const AdminDashboard = () => <h3>📊 Trang Tổng quan Dashboard (Đồng đội code ở đây)</h3>;
const DoctorSchedule = () => <h3>📅 Trang Quản lý Lịch Khám (Đồng đội code ở đây)</h3>;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ======================================= */}
        {/* VÙNG 1: TRANG DÀNH CHO KHÁCH VÀ BỆNH NHÂN */}
        {/* ======================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/guide" element={<GuidePage />} />
          {/* Trang của Bệnh nhân nằm chung Layout với Khách để xài chung Nav/Footer */}
          <Route path="/patient" element={<PatientPage />} />
        </Route>

        {/* ======================================= */}
        {/* VÙNG 2: TRANG ĐỘC LẬP (KHÔNG CÓ HEADER/FOOTER) */}
        {/* ======================================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ======================================= */}
        {/* VÙNG 3: TRANG DÀNH CHO ADMIN & BÁC SĨ */}
        {/* ======================================= */}
        {/* Đồng đội sẽ cấu hình Outlet trong AdminLayout thật của họ sau */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/schedule" element={<AdminLayout><DoctorSchedule /></AdminLayout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;