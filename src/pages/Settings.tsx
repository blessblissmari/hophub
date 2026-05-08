import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  exportAll,
  getApiKey,
  getModelOverride,
  getUser,
  setApiKey,
  setModelOverride,
  setUser,
  clearAll,
} from '@/lib/storage';
import { useTheme } from '@/components/theme-provider';
import { FREE_MODELS, DEFAULT_MODEL } from '@/lib/openrouter';
import { toast } from 'sonner';
import { Settings as SettingsIcon } from 'lucide-react';
import { SectionHeader } from './Home';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = React.useState(getUser().name);
  const [apiKey, setKey] = React.useState(getApiKey());
  const [model, setModel] = React.useState(getModelOverride() || DEFAULT_MODEL);

  const save = () => {
    setUser({ name: name.trim() || 'Пивнойдетектив' });
    setApiKey(apiKey.trim());
    setModelOverride(model);
    toast.success('Настройки сохранены');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hophub-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <SettingsIcon className="mr-2 inline size-7 text-amber-500" /> Настройки
          </>
        }
        subtitle="Имя, тема, ключ, модель, экспорт"
      />
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-1 block">Имя в постах и отзывах</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Внешний вид</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="block">Тема</Label>
              <p className="text-xs text-(--color-muted-foreground)">
                Light, Dark или система
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={theme === 'light' ? 'default' : 'glass'} size="sm" onClick={() => setTheme('light')}>
                Light
              </Button>
              <Button variant={theme === 'dark' ? 'default' : 'glass'} size="sm" onClick={() => setTheme('dark')}>
                Dark
              </Button>
              <Button variant={theme === 'system' ? 'default' : 'glass'} size="sm" onClick={() => setTheme('system')}>
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OpenRouter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <Label>API-ключ (необязательно)</Label>
              <Badge variant="glass">в localStorage</Badge>
            </div>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-or-…"
            />
            <p className="mt-1 text-xs text-(--color-muted-foreground)">
              Если оставить пустым, используется встроенный ключ HopHub. Свой ключ имеет приоритет.
            </p>
          </div>
          <div>
            <Label className="mb-1 block">Модель по умолчанию</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
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
          </div>
          <Button onClick={save}>Сохранить</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="glass" onClick={exportData}>
              Экспорт JSON
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Удалить все локальные данные? Это нельзя отменить.')) {
                  clearAll();
                  toast.success('Локальные данные удалены');
                }
              }}
            >
              Стереть всё
            </Button>
          </div>
          <p className="text-xs text-(--color-muted-foreground)">
            Все ваши отзывы, посты, сеты и дейлики хранятся только на этом устройстве.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PWA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-(--color-muted-foreground)">
          <p>
            HopHub — Progressive Web App. На iPhone — Safari → «Поделиться» → «На экран Домой».
            На Android Chrome — меню → «Добавить на главный экран».
          </p>
          <PWAStatus />
        </CardContent>
      </Card>
    </div>
  );
}

function PWAStatus() {
  const [installed, setInstalled] = React.useState(false);
  const [online, setOnline] = React.useState(true);

  React.useEffect(() => {
    const standalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-expect-error iOS Safari proprietary
        window.navigator.standalone === true);
    setInstalled(standalone);
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const onUp = () => setOnline(true);
    const onDown = () => setOnline(false);
    window.addEventListener('online', onUp);
    window.addEventListener('offline', onDown);
    return () => {
      window.removeEventListener('online', onUp);
      window.removeEventListener('offline', onDown);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Badge variant={installed ? 'amber' : 'glass'}>{installed ? 'Установлено как PWA' : 'Не установлено'}</Badge>
      <Badge variant={online ? 'amber' : 'destructive'}>{online ? 'Онлайн' : 'Оффлайн'}</Badge>
      <Switch
        id="sw-test"
        checked={'serviceWorker' in navigator}
        disabled
      />
      <Label htmlFor="sw-test" className="text-(--color-muted-foreground)">
        Service Worker {('serviceWorker' in navigator) ? 'доступен' : 'недоступен'}
      </Label>
    </div>
  );
}
