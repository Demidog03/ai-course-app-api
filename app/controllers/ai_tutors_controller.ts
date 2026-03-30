import type { HttpContext } from '@adonisjs/core/http'
import { GoogleGenAI } from '@google/genai'
import env from '#start/env'

export default class AiTutorsController {
    async askTutor({ request, response }: HttpContext) {
        const { text, prompt } = request.only(['text', 'prompt'])

        if (typeof text !== 'string' || typeof prompt !== 'string' || !text.trim() || !prompt.trim()) {
            return response.badRequest({ message: 'Текст и запрос обязательны' })
        }

        const selectedText = text.trim()
        const selectedPrompt = prompt.trim()

        if (selectedText.length < 10 || selectedPrompt.length < 10) {
            return response.badRequest({ message: 'Текст и запрос должны быть не менее 3 символов' })
        }

        if (selectedText.length > 3000) {
            return response.badRequest({ message: 'Слишком длинный фрагмент текста' })
        }

        if (selectedPrompt.length > 500) {
            return response.badRequest({ message: 'Слишком длинный запрос' })
        }

        try {
            const geminiAi = new GoogleGenAI({ apiKey: env.get('GEMINI_API_KEY') })

            const systemInstruction = `
                Ты — дружелюбный и экспертный AI-репетитор на IT-платформе.
                Твой студент изучает программирование.
                Он выделил в уроке следующий фрагмент текста: "${selectedText}"
        
                Его вопрос/просьба: "${selectedPrompt}"
        
                Отвечай кратко, понятно и поддерживающе. Приводи простые аналогии и примеры кода, если это уместно.
                Не используй сложное Markdown-форматирование, пиши так, чтобы текст легко читался в обычном окне.
                `.trim()

            const aiResponse = await geminiAi.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemInstruction,
            });
            
            const aiResponseText = aiResponse?.text;

            if (!aiResponseText) {
                return response.internalServerError({ message: 'Произошла ошибка при обработке запроса' })
            }

            return response.ok({ result: aiResponseText })
        } catch (error) {
            return response.internalServerError({ message: 'AI-репетитор сейчас не доступен. Попробуйте позже.' })
        }
    }
}