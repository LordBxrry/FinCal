const crypto = require('crypto');
const { kv } = require('@vercel/kv');

// Hash password with salt
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { action, email, password, name } = req.body;

    if (!action || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const userKey = `user:${email}`;

    if (action === 'signup') {
      if (!name) {
        res.status(400).json({ error: 'Name is required for signup' });
        return;
      }

      // Check if user already exists
      const existingUser = await kv.get(userKey);
      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      // Create new user
      const hashedPassword = hashPassword(password);
      const token = generateToken();
      const userData = {
        email,
        name,
        password: hashedPassword,
        token,
        createdAt: new Date().toISOString(),
        data: {} // Empty financial data to start
      };

      // Save user (expires in 365 days)
      await kv.set(userKey, JSON.stringify(userData), { ex: 365 * 24 * 60 * 60 });
      
      // Save token for quick lookup (expires in 30 days)
      await kv.set(`token:${token}`, email, { ex: 30 * 24 * 60 * 60 });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { email, name }
      });
    } else if (action === 'signin') {
      // Get user
      const userStr = await kv.get(userKey);
      if (!userStr) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const user = JSON.parse(userStr);
      const hashedPassword = hashPassword(password);

      if (user.password !== hashedPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate new token
      const token = generateToken();
      user.token = token;

      // Update user with new token
      await kv.set(userKey, JSON.stringify(user), { ex: 365 * 24 * 60 * 60 });
      
      // Save new token for quick lookup
      await kv.set(`token:${token}`, email, { ex: 30 * 24 * 60 * 60 });

      res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: { email, name: user.name }
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
