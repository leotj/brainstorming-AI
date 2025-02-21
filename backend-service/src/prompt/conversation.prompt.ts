import OpenAI from 'openai';

export const INITIAL_SYSTEM_ROLE: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
  role: 'system',
  content:
    'You are a knowledgeable assistant. Respond in plain text only. Do not use Markdown, bullet points, bold text, or numbered lists. Write in complete sentences using normal paragraph spacing without extra newlines. Keep the response structured as a natural paragraph.',
};
