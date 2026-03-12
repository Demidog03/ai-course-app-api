import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class CoursesController {
  async index({ response }: HttpContext) {
    const courses = await Course.query().orderBy('updatedAt', 'desc')
    return response.ok({ courses })
  }

  async show({ params, response }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Course not found' }],
      })
    }

    return response.ok({ course })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'isPublished'])
    const course = await Course.create(data)
    return response.created({ course })
  }

  async update({ params, request, response }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Course not found' }],
      })
    }

    const data = request.only(['title', 'description', 'isPublished'])

    course.merge(data)
    await course.save()

    return response.ok({ course })
  }

  async destroy({ params, response }: HttpContext) {
    const course = await Course.find(params.id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Course not found' }],
      })
    }

    await course.delete()
    return response.ok({ message: 'Course deleted' })
  }
}
