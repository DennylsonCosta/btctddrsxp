'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token')

const { parseISO, isBefore, subHours, subMinutes, format } = use('date-fns')

class ResetPasswordController {
  async store({ request, response }) {
    try{
      const { token, password} = request.only([
        'token',
        'password'
      ])

      const userToken = await Token.findByOrFail('token', token)

      if(isBefore(parseISO(userToken.created_at), subHours(subMinutes(new Date(), 10), 2))) {
        return response.status(400).json({ error: 'Invalid date range, please try again' })
      }

      const user = await userToken.user().fetch()

      user.password = password;

      await user.save()
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = ResetPasswordController
