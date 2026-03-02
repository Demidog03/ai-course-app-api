import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable().unique()
      table.string('description', 255).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id: 1,
          name: 'USER',
          description: 'Обычный студент курса',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'ADMIN',
          description: 'Админ',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'AUTHOR',
          description: 'Создатель контента (курса)',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
