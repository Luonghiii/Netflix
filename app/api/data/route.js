import { NextResponse } from 'next/server';

// Link AppScript bí mật của cậu được giấu kỹ ở đây, F12 không bao giờ thấy được
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzmNyR6WOizJnFpkdsmmvE4jui8LrQlGsNhERFStnLAoeW4UZ0r8WKyDzhipHoYfJMY/exec";

export async function GET() {
  try {
    const res = await fetch(SCRIPT_URL + "?t=" + Date.now(), { cache: 'no-store' });
    const data = await res.json();
    
    // Tạo một bản sao dữ liệu nhưng GIẤU ĐI CÁI URL GỐC
    const safeData = data.map((item, index) => ({
      id: index, // Dùng số thứ tự làm ID giả
      expires_at: item.expires_at,
    }));

    return NextResponse.json(safeData);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu" }, { status: 500 });
  }
}
