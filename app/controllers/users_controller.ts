// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async me({ auth, response }: HttpContext) {
    await auth.check()

    if (auth.user) {
      await auth.user.load('role')
    }

    return response.ok(auth.user)
  }
}
