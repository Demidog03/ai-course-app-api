import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import CoursePolicy from '#policies/course_policy'

export default class CoursesController {
  async index({ response }: HttpContext) {
    const courses = await Course.query().where('isPublished', true).orderBy('updatedAt', 'desc')
    return response.ok({ courses })
  }

  async show({ params, response, bouncer }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Курс не найден' }],
      })
    }

    await bouncer.with(CoursePolicy).authorize('view', course)

    return response.ok({ course })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only(['title', 'description', 'isPublished'])
    const course = await Course.create({ ...data, authorId: auth.user!.id })
    return response.created({ course })
  }

  async update({ params, request, response, bouncer }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Курс не найден' }],
      })
    }

    await bouncer.with(CoursePolicy).authorize('edit', course)

    const data = request.only(['title', 'description', 'isPublished'])

    course.merge(data)
    await course.save()

    return response.ok({ course })
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Курс не найден' }],
      })
    }

    await bouncer.with(CoursePolicy).authorize('delete', course)

    await course.delete()
    return response.ok({ message: 'Курс удален' })
  }
}
