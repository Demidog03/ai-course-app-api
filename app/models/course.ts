import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Lesson from '#models/lesson'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare coverImage: string | null

  @column()
  declare isPublished: boolean

  @column()
  declare authorId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>
}
