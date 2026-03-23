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
const CoursesController = () => import('#controllers/courses_controller')
import { RolesEnum } from '../app/enums/role_enums.js'
import LessonsController from "#controllers/lessons_controller";
// import {RolesEnum} from "../app/enums/role_enums.js";

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/** AUTH ROUTES */
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

// AUTH ROUTES
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
        // router.get('/test', [UsersController, 'me']).use(middleware.role([RolesEnum.ADMIN]))
      })
      .prefix('/users')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1')

// COURSE ROUTES
router
  .group(() => {
    router.get('/courses', [CoursesController, 'index'])
    router.get('/courses/my', [CoursesController, 'getMyCourses'])
    router.get('/courses/:id', [CoursesController, 'show'])
    router
      .post('/courses', [CoursesController, 'store'])
      .use(middleware.role([RolesEnum.ADMIN, RolesEnum.AUTHOR]))
    router
      .put('/courses/:id', [CoursesController, 'update'])
      .use(middleware.role([RolesEnum.ADMIN, RolesEnum.AUTHOR]))
    router
      .delete('/courses/:id', [CoursesController, 'destroy'])
      .use(middleware.role([RolesEnum.ADMIN, RolesEnum.AUTHOR]))
    router.post('/courses/:course_id/lessons', [LessonsController, 'create'])
    router.get('/courses/:course_id/lessons/:lesson_id', [LessonsController, 'show'])
    router.put('/courses/:course_id/lessons/:lesson_id', [LessonsController, 'update'])
    router.delete('/courses/:course_id/lessons/:lesson_id', [LessonsController, 'delete'])
  })
  .prefix('/api/v1')
  .use(middleware.auth({ guards: ['api'] }))
