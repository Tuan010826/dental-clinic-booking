import React, { useState, useEffect } from 'react';

export const MyHistory = () => {
    const [history, setHistory] = useState([]);
    
    // 1. Lấy thông tin user đang đăng nhập từ localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        // 2. Nếu là bệnh nhân (role_id = 3) thì mới gọi API
        if (user && user.role_id === 3) {
            const fetchMyHistory = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/v1/appointments/patient/${user.id}`);
                    const result = await response.json();
                    if (result.success) {
                        setHistory(result.data);
                    }
                } catch (error) {
                    console.error("Lỗi lấy lịch sử:", error);
                }
            };
            fetchMyHistory();
        }
    }, [user]);

    // Nếu chưa đăng nhập thì không hiện gì cả
    if (!user) return null;

    return (
        <div className="patient-history-container" style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Lịch Sử Đặt Hẹn Của Tôi 📅</h2>
            {history.length === 0 ? (
                <p>Bạn chưa có lịch hẹn nào.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ngày khám</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Giờ</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Bác sĩ</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.appointment_date}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.appointment_time}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.doctor_name}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                                        background: item.status === 'PENDING' ? '#fff3cd' : item.status === 'CONFIRMED' ? '#d1e7dd' : '#f8d7da',
                                        color: item.status === 'PENDING' ? '#856404' : item.status === 'CONFIRMED' ? '#0f5132' : '#842029'
                                    }}>
                                        {item.status === 'PENDING' ? 'Chờ duyệt' : item.status === 'CONFIRMED' ? 'Đã duyệt' : item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};