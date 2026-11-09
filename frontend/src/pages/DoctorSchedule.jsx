import { useState, useEffect } from 'react';

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isUsingRealAPI, setIsUsingRealAPI] = useState(false);

  // 1. Lấy danh sách lịch hẹn từ API GET /api/v1/appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/appointments');
        if (response.ok) {
          const result = await response.json();
          // Sử dụng đúng hàm setAppointments
          setAppointments(result.data || []);
          setIsUsingRealAPI(true); // Đánh dấu đã kết nối API thật
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Lỗi kết nối API lịch hẹn:', error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);
  // 2. Hàm đổi trạng thái lịch hẹn (Gọi API PUT /api/v1/appointments/:id/status)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        alert('Cập nhật trạng thái lên Server thất bại!');
        return;
      }

      // Nếu API thành công, chỉ cập nhật state nội bộ của React (không dùng localStorage)
      const updatedList = appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      );
      setAppointments(updatedList);
    } catch (error) {
      console.error('Lỗi khi gọi API cập nhật trạng thái:', error);
      alert('Không thể kết nối với máy chủ!');
    }
  };
  // 3. Lọc danh sách theo Tab trạng thái, Ô tìm kiếm và Ngày khám
  const filteredAppointments = appointments.filter((apt) => {
    const matchStatus = filterStatus === 'ALL' || apt.status === filterStatus;
    const matchSearch =
      apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient_phone?.includes(searchTerm) ||
      apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || apt.date === filterDate;
    return matchStatus && matchSearch && matchDate;
  });

  // 4. Hiển thị Badge màu sắc theo trạng thái
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
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {current.text}
      </span>
    );
  };

  const statusTabs = [
    { key: 'ALL', label: 'Tất cả lịch' },
    { key: 'PENDING', label: '⏳ Chờ xác nhận' },
    { key: 'CONFIRMED', label: '✅ Đã xác nhận' },
    { key: 'COMPLETED', label: '🎉 Đã khám' },
    { key: 'CANCELLED', label: '❌ Đã hủy' }
  ];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      
      {/* TIÊU ĐỀ TRANG */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#1a365d', margin: '0 0 5px 0', fontSize: '24px' }}>
            📅 Quản Lý & Điều Phối Lịch Khám
          </h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
            Dành cho Lễ tân & Bác sĩ: Tiếp nhận, xác nhận ca khám và cập nhật trạng thái điều trị.
          </p>
        </div>

        <span style={{
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: isUsingRealAPI ? '#dcfce7' : '#fef3c7',
          color: isUsingRealAPI ? '#16a34a' : '#d97706'
        }}>
          {isUsingRealAPI ? '🟢 Đang kết nối MySQL API' : '🟡 Chế độ Dữ liệu mẫu (Preview)'}
        </span>
      </div>

      {/* THANH CÔNG CỤ: TABS TRẠNG THÁI + TÌM KIẾM + LỌC NGÀY */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px'
      }}>
        {/* Các nút lọc trạng thái */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                backgroundColor: filterStatus === tab.key ? '#2980b9' : '#edf2f7',
                color: filterStatus === tab.key ? 'white' : '#4a5568',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ô tìm kiếm tên/SĐT và chọn ngày */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Tìm tên bệnh nhân, SĐT, bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              fontSize: '14px',
              width: '250px'
            }}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              fontSize: '14px'
            }}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e2e8f0',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Xóa ngày
            </button>
          )}
        </div>
      </div>

      {/* BẢNG DANH SÁCH LỊCH KHÁM & NÚT THAO TÁC */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
                <th style={{ padding: '14px 15px' }}>Mã lịch</th>
                <th style={{ padding: '14px 15px' }}>Thông tin Bệnh nhân</th>
                <th style={{ padding: '14px 15px' }}>Bác sĩ phụ trách</th>
                <th style={{ padding: '14px 15px' }}>Thời gian hẹn</th>
                <th style={{ padding: '14px 15px' }}>Triệu chứng / Lý do</th>
                <th style={{ padding: '14px 15px' }}>Trạng thái</th>
                <th style={{ padding: '14px 15px', textAlign: 'center' }}>Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                    Không tìm thấy lịch hẹn nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#2980b9' }}>#{apt.id}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '15px' }}>{apt.patient_name}</div>
                      <div style={{ fontSize: '13px', color: '#718096', marginTop: '3px' }}>📞 {apt.patient_phone}</div>
                    </td>
                    <td style={{ padding: '15px', fontWeight: '600', color: '#1a365d' }}>{apt.doctor_name}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#2d3748' }}>📅 {apt.date}</div>
                      <div style={{ fontSize: '13px', color: '#2980b9', fontWeight: '600', marginTop: '3px' }}>⏰ {apt.time_type}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#4a5568', maxWidth: '240px' }}>{apt.reason}</td>
                    <td style={{ padding: '15px' }}>{renderStatusBadge(apt.status)}</td>
                    
                    {/* CỘT NÚT BẤM THAO TÁC */}
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'CONFIRMED')}
                              style={{
                                padding: '7px 12px',
                                backgroundColor: '#2980b9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              ✓ Duyệt lịch
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                              style={{
                                padding: '7px 12px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              ✕ Hủy
                            </button>
                          </>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                              style={{
                                padding: '7px 12px',
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              🎉 Hoàn thành khám
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                              style={{
                                padding: '7px 12px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              ✕ Hủy
                            </button>
                          </>
                        )}

                        {(apt.status === 'COMPLETED' || apt.status === 'CANCELLED') && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'PENDING')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#edf2f7',
                              color: '#4a5568',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            ↺ Đặt lại Chờ duyệt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DoctorSchedule;