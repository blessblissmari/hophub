import { BeerGlassIcon } from './BeerGlassIcon';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group select-none">
      <div className="relative">
        <BeerGlassIcon size={32} animate />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">
        Hop
        <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Hub</span>
      </span>
    </Link>
  );
}
