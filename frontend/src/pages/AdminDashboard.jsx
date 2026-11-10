import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State lưu trữ số liệu thống kê
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalSpecialties: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });

  // State lưu danh sách lịch hẹn gần đây và danh sách bác sĩ
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Khởi tạo các biến để lấy dữ liệu đồng thời
        const [aptRes, docRes, patRes, specRes] = await Promise.all([
          fetch('http://localhost:3000/api/v1/appointments'),
          fetch('http://localhost:3000/api/v1/doctors'),
          fetch('http://localhost:3000/api/v1/users?roleId=3'),
          fetch('http://localhost:3000/api/v1/specialties')
        ]);

        const [aptData, docData, patData, specData] = await Promise.all([
          aptRes.json(),
          docRes.json(),
          patRes.json(),
          specRes.json()
        ]);

        const appointments = aptData.data || [];
        
        // Tính toán các con số
        const pendingCount = appointments.filter(item => item.status === 'PENDING').length;
        
        setStats({
          totalAppointments: appointments.length,
          totalDoctors: (docData.data || docData || []).length, 
          totalPatients: (patData.data || []).length,
          totalSpecialties: (specData.data || []).length,
          pendingAppointments: pendingCount
        });

        // Chỉ hiển thị 5 lịch hẹn mới nhất
        setRecentAppointments(appointments.slice(0, 5));
        setDoctorsList(docData.data || docData || []);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm render nhãn trạng thái (Badge) khớp 100% với ENUM trong database.sql
  const renderStatusBadge = (status) => {
    const styles = {
      PENDING:   { bg: '#fef3c7', color: '#d97706', text: '⏳ Chờ xác nhận' },
      CONFIRMED: { bg: '#e0f2fe', color: '#0284c7', text: '✅ Đã xác nhận' },
      COMPLETED: { bg: '#dcfce7', color: '#16a34a', text: '🎉 Đã khám xong' },
      CANCELLED: { bg: '#fee2e2', color: '#dc2626', text: '❌ Đã hủy' }
    };
    const current = styles[status] || styles.PENDING;

    return (
      <span style={{
        backgroundColor: current.bg,
        color: current.color,
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {current.text}
      </span>
    );
  };

  // Danh sách 4 thẻ thống kê trên cùng
  const statCards = [
    {
      title: 'Tổng Lịch Hẹn',
      value: stats.totalAppointments,
      subText: `${stats.pendingAppointments} lịch đang chờ duyệt`,
      icon: '📅',
      borderColor: '#2980b9',
      bgIcon: '#ebf8ff'
    },
    {
      title: 'Đội Ngũ Bác Sĩ',
      value: stats.totalDoctors,
      subText: 'Đang hoạt động tại phòng khám',
      icon: '👨‍⚕️',
      borderColor: '#27ae60',
      bgIcon: '#f0fff4'
    },
    {
      title: 'Hồ Sơ Bệnh Nhân',
      value: stats.totalPatients,
      subText: 'Tài khoản bệnh nhân đã đăng ký',
      icon: '👥',
      borderColor: '#8e44ad',
      bgIcon: '#faf5ff'
    },
    {
      title: 'Chuyên Khoa',
      value: stats.totalSpecialties,
      subText: 'Dịch vụ chuyên môn nha khoa',
      icon: '🦷',
      borderColor: '#e67e22',
      bgIcon: '#fffaf0'
    }
  ];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      
      {/* TIÊU ĐỀ TRANG */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#1a365d', margin: '0 0 5px 0', fontSize: '24px' }}>
            📊 Tổng Quan Hoạt Động Phòng Khám
          </h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
            Số liệu thời gian thực tổng hợp từ hệ thống Nha Khoa Smile.
          </p>
        </div>

        <Link to="/admin/schedule" style={{
          backgroundColor: '#2980b9',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 2px 6px rgba(41, 128, 185, 0.3)'
        }}>
          + Quản lý & Duyệt lịch hẹn →
        </Link>
      </div>

      {/* ========================================== */}
      {/* PHẦN 1: 4 THẺ THỐNG KÊ (STATISTICS CARDS)  */}
      {/* ========================================== */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {statCards.map((card, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderLeft: `5px solid ${card.borderColor}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ color: '#718096', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {card.title}
              </div>
              <div style={{ color: '#2d3748', fontSize: '30px', fontWeight: '900', marginBottom: '5px' }}>
                {loading ? '...' : card.value}
              </div>
              <div style={{ color: '#a0aec0', fontSize: '12px' }}>
                {card.subText}
              </div>
            </div>

            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: card.bgIcon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px'
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* PHẦN 2: BẢNG LỊCH HẸN MỚI NHẤT             */}
      {/* ========================================== */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>
            🕒 Danh Sách Lịch Khám Mới Nhất
          </h3>
          <Link to="/admin/schedule" style={{ color: '#2980b9', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
            Xem tất cả lịch khám →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
                <th style={{ padding: '12px 15px' }}>Mã số</th>
                <th style={{ padding: '12px 15px' }}>Bệnh nhân</th>
                <th style={{ padding: '12px 15px' }}>Bác sĩ phụ trách</th>
                <th style={{ padding: '12px 15px' }}>Ngày & Giờ khám</th>
                <th style={{ padding: '12px 15px' }}>Lý do khám</th>
                <th style={{ padding: '12px 15px' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '14px 15px', fontWeight: 'bold', color: '#2980b9' }}>#{apt.id}</td>
                  <td style={{ padding: '14px 15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{apt.patient_name}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>📞 {apt.patient_phone}</div>
                  </td>
                  <td style={{ padding: '14px 15px', color: '#4a5568', fontWeight: '500' }}>{apt.doctor_name}</td>
                  <td style={{ padding: '14px 15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{apt.date}</div>
                    <div style={{ fontSize: '12px', color: '#2980b9' }}>⏰ {apt.time_type}</div>
                  </td>
                  <td style={{ padding: '14px 15px', color: '#4a5568' }}>{apt.reason}</td>
                  <td style={{ padding: '14px 15px' }}>
                    {renderStatusBadge(apt.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* PHẦN 3: DANH SÁCH BÁC SĨ TỪ DATABASE (NẾU CÓ) */}
      {/* ========================================== */}
      {doctorsList.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
            👨‍⚕️ Bác Sĩ Đang Trực Trên Hệ Thống (Dữ liệu từ MySQL)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
            {doctorsList.map(doc => (
              <div key={doc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1a365d' }}>{doc.position} {doc.full_name}</div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Chuyên khoa: {doc.specialty_name || 'Nha khoa chung'}</div>
                </div>
                <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '13px' }}>
                  {Number(doc.price).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;  