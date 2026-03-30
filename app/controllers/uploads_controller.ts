import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir } from 'node:fs/promises'

export default class UploadsController {
  async editorImage({ request, response }: HttpContext) {
    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })

    if (!image) {
      return response.badRequest({
        success: 0,
        error: { message: 'Файл "image" не найден' },
      })
    }

    if (!image.isValid) {
      return response.badRequest({
        success: 0,
        error: { message: image.errors?.[0]?.message ?? 'Невалидный файл' },
      })
    }

    const uploadDir = app.makePath('public/uploads/editor')
    await mkdir(uploadDir, { recursive: true })

    const fileName = `${cuid()}.${image.extname}`
    await image.move(uploadDir, { name: fileName })

    const url = `/uploads/editor/${fileName}`
    return response.ok({
      success: 1,
      file: { url },
    })
  }
}

