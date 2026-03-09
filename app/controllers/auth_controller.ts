import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    if (user) {
      await user.load('role')
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      type: 'bearer',
      token: token.value!.release(),
      user: user.serialize(),
      message: `Welcome back, ${user.fullName}!`,
    })
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    await User.create(payload)

    return response.created({
      message: 'User registered successfully',
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.check()
    const token = auth.user?.currentAccessToken

    if (token) {
      await User.accessTokens.delete(auth.user, token.identifier)
    }

    return response.ok({
      message: 'User logged out successfully',
    })
  }
}
