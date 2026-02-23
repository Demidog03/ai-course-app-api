/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/** AUTH ROUTES */
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/register', [AuthController, 'register'])
        router.get('/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/me', [UsersController, 'me'])
      })
      .prefix('/users')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1')
