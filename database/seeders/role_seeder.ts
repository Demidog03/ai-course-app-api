import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('name', [
      { id: 1, name: 'USER', description: 'Обычный студент курса' },
      { id: 2, name: 'ADMIN', description: 'Админ' },
      { id: 1, name: 'AUTHOR', description: 'Создатель контента (курса)' },
    ])
  }
}
