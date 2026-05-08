import { getApiKey, getModelOverride } from './storage';
// Obfuscated embedded fallback key. Note: a static site cannot fully hide secrets;
// this only deters casual scraping. The user can override with their own key in Settings.
import { embeddedKey } from './embedded-key';

export const FREE_MODELS: { id: string; label: string; family: string }[] = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B', family: 'Llama' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3.2 3B', family: 'Llama' },
  { id: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B', family: 'Gemma' },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B', family: 'Mistral' },
  { id: 'qwen/qwen-2.5-7b-instruct:free', label: 'Qwen 2.5 7B', family: 'Qwen' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Hermes 3 405B', family: 'Llama' },
];

export const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

export type Role = 'user' | 'assistant' | 'system';
export interface Message {
  role: Role;
  content: string;
}

export function getActiveKey(): string {
  const userKey = getApiKey();
  if (userKey?.startsWith('sk-')) return userKey;
  try {
    return embeddedKey();
  } catch {
    return '';
  }
}

export function getActiveModel(): string {
  const m = getModelOverride();
  return m || DEFAULT_MODEL;
}

export interface CompletionOptions {
  model?: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  signal?: AbortSignal;
}

export async function chatCompletion(opts: CompletionOptions): Promise<string> {
  const key = getActiveKey();
  if (!key) {
    throw new Error('Нет API-ключа. Открой Настройки и добавь свой ключ OpenRouter.');
  }
  const model = opts.model || getActiveModel();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://blessblissmari.github.io',
      'X-Title': 'HopHub',
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 600,
    }),
    signal: opts.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const out = data?.choices?.[0]?.message?.content;
  if (typeof out !== 'string') throw new Error('Пустой ответ модели');
  return out.trim();
}

export async function* chatStream(opts: CompletionOptions): AsyncGenerator<string> {
  const key = getActiveKey();
  if (!key) throw new Error('Нет API-ключа');
  const model = opts.model || getActiveModel();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://blessblissmari.github.io',
      'X-Title': 'HopHub',
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 800,
      stream: true,
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`OpenRouter ${res.status}: ${res.statusText}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split('\n');
    buf = parts.pop() || '';
    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const piece = json?.choices?.[0]?.delta?.content;
        if (typeof piece === 'string') yield piece;
      } catch {
        /* ignore */
      }
    }
  }
}
