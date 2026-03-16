export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = origin === env.ALLOWED_ORIGIN ? origin : '';

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { email } = await request.json();

      if (!email || typeof email !== 'string') {
        return Response.json({ error: 'Email is required' }, { status: 400, headers: corsHeaders });
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

      const errorData = await res.text();
      return Response.json({ error: 'Subscription failed' }, { status: 502, headers: corsHeaders });
    } catch (err) {
      return Response.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
    }
  },
};
