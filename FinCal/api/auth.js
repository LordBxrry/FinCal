const crypto = require('crypto');
const { kv } = require('@vercel/kv');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, email, password, name } = req.body;

    if (!action || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userKey = `user:${email}`;

    if (action === 'signup') {
      if (!name) {
        return res.status(400).json({ error: 'Name is required for signup' });
      }

      const existingUser = await kv.get(userKey);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const hashedPassword = hashPassword(password);
      const token = generateToken();
      const userData = {
        email,
        name,
        password: hashedPassword,
        token,
        createdAt: new Date().toISOString(),
        data: {}
      };

      await kv.set(userKey, JSON.stringify(userData), { ex: 365 * 24 * 60 * 60 });
      await kv.set(`token:${token}`, email, { ex: 30 * 24 * 60 * 60 });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { email, name }
      });
    } else if (action === 'signin') {
      const userStr = await kv.get(userKey);
      if (!userStr) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = JSON.parse(userStr);
      const hashedPassword = hashPassword(password);

      if (user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken();
      user.token = token;

      await kv.set(userKey, JSON.stringify(user), { ex: 365 * 24 * 60 * 60 });
      await kv.set(`token:${token}`, email, { ex: 30 * 24 * 60 * 60 });

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: { email, name: user.name }
      });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
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
    console.error('Auth error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
