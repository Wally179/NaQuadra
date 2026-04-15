// ============================================================
// Na Quadra — API Route: Standings Proxy
// Proxies standings requests through Next.js to avoid CORS issues
// when the client-side component needs to fetch standings data.
// ============================================================
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/standings`, {
      next: { revalidate: 300, tags: ['standings'] },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ data: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [] }, { status: 502 });
  }
}
