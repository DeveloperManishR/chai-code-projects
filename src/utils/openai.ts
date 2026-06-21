import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Default AI model config used across agents and chat systems
export const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-5-mini';
