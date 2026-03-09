const jwt = require('jsonwebtoken');

function generateToken(req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username é obrigatório.' });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  return res.json({ token });
}

module.exports = { generateToken };
