import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // In a real app, we'd save this to a database.
        // For this dashboard, we'll ask the user to paste it into their .env.local
        return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; background: #111; color: #eee;">
          <h1>Authentication Successful!</h1>
          <p>Copy the following <b>refresh_token</b> and add it to your <code>.env.local</code> file as <code>GOOGLE_REFRESH_TOKEN</code>:</p>
          <div style="background: #222; padding: 1rem; border-radius: 8px; word-break: break-all;">
            <code>${tokens.refresh_token}</code>
          </div>
          <p>After adding it, restart your development server.</p>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        console.error('Error exchanging code:', error);
        return NextResponse.json({ error: 'Failed to exchange code' }, { status: 500 });
    }
}
