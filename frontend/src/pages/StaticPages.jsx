import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../lich.css'; 
// Màu xanh chủ đạo dùng chung cho toàn bộ các trang này
const primaryColor = '#2980b9'; 

// =========================================
// 1. TRANG CHỦ (/)
// =========================================
export const HomePage = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* HERO BANNER */}
      <section style={{ backgroundColor: '#eaf4fc', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '42px', marginBottom: '20px', fontWeight: '800' }}>Tỏa sáng nụ cười tự tin</h1>
        <p style={{ color: '#7f8c8d', fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Phòng khám Nha Khoa Smile ứng dụng công nghệ hiện đại, đội ngũ bác sĩ tận tâm, mang đến cho bạn hàm răng khỏe đẹp hoàn hảo.
        </p>
        <Link to="/login">
          <button style={{ padding: '15px 30px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(231, 76, 60, 0.3)' }}>
            📅 ĐẶT LỊCH KHÁM NGAY
          </button>
        </Link>
      </section>

      {/* DỊCH VỤ NỔI BẬT */}
      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: primaryColor, fontSize: '32px', marginBottom: '40px' }}>Dịch Vụ Của Chúng Tôi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💎</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Bọc Răng Sứ</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Phục hình răng thẩm mỹ, độ bền cao, màu sắc tự nhiên như răng thật.</p>
          </div>
          <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔩</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Cấy Ghép Implant</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Giải pháp phục hồi răng mất vĩnh viễn an toàn, ăn nhai chắc chắn.</p>
          </div>
          <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>✨</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Niềng Răng</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Chỉnh nha vô hình, niềng răng mắc cài giúp nụ cười đều đặn.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// =========================================
// 2. TRANG DANH SÁCH BÁC SĨ (/doctors)
// =========================================
export const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/users?role_id=2');
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setDoctors(data.data);
          }
        }
      } catch (error) {
        console.error("Chưa kết nối được API bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  const displayDoctors = doctors.length > 0 ? doctors : [
    { id: 1, full_name: "BS. CKI Trần Văn B", email: "bacsi@gmail.com", phone: "0988.888.888", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=400&fit=crop" },
    { id: 2, full_name: "ThS. BS. Nguyễn Thị C", email: "nguyenthic@gmail.com", phone: "0977.777.777", avatar: "https://images.unsplash.com/photo-1594824453531-157d60ce1482?q=80&w=300&h=400&fit=crop" }
  ];

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: primaryColor, fontSize: '32px', marginBottom: '20px' }}>Đội Ngũ Bác Sĩ Chuyên Môn</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '40px' }}>Các chuyên gia nha khoa hàng đầu luôn sẵn sàng chăm sóc bạn.</p>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {displayDoctors.map((doc) => (
          <div key={doc.id} style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaea', textAlign: 'left' }}>
            <img src={doc.avatar || "https://via.placeholder.com/250x300.png?text=No+Avatar"} alt={doc.full_name} style={{ width: '220px', minHeight: '260px', objectFit: 'cover' }} />
            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: '#1a365d', fontSize: '22px', marginBottom: '20px', fontWeight: 'bold' }}>{doc.full_name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#4a5568', fontSize: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>⭐</span> <span>Chuyên khoa Răng Hàm Mặt</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>📍</span> <span>Phòng khám A9-2307</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>📞</span> <span>{doc.phone || 'Đang cập nhật'}</span></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>🎓</span> <span>Chứng chỉ Phục hình thẩm mỹ</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>🏥</span> <span>Hơn 10 năm kinh nghiệm</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: primaryColor }}>✉️</span> <span>{doc.email}</span></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// =========================================
// 3. TRANG DỊCH VỤ (/services)
// =========================================
export const ServicesPage = () => {
  const services = [
    { icon: "🩺", title: "Khám Tổng Quát", desc: "Kiểm tra toàn diện sức khỏe răng miệng, lấy cao răng định kỳ bằng sóng siêu âm êm ái." },
    { icon: "💎", title: "Bọc Răng Sứ Thẩm Mỹ", desc: "Phục hình răng khiếm khuyết với đa dạng các dòng sứ cao cấp: Cercon, Zirconia, Emax..." },
    { icon: "🔩", title: "Cấy Ghép Implant", desc: "Trồng răng Implant chuẩn quốc tế, phục hồi khả năng ăn nhai 100% như răng thật." },
    { icon: "✨", title: "Niềng Răng - Chỉnh Nha", desc: "Niềng răng mắc cài kim loại, mắc cài sứ và niềng răng trong suốt Invisalign cao cấp." },
    { icon: "😁", title: "Tẩy Trắng Răng", desc: "Công nghệ tẩy trắng Laser hiện đại, bật 2-3 tone chỉ sau 45 phút, không gây ê buốt." },
    { icon: "👶", title: "Nha Khoa Trẻ Em", desc: "Nhổ răng sữa, điều trị sâu răng, bôi Fluor phòng ngừa sâu răng cho bé nhẹ nhàng, không đau." }
  ];

  return (
    <section style={{ backgroundColor: '#f8f9fa', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: primaryColor, fontSize: '32px', marginBottom: '15px' }}>Dịch Vụ Nha Khoa Toàn Diện</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '50px', fontSize: '18px' }}>Chất lượng quốc tế - Chi phí hợp lý - Tận tâm vì nụ cười của bạn.</p>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {services.map((srv, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '40px 25px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>{srv.icon}</div>
            <h3 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '15px' }}>{srv.title}</h3>
            <p style={{ color: '#7f8c8d', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' }}>{srv.desc}</p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <span style={{ color: primaryColor, fontWeight: 'bold', fontSize: '14px', padding: '8px 15px', border: `2px solid ${primaryColor}`, borderRadius: '20px' }}>
                ĐẶT LỊCH NGAY
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

// =========================================
// 4. TRANG HƯỚNG DẪN (/guide)
// =========================================
export const GuidePage = () => {
  const steps = [
    { num: "01", title: "Đăng ký / Đăng nhập", desc: "Tạo tài khoản nhanh chóng bằng Email hoặc Số điện thoại để hệ thống lưu trữ hồ sơ bệnh án của bạn." },
    { num: "02", title: "Chọn Bác sĩ & Dịch vụ", desc: "Tham khảo thông tin, chuyên môn của các bác sĩ và lựa chọn dịch vụ nha khoa bạn đang quan tâm." },
    { num: "03", title: "Chọn Thời gian & Đặt lịch", desc: "Chọn ngày và khung giờ phù hợp với lịch trình của bạn. Bấm xác nhận để hoàn tất đặt hẹn." },
    { num: "04", title: "Đến khám không chờ đợi", desc: "Hệ thống sẽ gửi thông báo. Bạn chỉ cần đến đúng giờ, đọc số điện thoại và vào khám ngay!" }
  ];

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: primaryColor, fontSize: '32px', marginBottom: '15px' }}>Quy Trình Đặt Lịch & Khám Bệnh</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '50px', fontSize: '18px' }}>Chỉ với 4 bước thao tác đơn giản trên điện thoại hoặc máy tính.</p>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
        {steps.map((step, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', backgroundColor: '#eaf4fc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primaryColor, fontSize: '28px', fontWeight: '900' }}>
              {step.num}
            </div>
            <h3 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' }}>{step.title}</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '15px', maxWidth: '800px', margin: '60px auto 0' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Bạn cần hỗ trợ trực tiếp?</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Nếu gặp khó khăn trong quá trình đặt lịch, vui lòng gọi điện thoại cho bộ phận CSKH của chúng tôi.</p>
        <button style={{ padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          📞 Tổng đài: 0988.888.888
        </button>
      </div>
    </section>
  );
};

// =========================================
// 5. CÁC TRANG CÒN LẠI (GIỮ CHỖ)
// =========================================
export const AdminPage = () => <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Trang Quản trị 👨‍⚕️</h2>;

export const HistoryAPpage= ()=> {
  const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Gọi API lấy danh sách
    const fetchAppointments = async (keyword = '') => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/v1/admin/appointments?search=${encodeURIComponent(keyword)}`);
            const data = await res.json();
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error("Lỗi tải lịch hẹn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        fetchAppointments(searchTerm);
    };

    // Đổi trạng thái (Chốt lịch / Hủy / Hoàn thành)
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:3000/api/v1/admin/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Tải lại danh sách sau khi đổi thành công
                fetchAppointments(searchTerm);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
        }
    };

    // Render Badge Trạng Thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="badge badge-pending">Chờ xác nhận</span>;
            case 'CONFIRMED':
                return <span className="badge badge-confirmed">Đã xác nhận</span>;
            case 'COMPLETED':
                return <span className="badge badge-completed">Đã hoàn thành</span>;
            case 'CANCELLED':
                return <span className="badge badge-cancelled">Đã hủy</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h2>Lịch Sử Khám Bệnh 🩺</h2>
                <p>Hệ thống quản trị nha khoa hiện đại</p>
            </header>

            {/* Thanh tìm kiếm */}
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm theo Mã lịch (#), Họ tên hoặc Số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Tìm kiếm</button>
                {searchTerm && (
                    <button type="button" className="btn-reset" onClick={() => { setSearchTerm(''); fetchAppointments(''); }}>
                        Xóa lọc
                    </button>
                )}
            </form>

            {/* Bảng danh sách */}
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã LH</th>
                            <th>Bệnh nhân</th>
                            <th>Số điện thoại</th>
                            <th>Thời gian khám</th>
                            <th>Bác sĩ phụ trách</th>
                            <th>Lý do khám</th>
                            <th>Trạng thái</th>
                            <th>Thao tác chốt lịch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                        ) : appointments.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy lịch hẹn nào.</td></tr>
                        ) : (
                            appointments.map((item) => (
                                <tr key={item.appointment_id}>
                                    <td><strong>#{item.appointment_id}</strong></td>
                                    <td className="fw-bold">{item.patient_name}</td>
                                    <td>{item.patient_phone}</td>
                                    <td>
                                        <div>{item.appointment_date}</div>
                                        <small style={{ color: '#666' }}>{item.appointment_time}</small>
                                    </td>
                                    <td>{item.doctor_name}</td>
                                    <td>{item.reason}</td>
                                    <td>{renderStatusBadge(item.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {item.status === 'PENDING' && (
                                                <button
                                                    className="btn-action btn-confirm"
                                                    onClick={() => handleStatusChange(item.appointment_id, 'CONFIRMED')}
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                            {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
                                                <button
                                                    className="btn-action btn-complete"
                                                    onClick={() => handleStatusChange(item.appointment_id, 'COMPLETED')}
                                                >
                                                    Hoàn thành
                                                </button>
                                            )}
                                            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                                                <button
                                                    className="btn-action btn-cancel"
                                                    onClick={() => handleStatusChange(item.appointment_id, 'CANCELLED')}
                                                >
                                                    Hủy
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
    );
};

export const PatientPage = () => {
  const [formData, setFormData] = useState({
    clinic: 'Nha Khoa Smile - Cơ sở Hà Đông',
    service: '',
    doctor: '',
    date: '2026-10-19',
    timeSlot: '',
    fullName: '',
    gender: 'Nam',
    dob: '',
    phone: '',
    email: '',
    reason: '',
    agreed: false
  });

  const [doctorsList, setDoctorsList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Lấy danh sách bác sĩ từ CSDL khi tải trang
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctorsList(data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Tự động cập nhật trạng thái khung giờ khi ngày hoặc bác sĩ thay đổi
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/slots?date=${formData.date}&doctor_id=${formData.doctor_id}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error("Lỗi lấy slot:", error);
      }
    };
    fetchSlots();
  }, [formData.date, formData.doctor_id]);

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.timeSlot) {
      alert('Vui lòng chọn khung giờ khám!');
      return;
    }
    if (!formData.agreed) {
      alert('Bạn vui lòng đồng ý với chính sách bảo vệ dữ liệu cá nhân!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        // Đặt thành công: Thông báo và làm mới form
        alert(result.message);
        setFormData({
          clinic: 'Nha Khoa Smile - Cơ sở Hà Đông',
          service: '',
          doctor_id: '',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '',
          fullName: '',
          gender: 'Nam',
          dob: '',
          phone: '',
          email: '',
          reason: '',
          agreed: false
        });
      } else {
        // Đặt thất bại (ví dụ: kín lịch): Thông báo lỗi nhưng GIỮ NGUYÊN FORM để khách sửa ngày
        alert(result.message);
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      alert('Không thể kết nối đến máy chủ backend.');
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-card">
        <form  onSubmit={handleSubmit}>
          
          <h2 className="patient-title">Nội dung chi tiết đặt hẹn</h2>

          <div className="patient-grid-2">
            <div>
              <label className="patient-label">Phòng khám Nha khoa <span style={{ color: 'red' }}>*</span></label>
              <select name="clinic" value={formData.clinic} onChange={handleChange} className="patient-input" required>
                <option value="Nha Khoa Smile - Cơ sở Hà Đông">Nha Khoa Smile - Cơ sở Hà Đông</option>
                <option value="Nha Khoa Smile - Cơ sở Cầu Giấy">Nha Khoa Smile - Cơ sở Cầu Giấy</option>
              </select>
            </div>

            <div>
              <label className="patient-label-dark">Chọn ngày khám <span style={{ color: 'red' }}>*</span></label>
              <div className="patient-date-group">
             {[0, 1, 2].map((offset) => {
                  const d = new Date();
                  d.setDate(d.getDate() + offset);
                  const value = d.toISOString().split('T')[0];
                  const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                 const sub = offset === 0 ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'long' });

              return (
      <button
        key={value}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, date: value }))}
        className="patient-date-btn"
        style={{
          flex: 1,
          padding: '8px',
          borderRadius: '8px',
          border: formData.date === value ? '2px solid #00a887' : '1px solid #ccc',
          backgroundColor: formData.date === value ? '#00a887' : '#fff',
          color: formData.date === value ? '#fff' : '#333',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{label}</div>
        <div style={{ fontSize: '12px' }}>{sub}</div>
      </button>
    );
  })}

  {/* Ô thứ 4: Tự do chọn ngày khác */}
  <input 
    type="date" 
    value={formData.date}
    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
    className="patient-date-btn"
    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center' }}
    title="Chọn ngày khác"
  />
</div>
</div>
            </div>

          <div className="patient-grid-2">
            <div>
              <label className="patient-label">Dịch vụ nha khoa <span style={{ color: 'red' }}>*</span></label>
              <select name="service" value={formData.service} onChange={handleChange} className="patient-input" required>
                <option value="">-- Chọn dịch vụ --</option>
                <option value="Tẩy trắng răng">Tẩy trắng răng</option>
                <option value="Niềng răng thẩm mỹ">Niềng răng thẩm mỹ</option>
                <option value="Bọc răng sứ">Bọc răng sứ</option>
                <option value="Cấy ghép Implant">Cấy ghép Implant</option>
              </select>
            </div>

            <div>
              <label className="patient-label">Bác sĩ phụ trách</label>
              <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} className="patient-input">
                <option value="">-- Tự động phân công bác sĩ trống lịch --</option>
                {doctorsList.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="patient-group">
            <label className="patient-label">Chọn giờ khám khả dụng <span style={{ color: 'red' }}>*</span></label>
            <div className="patient-slot-grid">
              {availableSlots.map((slot, index) => {
                const isFull = slot.status === 'full';
                const isSelected = formData.timeSlot === slot.time;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isFull}
                    onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot.time }))}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid #0066cc' : '1px solid #ddd',
                      backgroundColor: isFull ? '#e9ecef' : isSelected ? '#0066cc' : '#f8f9fa',
                      color: isFull ? '#6c757d' : isSelected ? '#fff' : '#333',
                      cursor: isFull ? 'not-allowed' : 'pointer',
                      textDecoration: isFull ? 'line-through' : 'none'
                    }}
                  >
                    {slot.time} {isFull && '(Đã kín)'}
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="patient-title">Thông tin khách hàng</h2>

          <div className="patient-grid-3">
            <div>
              <label className="patient-label">Họ và tên <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="fullName" placeholder="Nhập họ và tên" value={formData.fullName} onChange={handleChange} className="patient-input" required />
            </div>

            <div>
              <label className="patient-label">Giới tính</label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <label><input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={handleChange} /> Nam</label>
                <label><input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={handleChange} /> Nữ</label>
              </div>
            </div>

            <div>
              <label className="patient-label">Ngày sinh <span style={{ color: 'red' }}>*</span></label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="patient-input" required />
            </div>
          </div>

          <div className="patient-grid-2">
            <div>
              <label className="patient-label">Số điện thoại <span style={{ color: 'red' }}>*</span></label>
              <input type="tel" name="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} className="patient-input" required />
            </div>

            <div>
              <label className="patient-label">Email</label>
              <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} className="patient-input" />
            </div>
          </div>

          <div className="patient-group">
            <label className="patient-label">Lý do khám / Triệu chứng</label>
            <textarea name="reason" rows="3" placeholder="Mô tả triệu chứng..." value={formData.reason} onChange={handleChange} className="patient-input" style={{ resize: 'vertical' }}></textarea>
          </div>

          <div className="patient-group">
            <label style={{ fontSize: '14px', color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} style={{ marginRight: '8px' }} required />
              Tôi đã đọc và đồng ý với chính sách bảo vệ dữ liệu cá nhân.
            </label>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="patient-submit-btn">
              Gửi thông tin đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
