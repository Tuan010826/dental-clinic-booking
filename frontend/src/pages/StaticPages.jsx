import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const primaryColor = '#2980b9'; 

// =========================================
// 1. TRANG CHỦ (/)
// =========================================
export const HomePage = () => {
  // KIỂM TRA ĐĂNG NHẬP: Đọc dữ liệu từ localStorage
  const user = localStorage.getItem('user');
  // Nếu có user -> đi tới /patient. Nếu không -> đi tới /login
  const bookingLink = user ? '/patient' : '/login';

  return (
    <div>
      {/* HERO BANNER */}
      <section style={{ backgroundColor: '#eaf4fc', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' }}>Tỏa sáng nụ cười tự tin</h1>
        <p style={{ color: '#7f8c8d', fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Phòng khám Nha Khoa Smile ứng dụng công nghệ hiện đại, đội ngũ bác sĩ tận tâm, mang đến cho bạn hàm răng khỏe đẹp hoàn hảo.
        </p>
        {/* Đã thay to="/login" thành to={bookingLink} */}
        <Link to={bookingLink}>
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
  const primaryColor = '#2980b9';

  // Gọi API lấy dữ liệu từ Database ngay khi mở trang
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/doctors');
        const result = await response.json();
        if (result.success) {
          setDoctors(result.data); // Lưu dữ liệu từ MySQL vào state
        }
      } catch (error) {
        console.error("Lỗi khi kết nối API bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: primaryColor, fontSize: '32px', marginBottom: '20px' }}>Đội Ngũ Bác Sĩ Chuyên Môn</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '40px' }}>Các chuyên gia nha khoa hàng đầu luôn sẵn sàng chăm sóc bạn.</p>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {doctors.map((doc) => (
          <div key={doc.id} style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaea', textAlign: 'left' }}>
            
            {/* Ảnh bác sĩ từ Database */}
            <img 
              src={doc.avatar} 
              alt={doc.full_name} 
              onError={(e) => { 
                e.target.onerror = null; 
                // Tự động thế chỗ bằng ảnh một nữ bác sĩ cực nét nếu link trong DB bị chết
                e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=400"; 
              }}
              style={{ width: '220px', minHeight: '260px', objectFit: 'cover' }} 
            />
            
            {/* Thông tin bác sĩ từ Database */}
            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: '#1a365d', fontSize: '22px', marginBottom: '5px', fontWeight: 'bold' }}>
                  {doc.position} {doc.full_name}
                </h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px', fontStyle: 'italic' }}>
                  "{doc.description}"
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#4a5568', fontSize: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: primaryColor }}>⭐</span> <span>{doc.specialty_name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: primaryColor }}>📞</span> <span>{doc.phone}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: primaryColor }}>💰</span> 
                      <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                        Khám: {Number(doc.price).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: primaryColor }}>✉️</span> <span>{doc.email}</span>
                    </div>
                  </div>
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
  // KIỂM TRA ĐĂNG NHẬP
  const user = localStorage.getItem('user');
  const bookingLink = user ? '/patient' : '/login';

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
            
            {/* Đã thay to="/login" thành to={bookingLink} */}
            <Link to={bookingLink} style={{ textDecoration: 'none' }}>
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
export const PatientPage = () => <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Trang Đặt lịch 📅</h2>;