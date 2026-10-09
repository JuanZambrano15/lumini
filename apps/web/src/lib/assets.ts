// Imágenes empaquetadas por Vite (optimizadas a WebP). Al importarlas, Vite
// les agrega un hash al nombre, así el navegador puede cachearlas para siempre.
import nina1 from '@/assets/avatars/nina1.webp';
import nina2 from '@/assets/avatars/nina2.webp';
import nina3 from '@/assets/avatars/nina3.webp';
import nina4 from '@/assets/avatars/nina4.webp';
import nino1 from '@/assets/avatars/nino1.webp';
import nino2 from '@/assets/avatars/nino2.webp';
import cartas from '@/assets/games/cartas.webp';
import colorear from '@/assets/games/colorear.webp';
import completar from '@/assets/games/completar.webp';
import cubo from '@/assets/games/cubo.webp';
import donde from '@/assets/games/donde.webp';
import falta from '@/assets/games/falta.webp';
import laberinto from '@/assets/games/laberinto.webp';
import osito from '@/assets/games/osito.webp';
import peces from '@/assets/games/peces.webp';
import pelota from '@/assets/games/pelota.webp';
import puzzle from '@/assets/games/puzzle.webp';
import tiktaktoe from '@/assets/games/tiktaktoe.webp';

/** Imagen de cada avatar según su slug en la base de datos. */
export const avatarImages: Record<string, string> = {
  'nina-1': nina1,
  'nina-2': nina2,
  'nina-3': nina3,
  'nina-4': nina4,
  'nino-1': nino1,
  'nino-2': nino2,
};

/** Ícono de cada juego según su slug en la base de datos. */
export const gameImages: Record<string, string> = {
  'tres-en-raya': tiktaktoe,
  rompecabezas: puzzle,
  completa: completar,
  cubo,
  cartas,
  faltante: falta,
  'donde-esta': donde,
  colores: pelota,
  'pez-diferente': peces,
  laberinto,
  colorea: colorear,
  osito,
};
