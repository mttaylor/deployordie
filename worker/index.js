const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // max requests per IP per minute
const ipRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    ipRequests.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = origin === env.ALLOWED_ORIGIN ? origin : '';

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    }

    // Rate limiting by IP
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(clientIP)) {
      return Response.json({ error: 'Too many requests' }, { status: 429, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

      if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
        return Response.json({ error: 'Valid email is required' }, { status: 400, headers: corsHeaders });
      }

      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUB_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.BEEHIIV_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: 'website',
          }),
        }
      );

      if (res.ok) {
        return Response.json({ success: true }, { headers: corsHeaders });
      }

      return Response.json({ error: 'Subscription failed' }, { status: 502, headers: corsHeaders });
    } catch (err) {
      return Response.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
    }
  },
};
