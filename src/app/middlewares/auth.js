import jwt from 'jsonwebtoken';
import util from 'util';
import authConfig from '../../config/auth.js';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      error: 'The token is required',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await util.promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).send({
      error: 'Autentication failed',
    });
  }
};
