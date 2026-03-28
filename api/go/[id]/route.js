import { NextResponse } from 'next/server';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzELOCRCVWUd1b7aT6Vt0pdG74BnR397IctlPEeiTzkeEzQ2nGE4KhDjuW1E08gWy3/exec";

export async function GET(request, { params }) {
  const id = parseInt(params.id);

  try {
    // 1. Gọi lại Apps Script để lấy link gốc
    const res = await fetch(SCRIPT_URL + "?t=" + Date.now(), { cache: 'no-store' });
    const data = await res.json();

    // 2. Chuyển hướng người dùng đến link thật
    if (data[id] && data[id].url) {
      return NextResponse.redirect(data[id].url);
    } else {
      return new NextResponse("Link không tồn tại hoặc đã hết hạn", { status: 404 });
    }
  } catch (error) {
    return new NextResponse("Lỗi máy chủ", { status: 500 });
  }
}
