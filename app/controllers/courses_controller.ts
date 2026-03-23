import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import CoursePolicy from '#policies/course_policy'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class CoursesController {
  async index({ response }: HttpContext) {
    const courses = await Course.query().where('isPublished', true).orderBy('updatedAt', 'desc')
    return response.ok({ courses })
  }

  async getMyCourses({ response, auth }: HttpContext) {
    if (!auth?.user?.id) {
      return response.unauthorized({
        errors: [{ message: 'Не авторизован' }],
      })
    }
    const courses = await Course.query()
      .where('author_id', auth?.user?.id)
      .orderBy('is_published', 'desc')
      .orderBy('updatedAt', 'desc')
    return response.ok({ courses })
  }

  async show({ params, response, bouncer }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('lessons', (query) => {
        query.orderBy('orderIndex', 'asc')
      })
      .first()

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

    const coverImage = request.file('coverImage', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let imagePath = null

    if (coverImage) {
      const fileName = `${cuid()}.${coverImage.extname}`

      await coverImage.move(app.makePath('public/uploads'), {
        name: fileName,
      })

      imagePath = `/uploads/${fileName}`
    }

    const course = await Course.create({
      ...data,
      coverImage: imagePath,
      authorId: auth.user!.id,
    })

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

    const coverImage = request.file('coverImage', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let imagePath = null

    if (coverImage) {
      const fileName = `${cuid()}.${coverImage.extname}`

      await coverImage.move(app.makePath('public/uploads'), {
        name: fileName,
      })

      imagePath = `/uploads/${fileName}`
    }

    course.merge({ ...data, coverImage: imagePath })
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
