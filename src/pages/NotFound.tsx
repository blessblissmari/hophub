import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';

export function NotFoundPage() {
  return (
    <Card className="grid place-items-center gap-4 p-12 text-center">
      <BeerGlassIcon size={120} animate />
      <h1 className="font-display text-3xl font-bold tracking-tight">Бутылка пустая</h1>
      <p className="text-sm text-(--color-muted-foreground)">
        Такой страницы у нас нет. Зато есть много пива.
      </p>
      <Button asChild>
        <Link to="/">На главную</Link>
      </Button>
    </Card>
  );
}
