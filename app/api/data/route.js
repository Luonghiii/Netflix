import { NextResponse } from 'next/server';

// Link AppScript bí mật của cậu được giấu kỹ ở đây, F12 không bao giờ thấy được
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzELOCRCVWUd1b7aT6Vt0pdG74BnR397IctlPEeiTzkeEzQ2nGE4KhDjuW1E08gWy3/exec";

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
