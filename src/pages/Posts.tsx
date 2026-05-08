import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquareText, Plus, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { addPost, getPosts, getUser, reactToPost, useLocalCollection } from '@/lib/storage';
import { BEERS } from '@/data/beers';
import { relativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import { SectionHeader } from './Home';

const REACTIONS = ['🍺', '🔥', '🥨', '🤝', '👀', '💀'];

export function PostsPage() {
  const posts = useLocalCollection(getPosts);
  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <MessageSquareText className="mr-2 inline size-7 text-amber-500" />
            Посты сообщества
          </>
        }
        subtitle="Заметки, обзоры, истории и мемы про пиво"
        right={
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Новый пост
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[92%] sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Что налито?</SheetTitle>
              </SheetHeader>
              <PostComposer />
            </SheetContent>
          </Sheet>
        }
      />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {posts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{p.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{p.author}</div>
                    <div className="text-xs text-(--color-muted-foreground)">
                      {relativeTime(p.createdAt)}
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{p.body}</p>
                {p.beerIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.beerIds.map((id) => {
                      const b = BEERS.find((x) => x.id === id);
                      if (!b) return null;
                      return (
                        <Link key={id} to={`/beer/${id}`}>
                          <Badge variant="amber" className="hover:brightness-110">
                            🍺 {b.name}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {REACTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => reactToPost(p.id, emoji)}
                      className="glass-soft inline-flex items-center gap-1 px-2 py-1 text-xs transition-transform active:scale-95"
                    >
                      <span>{emoji}</span>
                      <span className="text-(--color-muted-foreground)">{p.reactions[emoji] || 0}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {posts.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-sm text-(--color-muted-foreground)">
            Ещё нет постов — будь первым!
          </p>
        </Card>
      )}
    </div>
  );
}

function PostComposer() {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [beerIds, setBeerIds] = React.useState<string[]>([]);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const user = getUser();

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Заголовок и текст обязательны');
      return;
    }
    addPost({
      title: title.trim(),
      body: body.trim(),
      author: user.name,
      beerIds,
      tags: tags
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6),
    });
    setTitle('');
    setBody('');
    setTags('');
    setBeerIds([]);
    toast.success('Пост опубликован!');
    closeRef.current?.click();
  };

  return (
    <div className="mt-6 space-y-3">
      <div>
        <Label className="mb-1 block">Заголовок</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Сегодня в баре…" />
      </div>
      <div>
        <Label className="mb-1 block">Текст</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Расскажи историю, дегустацию или впечатление" />
      </div>
      <div>
        <Label className="mb-1 block">Теги через запятую</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ipa, осень, бар-крафт" />
      </div>
      <div>
        <Label className="mb-1 block">Упомянуть пиво (опционально)</Label>
        <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {BEERS.map((b) => {
            const on = beerIds.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  setBeerIds(on ? beerIds.filter((x) => x !== b.id) : [...beerIds, b.id])
                }
              >
                <Badge variant={on ? 'amber' : 'secondary'} className="cursor-pointer">
                  {b.name}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
      <Button className="w-full" onClick={submit}>
        <Send className="size-4" />
        Опубликовать
      </Button>
      <SheetClose ref={closeRef} className="hidden" />
    </div>
  );
}
