/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mail = use('Mail');
const Env = use('Env');

class ForgotPasswordController {
  async store({ request }) {
    const email = request.input('email');

    const user = await User.findByOrFail('email', email);

    const random = await promisify(randomBytes)(24);
    const token = random.toString('hex');

    user.tokens().create({
      token,
      type: 'forgotpassword'
    });

    const resetPassrowdUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`;

    await Mail.send(
      'emails.forgotpassword',
      { name: user.name, resetPassrowdUrl },
      message => {
        message
          .to(user.email)
          .from('dennylsonpdr@gmail.com')
          .subject('RS/XP - Recuperação de senha');
      }
    );
  }
}

module.exports = ForgotPasswordController;
