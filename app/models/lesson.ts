import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Course from '#models/course'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare title: string

  @column()
  declare content: any

  @column()
  declare orderIndex: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>
}
