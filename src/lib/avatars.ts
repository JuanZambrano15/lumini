import nino1 from '../../public/avatars/nino1.webp'; // Asume que tienes carpetas 'avatars'
import nino2 from '../../public/avatars/nino2.webp';
import nina1 from '../../public/avatars/nina1.webp';
import nina2 from '../../public/avatars/nina2.webp';
import nina3 from '../../public/avatars/nina3.webp';
import nina4 from '../../public/avatars/nina4.webp';
import noBinario1 from '../../public/avatars/nino1.webp';

interface Avatar {
    id: number;
    src: string;
    alt: string;
}

export const availableAvatars: Avatar[] = [
    { id: 1, src: nino1.src, alt: 'Niño Avatar 1' },
    { id: 2, src: nino2.src, alt: 'Niño Avatar 2' },
    { id: 3, src: nina1.src, alt: 'Niña Avatar 1' },
    { id: 4, src: nina2.src, alt: 'Niña Avatar 2' },
    { id: 5, src: nina3.src, alt: 'Niña Avatar 3' },
    { id: 6, src: nina4.src, alt: 'Niña Avatar 4' },
    { id: 7, src: noBinario1.src, alt: 'No Binario Avatar 1' },
    // Añade más avatares con IDs únicos
];

// Función para obtener la ruta del avatar dado su ID
export const getAvatarById = (id: number | undefined | null): string => {
    // Usa el primer avatar como fallback si el ID no se encuentra o es undefined/null
    const defaultAvatar = availableAvatars[0];
    const avatar = availableAvatars.find(a => a.id === id);
    return avatar ? avatar.src : defaultAvatar.src;
};

// Puedes definir un ID de avatar por defecto según el sexo si lo deseas para la creación inicial
export const getDefaultAvatarIdBySexo = (sexo: 'hombre' | 'mujer' | 'prefiero no decirlo'): number => {
    switch (sexo) {
        case 'hombre':
            return 1; // ID de un avatar de niño por defecto
        case 'mujer':
            return 3; // ID de un avatar de niña por defecto
        case 'prefiero no decirlo':
            return 5; // ID de un avatar no binario por defecto
        default:
            return 1; // Fallback
    }
};