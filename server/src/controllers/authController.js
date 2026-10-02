const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../config/logger');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  // Validate against demo credentials
  if (email.toLowerCase() === env.DEMO_EMAIL.toLowerCase() && password === env.DEMO_PASSWORD) {
    const token = jwt.sign(
      { email: env.DEMO_EMAIL, role: 'reviewer' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('Demo user authenticated successfully', {
      event: 'user_login',
      email: env.DEMO_EMAIL
    });

    return res.json({
      success: true,
      token,
      user: {
        email: env.DEMO_EMAIL,
        name: 'Demo Reviewer',
        role: 'reviewer'
      }
    });
  }

  logger.warn('Failed login attempt', {
    event: 'login_failed',
    emailAttempt: email
  });

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Use demo account: demo@example.com / demo123'
  });
}

async function getMe(req, res) {
  return res.json({
    success: true,
    user: {
      email: req.user.email,
      name: 'Demo Reviewer',
      role: req.user.role || 'reviewer'
    }
  });
}

module.exports = {
  login,
  getMe
};
