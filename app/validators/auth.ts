import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(), // OlzHAs@GmAIl.com => olzhas@gmail.com
    password: vine.string(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        // value => email c клиента
        const matchedUser = await db.from('users').select('id').where('email', value).first()
        return !matchedUser
      }),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(128) // Защита от DoS-атак слишком длинными строками при хэшировании
      // Требуем как минимум: 1 строчную, 1 заглавную, 1 цифру и 1 спецсимвол
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .confirmed(),
    fullName: vine.string().trim(),
  })
)
