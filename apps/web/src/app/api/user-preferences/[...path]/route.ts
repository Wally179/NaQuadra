import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path || [];
  const endpoint = pathParts.length > 0 ? `/${pathParts.join('/')}` : '';
  
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const targetUrl = `${baseUrl}/api/v1/user-preferences${endpoint}`;

  try {
    const headers = new Headers();
    const authHeader = req.headers.get('Authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const response = await fetch(targetUrl, { method: 'GET', headers });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Prefs Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path || [];
  const endpoint = pathParts.length > 0 ? `/${pathParts.join('/')}` : '';
  
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const targetUrl = `${baseUrl}/api/v1/user-preferences${endpoint}`;

  try {
    const body = await req.text();
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const response = await fetch(targetUrl, {
      method: 'PATCH',
      headers,
      body: body ? body : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Prefs Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path || [];
  const endpoint = pathParts.length > 0 ? `/${pathParts.join('/')}` : '';
  
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const targetUrl = `${baseUrl}/api/v1/user-preferences${endpoint}`;

  try {
    const body = await req.text();
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: body ? body : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Prefs Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
