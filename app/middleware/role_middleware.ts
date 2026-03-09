import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { RolesEnum } from '../enums/role_enums.js'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: RolesEnum[]) {
    const user = ctx.auth.user

    if (user && !user.role) {
      await user.load('role')
    }

    if (!user || !allowedRoles.includes(user.role?.name)) {
      return ctx.response.forbidden({
        errors: [{ message: 'User does not have required role for this action' }],
      })
    }

    await next()
  }
}
