const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvGet(key) {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    throw new Error('KV environment variables not configured');
  }
  const response = await fetch(`${KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
  });
  if (!response.ok) throw new Error(`KV GET failed: ${response.statusText}`);
  const data = await response.json();
  return data.result;
}

async function kvSet(key, value, options = {}) {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    throw new Error('KV environment variables not configured');
  }
  const url = new URL(`${KV_REST_API_URL}/set/${key}`);
  if (options.ex) url.searchParams.set('ex', options.ex);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  });
  if (!response.ok) throw new Error(`KV SET failed: ${response.statusText}`);
  return await response.json();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const email = await kvGet(`token:${token}`);
    if (!email) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userKey = `user:${email}`;

    if (req.method === 'GET') {
      const userStr = await kvGet(userKey);
      if (!userStr) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = JSON.parse(userStr);
      return res.status(200).json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          data: user.data || {}
        }
      });
    } else if (req.method === 'POST') {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({ error: 'Data is required' });
      }

      const userStr = await kvGet(userKey);
      if (!userStr) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = JSON.parse(userStr);
      user.data = data;
      user.updatedAt = new Date().toISOString();

      await kvSet(userKey, JSON.stringify(user), { ex: 365 * 24 * 60 * 60 });

      return res.status(200).json({
        success: true,
        message: 'Data saved successfully'
      });
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('User data error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
