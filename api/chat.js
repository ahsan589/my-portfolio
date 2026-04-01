export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY is not configured on the server.'
    });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'Portfolio AI Chat'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        max_tokens: 1024,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const upstreamError =
        data?.error?.message || data?.error || data?.message || `Upstream API error ${response.status}`;

      return res.status(response.status).json({ error: upstreamError });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unexpected server error'
    });
  }
}
