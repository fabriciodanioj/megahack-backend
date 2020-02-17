import User from '../models/User';

class VerifyController {
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (user.token !== req.body.token) {
        return res.status(400).send({ error: 'Token does not match' });
      }

      const { name } = await User.findByIdAndUpdate(
        { _id: id },
        {
          verified: true,
        }
      );

      return res.status(200).send({ id, name });
    } catch (err) {
      return res.status(400).send({ error: 'Error to verify user' });
    }
  }
}

export default new VerifyController();
