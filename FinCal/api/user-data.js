// Initialize Redis/KV client
let kv;

async function initKV() {
  if (!kv) {
    try {
      const { kv: kvClient } = await import('@vercel/kv');
      kv = kvClient;
    } catch (error) {
      console.error('Failed to initialize KV:', error);
      throw error;
    }
  }
  return kv;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize KV
    const kvClient = await initKV();

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and get email
    const email = await kvClient.get(`token:${token}`);
    if (!email) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const userKey = `user:${email}`;

    if (req.method === 'GET') {
      // Fetch user data
      const userStr = await kvClient.get(userKey);
      if (!userStr) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = JSON.parse(userStr);
      res.status(200).json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          data: user.data || {}
        }
      });
    } else if (req.method === 'POST') {
      // Save user data
      const { data } = req.body;

      if (!data) {
        res.status(400).json({ error: 'Data is required' });
        return;
      }

      const userStr = await kvClient.get(userKey);
      if (!userStr) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = JSON.parse(userStr);
      user.data = data;
      user.updatedAt = new Date().toISOString();

      // Update user with new data
      await kvClient.set(userKey, JSON.stringify(user), { ex: 365 * 24 * 60 * 60 });

      res.status(200).json({
        success: true,
        message: 'Data saved successfully'
      });
    } else {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('User data error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};
