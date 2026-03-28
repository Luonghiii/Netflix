"use client";

import { useState, useEffect } from "react";
import "./globals.css"; // Nhúng file CSS
 
export default function Home() {
  const [currentData, setCurrentData] = useState([]);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Chặn chuột phải & F12 (Thêm một lớp giáp bảo vệ)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lấy dữ liệu AN TOÀN từ API của chính web mình (Không gọi trực tiếp Apps Script)
  const loadData = async () => {
    try {
      const res = await fetch("/api/data?t=" + Date.now());
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setCurrentData(data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const dataInterval = setInterval(loadData, 30000);
    const timeInterval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Hàm xử lý thời gian
  const parseDate = (value) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).format(date);
  };

  const formatRemain = (ms) => {
    if (ms <= 0) return "Đã hết hạn";
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const getActiveItems = (data) => {
    return data.filter((item) => {
      const exp = parseDate(item.expires_at);
      return exp && exp > now;
    });
  };

  const activeItems = getActiveItems(currentData);

  // Mở link an toàn: Gọi API /api/go/[id] ở tab mới
  const openSecureLink = (id) => {
    window.open(`/api/go/${id}`, "_blank");
  };

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-top">
          <div>
            <h1 className="hero-title">Khu chia sẻ cộng đồng</h1>
            <p className="hero-desc">
              Không gian cập nhật nhanh các mục đang khả dụng. Danh sách sẽ tự làm mới liên tục để mọi người theo dõi thuận tiện hơn.
            </p>
          </div>
          <div className="pill">● Đang cập nhật tự động</div>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-label">Mục đang mở</div>
            <div className="stat-value">{activeItems.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Cập nhật gần nhất</div>
            <div className="stat-value">{formatTime(now)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Chu kỳ làm mới</div>
            <div className="stat-value">30s</div>
          </div>
        </div>
      </section>

      <div className="toolbar">
        <div>
          <h2 className="section-title">Danh sách hiện có</h2>
          <div className="section-sub">Chọn mục phù hợp để mở nhanh.</div>
        </div>
        <div className="refresh-note">Tự đồng bộ theo thời gian thực</div>
      </div>

      {loading && <div className="status-box empty-box">Đang tải dữ liệu...</div>}
      
      {error && !loading && (
        <div className="status-box error-box">Không thể tải dữ liệu lúc này.</div>
      )}

      {!loading && !error && activeItems.length === 0 && (
        <div className="status-box empty-box" style={{ lineHeight: '1.6' }}>
          <strong>Hiện chưa có mục nào khả dụng.</strong><br/>
          Nếu ko thấy mục chia sẻ nào thì hãy đợi vài giây để web tải xong hoặc đợi đến lúc web có link Netflix mới nha! C
        </div>
      )}

      {!loading && !error && activeItems.length > 0 && (
        <div className="grid">
          {activeItems.map((item, index) => {
            const exp = parseDate(item.expires_at);
            const remain = exp ? exp - now : 0;
            const btnIndex = index + 1;

            return (
              <article className="card" key={item.id}>
                <div className="card-top">
                  <h3 className="card-title">Mục chia sẻ #{btnIndex}</h3>
                  <span className="badge">Đang hoạt động</span>
                </div>
                <div className="meta">
                  <div className="meta-item">Còn lại: {formatRemain(remain)}</div>
                  <div className="meta-item">Trạng thái: Sẵn sàng mở</div>
                </div>
                <div className="btn-row">
                  {/* Dùng thẻ button + CSS chặn bôi đen thay vì thẻ a href */}
                  <button 
                    className="open-btn secure-btn" 
                    onClick={() => openSecureLink(item.id)}
                  >
                    Mở link {btnIndex}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="footer">Cộng đồng chia sẻ • Giao diện tự động cập nhật</div>
    </div>
  );
}
