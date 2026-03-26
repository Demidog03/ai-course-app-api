import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('course_id')
        .unsigned()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title', 255).notNullable()
      table.jsonb('content').defaultTo('[]')
      table.integer('order_index').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
