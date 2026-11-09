import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// === IMPORT CÁC TRANG CỦA KHÁCH & BỆNH NHÂN (Bạn đã làm) ===
import MainLayout from './components/MainLayout';
import { HomePage, DoctorListPage, ServicesPage, GuidePage, PatientPage,HistoryAPpage } from './pages/StaticPages';

// === IMPORT CÁC TRANG XÁC THỰC ===
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// === IMPORT CÁC TRANG CỦA ADMIN & BÁC SĨ (THÀNH VIÊN 3) ===
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import DoctorSchedule from './pages/DoctorSchedule';


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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="schedule" element={<DoctorSchedule />} />
        </Route>
        <Route path="/admin/history" element={<AdminLayout><HistoryAPpage /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;