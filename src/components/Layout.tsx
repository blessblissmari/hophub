import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BeerIcon,
  Calendar,
  Compass,
  Home,
  ListOrdered,
  MapPin,
  MessageSquareText,
  Settings,
  Sparkles,
  Layers,
  Menu,
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Aurora } from './Aurora';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Главная', icon: <Home className="size-4" /> },
  { to: '/catalog', label: 'Каталог', icon: <BeerIcon className="size-4" /> },
  { to: '/top', label: 'Топ недели', icon: <ListOrdered className="size-4" /> },
  { to: '/mood', label: 'Настроение', icon: <Compass className="size-4" /> },
  { to: '/sets', label: 'Сеты', icon: <Layers className="size-4" /> },
  { to: '/posts', label: 'Посты', icon: <MessageSquareText className="size-4" /> },
  { to: '/daily', label: 'Дейлики', icon: <Calendar className="size-4" /> },
  { to: '/map', label: 'Карта баров', icon: <MapPin className="size-4" /> },
  { to: '/ai', label: 'Сомелье AI', icon: <Sparkles className="size-4" /> },
  { to: '/settings', label: 'Настройки', icon: <Settings className="size-4" /> },
];

const TAB_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[3],
  NAV_ITEMS[6],
  NAV_ITEMS[8],
];

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Aurora className="fixed" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />
        <main key={pathname} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
          <Outlet />
        </main>
        <MobileTabBar />
        <Footer />
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="glass mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.slice(0, 9).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-md'
                    : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-white/40 dark:hover:bg-white/10'
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" className="lg:hidden" aria-label="Меню">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] max-w-xs">
              <SheetHeader>
                <SheetTitle>HopHub</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-(--color-primary) text-(--color-primary-foreground)'
                            : 'hover:bg-white/40 dark:hover:bg-white/10'
                        )
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-8 text-xs text-(--color-muted-foreground)">
                Все данные о ваших оценках, постах и дейликах хранятся локально на устройстве.
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileTabBar() {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 lg:hidden"
      aria-label="Нижняя навигация"
    >
      <div className="glass-strong pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-1 px-2 py-1.5">
        {TAB_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-all',
                isActive
                  ? 'bg-(--color-primary) text-(--color-primary-foreground) shadow-md'
                  : 'text-(--color-muted-foreground) hover:text-(--color-foreground)'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-8 hidden w-full max-w-6xl px-6 pb-10 text-xs text-(--color-muted-foreground) sm:block">
      <div className="glass flex flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row">
        <div>
          © {new Date().getFullYear()} HopHub — пиво, цены, бары и ИИ-сомелье в одном PWA
        </div>
        <div className="flex gap-3">
          <Link to="/settings" className="hover:text-(--color-foreground)">Настройки</Link>
          <a
            href="https://openrouter.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-(--color-foreground)"
          >
            OpenRouter
          </a>
        </div>
      </div>
    </footer>
  );
}
