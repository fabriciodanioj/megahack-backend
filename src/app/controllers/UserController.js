import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Totalvoice from 'totalvoice-node';
import User from '../models/User';
import Loan from '../models/Loan';

// import SearchPersonApi from '../../services/SearchPersonApi';

const client = new Totalvoice(process.env.APIKEY_SMS);

class UserController {
  async index(req, res) {
    try {
      const users = await User.find().populate('loan_id');
      return res.status(200).send(users);
    } catch (err) {
      return res.status(400).send({ error: 'Failed to show users' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        phone: Yup.string().required(),
        document: Yup.string().required(),
        password: Yup.string()
          .required()
          .min(6),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).send({ error: 'Validation fails' });
      }

      /*
      const response = await SearchPersonApi.post('/', {
        cpf: req.body.document,
      });
      */

      const user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).send({ error: 'This user already exists' });
      }

      const salt = bcrypt.genSaltSync(10);

      const password_hash = bcrypt.hashSync(req.body.password, salt);

      const token = Math.floor(Math.random() * 65536);

      const { quantity, active, id: loan_id } = await Loan.create({});

      const { name, email, bag } = await User.create({
        ...req.body,
        password_hash,
        token,
        loan_id,
      });

      await client.sms
        .enviar(req.body.phone, `${token}`)
        .then(data => {
          return console.log(data);
        })
        .catch(error => {
          return console.error(error);
        });

      return res.status(201).send({
        name,
        email,
        token,
        bag,
        loan: {
          quantity,
          active,
        },
      });
    } catch (err) {
      console.error(err);
      return res.send({
        error: {
          title: 'Create user failed',
          messages: err,
        },
      });
    }
  }

  async show(req, res) {
    try {
      const { doc } = req.params;
      const user = await User.findOne({ document: doc }).populate('loan_id');
      return res.status(200).send(user);
    } catch (err) {
      return res.status(400).send({ error: 'Failed to show users' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndRemove(id);

      if (!user) {
        return res.status(400).send({ msg: `User not exists` });
      }

      return res.status(200).send({ msg: `User with id: ${id} was deleted` });
    } catch (err) {
      return res.send({
        error: {
          title: 'Delete user failed',
          messages: err,
        },
      });
    }
  }
}

export default new UserController();
