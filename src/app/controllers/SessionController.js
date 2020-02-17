import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import authConfig from '../../config/auth.js';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).send({ error: 'Validation fails' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password_hash');

      if (!user) {
        return res.status(401).send({
          error: 'User not found',
        });
      }

      const verify = bcrypt.compareSync(password, user.password_hash);

      if (!verify) {
        return res.status(400).send({ error: 'Password does not match' });
      }

      const { id, name } = user;

      return res.status(200).json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(400).json({
        error: {
          title: 'User auth failed',
        },
      });
    }
  }
}

export default new SessionController();
