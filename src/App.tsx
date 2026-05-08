import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/theme-provider';
import { HomePage } from './pages/Home';
import { CatalogPage } from './pages/Catalog';
import { BeerDetailPage } from './pages/BeerDetail';
import { WeeklyTopPage } from './pages/WeeklyTop';
import { DailyPage } from './pages/Daily';
import { PostsPage } from './pages/Posts';
import { SetsPage } from './pages/Sets';
import { MoodPage } from './pages/Mood';
import { MapPage } from './pages/Map';
import { AIPage } from './pages/AI';
import { SettingsPage } from './pages/Settings';
import { NotFoundPage } from './pages/NotFound';

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter basename={BASE_PATH}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="beer/:id" element={<BeerDetailPage />} />
            <Route path="top" element={<WeeklyTopPage />} />
            <Route path="daily" element={<DailyPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="sets" element={<SetsPage />} />
            <Route path="mood" element={<MoodPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="ai" element={<AIPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" theme="system" richColors />
    </ThemeProvider>
  );
}
