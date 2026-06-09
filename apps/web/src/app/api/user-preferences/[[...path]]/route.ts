import { NextRequest, NextResponse } from 'next/server';

const getBaseUrl = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function proxyPrefsRequest(req: NextRequest, method: string, pathParts: string[]) {
  const endpoint = pathParts.length > 0 ? `/${pathParts.join('/')}` : '';
  const baseUrl = getBaseUrl();
  const targetUrl = `${baseUrl}/api/v1/user-preferences${endpoint}`;

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

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.error(`Prefs Proxy: Non-JSON response from ${targetUrl} (${response.status}):`, text.slice(0, 200));
      return NextResponse.json(
        { message: `Backend returned ${response.status}: ${response.statusText}` },
        { status: response.status >= 400 ? response.status : 502 }
      );
    }
  } catch (error) {
    console.error(`Prefs Proxy Error [${method} ${targetUrl}]:`, error);
    return NextResponse.json(
      { message: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return proxyPrefsRequest(req, 'GET', path || []);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return proxyPrefsRequest(req, 'PATCH', path || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return proxyPrefsRequest(req, 'POST', path || []);
}
