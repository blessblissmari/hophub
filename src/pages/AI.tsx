import * as React from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Trash2, User as UserIcon, Wand2, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { BEERS } from '@/data/beers';
import { SNACKS } from '@/data/snacks';
import { BARS } from '@/data/bars';
import {
  type Message,
  chatStream,
  FREE_MODELS,
  getActiveKey,
  getActiveModel,
} from '@/lib/openrouter';
import { setModelOverride } from '@/lib/storage';
import { toast } from 'sonner';
import { SectionHeader } from './Home';

const PROMPTS = [
  {
    icon: '🍺',
    title: 'Что выпить вечером?',
    prompt: 'Подбери 3 пива на сегодня в РФ магазинах: бюджет 600₽, я люблю горьковатое, в наличии в Перекрёстке.',
  },
  {
    icon: '🥨',
    title: 'Закуски под IPA',
    prompt: 'Какие закуски лучше всего идут под IPA? Предложи 5 вариантов и почему.',
  },
  {
    icon: '🎉',
    title: 'Сет на компанию 5 человек',
    prompt: 'Собери сет пива на компанию 5 человек с разными вкусами на пятницу. Учти баланс лёгкого и плотного.',
  },
  {
    icon: '🌶️',
    title: 'Стиль под мою еду',
    prompt: 'Я приготовил острый рамэн с курицей. Какой стиль пива подойдёт лучше всего?',
  },
];

const SYSTEM_PROMPT = buildSystemPrompt();

export function AIPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [model, setModel] = React.useState(getActiveModel());
  const [streaming, setStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const hasKey = !!getActiveKey();

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const onModelChange = (id: string) => {
    setModel(id);
    setModelOverride(id);
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput('');
    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setStreaming(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      let buf = '';
      for await (const chunk of chatStream({
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...next],
        model,
        signal: abortRef.current.signal,
      })) {
        buf += chunk;
        setMessages((curr) => {
          const copy = curr.slice();
          copy[copy.length - 1] = { role: 'assistant', content: buf };
          return copy;
        });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      toast.error((err as Error).message || 'Ошибка модели');
      setMessages((curr) => {
        const copy = curr.slice();
        copy[copy.length - 1] = {
          role: 'assistant',
          content: `Ошибка: ${(err as Error).message}. Попробуй другую модель в шапке или открой Настройки.`,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <Sparkles className="mr-2 inline size-7 text-amber-500" /> AI-сомелье
          </>
        }
        subtitle="Свободный диалог. Подберёт пиво, закуски, бары — на бесплатных моделях OpenRouter."
        right={
          <Button variant="glass" asChild size="sm">
            <Link to="/settings">
              <SettingsIcon className="size-4" /> Свой ключ
            </Link>
          </Button>
        }
      />

      {!hasKey && (
        <Card className="border border-amber-400/40 p-4 text-sm">
          Ключ не задан, но дефолтный должен работать. Если ответы не идут — открой{' '}
          <Link to="/settings" className="underline">Настройки</Link> и добавь свой OpenRouter ключ.
        </Card>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wand2 className="size-4 text-amber-500" />
            <CardTitle className="text-base">Модель</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={onModelChange}>
              <SelectTrigger className="min-w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREE_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={reset} aria-label="Очистить">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={scrollerRef} className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PROMPTS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => send(p.prompt)}
                    className="glass-soft flex flex-col items-start gap-1 p-3 text-left transition hover:bg-white/55 dark:hover:bg-white/10"
                  >
                    <div className="text-lg">{p.icon}</div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-(--color-muted-foreground)">{p.prompt}</div>
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => <MessageBubble key={i} msg={m} />)
            )}
          </div>
          <div className="mt-4 flex items-end gap-2">
            <Textarea
              placeholder="Спроси сомелье что угодно про пиво…"
              value={input}
              rows={2}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={streaming}
            />
            <Button onClick={() => send()} disabled={streaming || !input.trim()} size="lg">
              <Send className="size-4" />
            </Button>
          </div>
          <div className="mt-1 text-[11px] text-(--color-muted-foreground)">
            Ctrl/⌘+Enter — отправить. Используются только бесплатные модели OpenRouter.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FeatureCard icon="🧠" title="Контекст HopHub" desc="Модель знает наш каталог, цены и бары" />
        <FeatureCard icon="🛟" title="Fallback бесплатно" desc="Llama, Gemma, Mistral, Qwen и Hermes" />
        <FeatureCard icon="🔐" title="Свой ключ" desc="В Настройках можно вписать персональный ключ OpenRouter" />
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className="size-7">
        <AvatarFallback>{isUser ? <UserIcon className="size-3" /> : <Bot className="size-3" />}</AvatarFallback>
      </Avatar>
      <div
        className={`glass-soft max-w-[85%] whitespace-pre-wrap px-3.5 py-2 text-sm ${
          isUser ? 'bg-(--color-primary) text-(--color-primary-foreground)' : ''
        }`}
      >
        {msg.content || (isUser ? '' : <span className="opacity-60">Подбираю…</span>)}
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <Card className="p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <Badge variant="glass" className="mt-1">{desc}</Badge>
    </Card>
  );
}

function buildSystemPrompt() {
  const beers = BEERS.slice(0, 22)
    .map((b) => `- ${b.name} (${b.brewery}, ${b.country}, ${b.style}, ${b.abv}%, ${b.ibu} IBU)`)
    .join('\n');
  const snacks = SNACKS.map((s) => `- ${s.name} (${s.emoji}): к ${s.pairs.join(', ')}`).join('\n');
  const bars = BARS.slice(0, 12)
    .map((b) => `- ${b.name} (${b.city}, ${b.type}): ${b.signature}`)
    .join('\n');
  return `Ты — AI-сомелье HopHub. Отвечаешь на русском, кратко, по делу, дружелюбно. Опираешься на каталог HopHub, но можешь предлагать общеизвестные сорта.

Каталог пива:\n${beers}

Закуски:\n${snacks}

Заведения:\n${bars}

Когда советуешь — давай 3-5 вариантов с короткими пояснениями. Не выдумывай несуществующих марок. Если не уверен — скажи прямо.`;
}
