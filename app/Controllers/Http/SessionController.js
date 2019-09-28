'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store({request, response, auth}){

    const { email, password } = request.only([
      'email',
      'password'
    ])

    const { token } = await auth.attempt(email, password)

    return { token }
  }

  async index({ response }) {
    const users = await User.all()
    response.send(users)
  }
}

module.exports = SessionController
