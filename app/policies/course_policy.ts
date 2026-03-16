import User from '#models/user'
import Course from '#models/course'
import { BasePolicy } from '@adonisjs/bouncer'
import { RolesEnum } from '../enums/role_enums.js'

export default class CoursePolicy extends BasePolicy {
  async view(user: User, course: Course): Promise<boolean> {
    if (!user.role) {
      await user.load('role')
    }

    const isAuthor = user.role?.name === RolesEnum.AUTHOR
    const isAdmin = user.role?.name === RolesEnum.ADMIN
    const isAuthorOfCourse = user.id === course.authorId

    if (course.isPublished) {
      return true
    }

    if (isAdmin) {
      return true
    }

    if (isAuthor && isAuthorOfCourse) {
      return true
    }

    return false
  }

  async edit(user: User, course: Course): Promise<boolean> {
    if (!user.role) {
      await user.load('role')
    }

    const isAuthor = user.role?.name === RolesEnum.AUTHOR
    const isAdmin = user.role?.name === RolesEnum.ADMIN
    const isAuthorOfCourse = user.id === course.authorId

    if (isAdmin) {
      return true
    }

    if (isAuthor && isAuthorOfCourse) {
      return true
    }

    return false
  }

  async delete(user: User, course: Course): Promise<boolean> {
    return this.edit(user, course)
  }
}
