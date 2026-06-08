"use client";

import { useState, useRef, useEffect } from "react";
import style from "./ChatWindow.module.scss";




interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  videoTitle: string;
  videoDescription?: string;
}

export default function ChatWindow({ videoTitle, videoDescription }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key не найден");
      }

     
      const conversationContext = messages
        .map((msg) => `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`)
        .join("\n");

      const systemPrompt = `Ты - дружелюбный ассистент, который помогает обсуждать видео на YouTube. 
Видео: "${videoTitle}"
${videoDescription ? `Описание: ${videoDescription}` : ""}

Правила:
1. Отвечай на русском языке
2. Будь кратким и информативным (максимум 150 слов за раз)
3. Помогай анализировать и обсуждать содержание видео, а также информацию об артисках и блогеров 
4. Предлагай интересные вопросы для обсуждения
5. Если пользователь задает вопрос не о видео, вежливо верни его к теме`;

      const fullPrompt = `${systemPrompt}\n\nИстория беседы:\n${conversationContext}\n\nПользователь: ${inputValue}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
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
          }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Ошибка Gemini API: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Извлекаем текст ответа из ответа Gemini
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Не удалось получить ответ от Gemini";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "Ошибка при отправке сообщения");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={style.chatContainer}>
      <div className={style.header}>
        <p className={style.videoTitle}>{videoTitle}</p>
      </div>

      <div className={style.messagesWrapper}>
        {messages.length === 0 && (
          <div className={style.placeholder}>
            <p> Привет! Я готов обсудить это видео с тобой.</p>
            <p>Задай мне любой вопрос о видео или попроси анализ.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`${style.message} ${style[message.role]}`}>
            <div className={style.messageContent}>
              <span className={style.avatar}>{message.role === "user" ? "👤" : "🤖"}</span>
              <div className={style.text}>
                <p>{message.content}</p>
                <span className={style.time}>
                  {message.timestamp.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${style.message} ${style.assistant}`}>
            <div className={style.messageContent}>
              <span className={style.avatar}>🤖</span>
              <div className={style.text}>
                <p className={style.loading}>
                  <span></span>
                  <span></span>
                  <span></span>
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={style.error}>
            <p>❌ {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={style.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напиши свой вопрос..."
          disabled={isLoading}
          className={style.input}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
          className={style.sendButton}
        >
          {isLoading ? "⏳" : "Спросить"}
        </button>
      </div>
    </div>
  );
}
