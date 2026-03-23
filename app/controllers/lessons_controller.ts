// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import Lesson from '#models/lesson'

export default class LessonsController {
  async show({ params, response }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.lesson_id)
      .where('course_id', params.course_id)
      .first()

    if (!lesson) {
      return response.notFound({
        errors: [{ message: 'Урок не найден' }],
      })
    }

    return response.ok({ lesson })
  }

  async create({ params, request, response }: HttpContext) {
    const course = await Course.find(params.course_id)

    if (!course) {
      return response.notFound({
        errors: [{ message: 'Курс не найден' }],
      })
    }

    const data = request.only(['title', 'content', 'orderIndex'])

    const lesson = await course.related('lessons').create(data)

    return response.created({ lesson })
  }

  async update({ params, request, response }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.lesson_id)
      .where('course_id', params.course_id)
      .first()

    if (!lesson) {
      return response.notFound({
        errors: [{ message: 'Урок не найден' }],
      })
    }

    const data = request.only(['title', 'content', 'orderIndex'])

    lesson.merge(data)
    await lesson.save()

    return response.ok({ lesson })
  }

  async delete({ params, response }: HttpContext) {
    const lesson = await Lesson.query()
      .where('id', params.lesson_id)
      .where('course_id', params.course_id)
      .first()

    if (!lesson) {
      return response.notFound({
        errors: [{ message: 'Урок не найден' }],
      })
    }

    await lesson.delete()

    return response.ok({ message: 'Урок удален' })
  }
}
