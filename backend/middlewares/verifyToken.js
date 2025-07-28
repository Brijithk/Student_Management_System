import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
  token = token.split(' ')[1];
}

  console.log("Token received:", req.headers['authorization']);

  if (!token) return res.status(401).json({ message: 'Access denied, no token' });

  try {
    const verified = jwt.verify(token, 'mySecretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default verifyToken;