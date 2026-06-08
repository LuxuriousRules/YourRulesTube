import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { message, videoTitle, videoDescription, conversationHistory } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key не найден" },
        { status: 500 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Сообщение не может быть пустым" },
        { status: 400 }
      );
    }

    // Формируем контекст беседы
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`)
      .join("\n");

    const systemPrompt = `Ты - дружелюбный ассистент, который помогает обсуждать видео на YouTube. 
Видео: "${videoTitle}"
${videoDescription ? `Описание: ${videoDescription}` : ""}

Правила:
1. Отвечай на русском языке
2. Будь кратким и информативным (максимум 150 слов за раз)
3. Помогай анализировать и обсуждать содержание видео
4. Предлагай интересные вопросы для обсуждения
5. Если пользователь задает вопрос не о видео, вежливо верни его к теме`;

    const fullPrompt = `${systemPrompt}\n\nИстория беседы:\n${conversationContext}\n\nПользователь: ${message}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: `Ошибка Gemini API: ${errorData.error?.message || "Unknown error"}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Извлекаем текст ответа из ответа Gemini
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Не удалось получить ответ от Gemini";

    return NextResponse.json({
      reply: reply.trim(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: `Ошибка сервера: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
