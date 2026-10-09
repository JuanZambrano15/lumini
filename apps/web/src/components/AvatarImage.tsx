import { useAvatars } from '@/api/hooks';
import { avatarImages } from '@/lib/assets';

interface AvatarImageProps {
  avatarId: number;
  className?: string;
  alt?: string;
}

/** Resuelve la imagen de un avatar a partir de su id en la base de datos. */
export function AvatarImage({ avatarId, className = '', alt = '' }: AvatarImageProps) {
  const { data: avatars } = useAvatars();
  const avatar = avatars?.find((item) => item.id === avatarId);
  const src = avatar ? avatarImages[avatar.slug] : undefined;

  if (!src) return <div className={`rounded-full bg-brand-100 ${className}`} aria-hidden />;
  return (
    <img src={src} alt={alt || avatar?.name || ''} className={`object-contain ${className}`} />
  );
}
