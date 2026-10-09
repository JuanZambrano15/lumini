import { Link } from 'react-router';
import logo from '@/assets/brand/logo.webp';

export function Logo({ className = 'w-20', to = '/' }: { className?: string; to?: string }) {
  return (
    <Link to={to} aria-label="Lumini, ir al inicio" className="shrink-0">
      <img src={logo} alt="Lumini" className={className} />
    </Link>
  );
}
