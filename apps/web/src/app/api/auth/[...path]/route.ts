import { NextRequest, NextResponse } from 'next/server';

const getBaseUrl = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function proxyRequest(req: NextRequest, method: string, pathParts: string[]) {
  const endpoint = pathParts.join('/');
  const baseUrl = getBaseUrl();
  const targetUrl = `${baseUrl}/api/v1/auth/${endpoint}`;

  try {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const authHeader = req.headers.get('Authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const fetchOptions: RequestInit = { method, headers };

    if (method !== 'GET' && method !== 'HEAD') {
      const body = await req.text();
      if (body) fetchOptions.body = body;
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Try to parse as JSON, but handle non-JSON responses gracefully
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.error(`Auth Proxy: Non-JSON response from ${targetUrl} (${response.status}):`, text.slice(0, 200));
      return NextResponse.json(
        { message: `Backend returned ${response.status}: ${response.statusText}` },
        { status: response.status >= 400 ? response.status : 502 }
      );
    }
  } catch (error) {
    console.error(`Auth Proxy Error [${method} ${targetUrl}]:`, error);
    return NextResponse.json(
      { message: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, 'POST', path || []);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, 'PATCH', path || []);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, 'GET', path || []);
}
