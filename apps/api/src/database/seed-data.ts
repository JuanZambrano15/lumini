import type { ActivityKind, GameCategory, ItemKind, ItemSlot } from '../generated/prisma/enums';
import type { Question, TutorialStep } from '../learning/content';

// Contenido inicial de Lumini. El seed es idempotente: se puede ejecutar
// varias veces y actualiza los registros por su slug.

export const avatars = [
  { slug: 'nina-1', name: 'Sofi' },
  { slug: 'nina-2', name: 'Mía' },
  { slug: 'nina-3', name: 'Lu' },
  { slug: 'nina-4', name: 'Isa' },
  { slug: 'nino-1', name: 'Tomi' },
  { slug: 'nino-2', name: 'Leo' },
];

interface SeedActivity {
  slug: string;
  title: string;
  kind: ActivityKind;
  questions: Question[];
}

interface SeedTopic {
  slug: string;
  title: string;
  description: string;
  tutorial: TutorialStep[];
  activities: SeedActivity[];
}

export const topics: SeedTopic[] = [
  {
    slug: 'conteo-1-20',
    title: 'Conteo y números del 1 al 20',
    description: 'Contar objetos y reconocer los números.',
    tutorial: [
      {
        title: 'Contamos con el dedo',
        text: 'Señala cada objeto una sola vez mientras dices el número en voz alta.',
        visual: '👉🍎🍎🍎',
      },
      {
        title: 'El último número es el total',
        text: 'Cuando terminas de contar, el último número que dijiste es cuántos hay.',
        visual: '🍎🍎🍎 = 3',
      },
      {
        title: 'Después del 10',
        text: 'Después del 10 siguen 11, 12, 13… ¡como un diez y algo más!',
        visual: '🔟 + 3 = 13',
      },
    ],
    activities: [
      {
        slug: 'conteo-practica',
        title: 'Cuenta los objetos',
        kind: 'PRACTICE',
        questions: [
          {
            prompt: '¿Cuántas manzanas hay?',
            visual: '🍎🍎🍎',
            options: ['2', '3', '4'],
            answer: 1,
          },
          {
            prompt: '¿Cuántas estrellas hay?',
            visual: '⭐⭐⭐⭐⭐',
            options: ['5', '4', '6'],
            answer: 0,
          },
          {
            prompt: '¿Cuántos pollitos hay?',
            visual: '🐤🐤🐤🐤🐤🐤🐤',
            options: ['8', '6', '7'],
            answer: 2,
          },
          {
            prompt: '¿Qué número va después del 9?',
            visual: '7, 8, 9, ❓',
            options: ['11', '10', '8'],
            answer: 1,
          },
          {
            prompt: '¿Cuántos globos hay?',
            visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈',
            options: ['12', '11', '13'],
            answer: 0,
          },
        ],
      },
      {
        slug: 'conteo-evaluacion',
        title: 'Evaluación de conteo',
        kind: 'EVALUATION',
        questions: [
          {
            prompt: '¿Cuántas flores hay?',
            visual: '🌼🌼🌼🌼',
            options: ['3', '4', '5'],
            answer: 1,
          },
          {
            prompt: '¿Qué número va antes del 15?',
            visual: '❓, 15, 16',
            options: ['14', '13', '17'],
            answer: 0,
          },
          {
            prompt: '¿Cuántos peces hay?',
            visual: '🐟🐟🐟🐟🐟🐟🐟🐟🐟',
            options: ['10', '8', '9'],
            answer: 2,
          },
          { prompt: '¿Cuál número es el más grande?', options: ['12', '20', '18'], answer: 1 },
          {
            prompt: '¿Cuántas pelotas hay?',
            visual: '⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽',
            options: ['15', '14', '16'],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    slug: 'formas-geometricas',
    title: 'Formas geométricas básicas',
    description: 'Círculo, cuadrado, triángulo y rectángulo a nuestro alrededor.',
    tutorial: [
      {
        title: 'El círculo',
        text: 'Es redondo y no tiene esquinas, como una pelota o una pizza.',
        visual: '⚪ 🍕 ⚽',
      },
      { title: 'El cuadrado', text: 'Tiene 4 lados iguales y 4 esquinas.', visual: '🟦 🎁' },
      {
        title: 'El triángulo',
        text: 'Tiene 3 lados y 3 esquinas, como un trozo de pizza.',
        visual: '🔺 ⛺',
      },
      {
        title: 'El rectángulo',
        text: 'Tiene 4 lados: dos largos y dos cortos, como una puerta.',
        visual: '▬ 🚪 📱',
      },
    ],
    activities: [
      {
        slug: 'formas-practica',
        title: 'Encuentra la forma',
        kind: 'PRACTICE',
        questions: [
          {
            prompt: '¿Qué forma es esta?',
            visual: '🔺',
            options: ['Círculo', 'Triángulo', 'Cuadrado'],
            answer: 1,
          },
          {
            prompt: '¿Qué forma tiene una pelota?',
            visual: '⚽',
            options: ['Círculo', 'Rectángulo', 'Triángulo'],
            answer: 0,
          },
          {
            prompt: '¿Cuántos lados tiene un cuadrado?',
            visual: '🟦',
            options: ['3', '4', '5'],
            answer: 1,
          },
          {
            prompt: '¿Qué forma tiene una puerta?',
            visual: '🚪',
            options: ['Triángulo', 'Círculo', 'Rectángulo'],
            answer: 2,
          },
          {
            prompt: '¿Cuál forma no tiene esquinas?',
            options: ['Círculo', 'Cuadrado', 'Triángulo'],
            answer: 0,
          },
        ],
      },
      {
        slug: 'formas-evaluacion',
        title: 'Evaluación de formas',
        kind: 'EVALUATION',
        questions: [
          {
            prompt: '¿Cuántas esquinas tiene un triángulo?',
            visual: '🔺',
            options: ['2', '3', '4'],
            answer: 1,
          },
          {
            prompt: '¿Qué forma tiene una galleta redonda?',
            visual: '🍪',
            options: ['Círculo', 'Cuadrado', 'Rectángulo'],
            answer: 0,
          },
          {
            prompt: '¿Qué forma tiene un regalo visto de frente?',
            visual: '🎁',
            options: ['Triángulo', 'Cuadrado', 'Círculo'],
            answer: 1,
          },
          {
            prompt: '¿Qué forma tiene una carpa?',
            visual: '⛺',
            options: ['Triángulo', 'Círculo', 'Rectángulo'],
            answer: 0,
          },
          {
            prompt: '¿Qué forma tiene un celular?',
            visual: '📱',
            options: ['Círculo', 'Triángulo', 'Rectángulo'],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'tamano-cantidad',
    title: 'Relación de tamaño y cantidad',
    description: 'Grande y pequeño, más y menos.',
    tutorial: [
      {
        title: 'Grande y pequeño',
        text: 'Un elefante es grande y un ratón es pequeño.',
        visual: '🐘 🐭',
      },
      {
        title: 'Más y menos',
        text: 'El grupo que tiene más objetos es el que tiene "más".',
        visual: '🍓🍓🍓🍓 > 🍓🍓',
      },
      {
        title: 'Iguales',
        text: 'Si los dos grupos tienen la misma cantidad, son iguales.',
        visual: '🍌🍌 = 🍌🍌',
      },
    ],
    activities: [
      {
        slug: 'tamano-practica',
        title: '¿Más o menos?',
        kind: 'PRACTICE',
        questions: [
          { prompt: '¿Cuál es más grande?', options: ['🐘 Elefante', '🐭 Ratón'], answer: 0 },
          { prompt: '¿Qué grupo tiene más?', options: ['🍓🍓🍓🍓', '🍓🍓'], answer: 0 },
          { prompt: '¿Qué grupo tiene menos?', options: ['🐶🐶🐶', '🐶'], answer: 1 },
          { prompt: '¿Cuál es más pequeño?', options: ['🐜 Hormiga', '🦒 Jirafa'], answer: 0 },
          {
            prompt: '¿Los grupos son iguales?',
            visual: '🍌🍌🍌 y 🍌🍌🍌',
            options: ['Sí', 'No'],
            answer: 0,
          },
        ],
      },
      {
        slug: 'tamano-evaluacion',
        title: 'Evaluación de tamaño y cantidad',
        kind: 'EVALUATION',
        questions: [
          { prompt: '¿Qué grupo tiene más?', options: ['⭐⭐', '⭐⭐⭐⭐⭐'], answer: 1 },
          { prompt: '¿Cuál es más grande?', options: ['🏠 Casa', '🐞 Mariquita'], answer: 0 },
          { prompt: '¿Qué grupo tiene menos?', options: ['🎈🎈🎈🎈', '🎈🎈🎈'], answer: 1 },
          {
            prompt: '¿Los grupos son iguales?',
            visual: '🍎🍎 y 🍎🍎🍎',
            options: ['Sí', 'No'],
            answer: 1,
          },
          { prompt: '¿Cuál es más pequeño?', options: ['🐳 Ballena', '🐟 Pez'], answer: 1 },
        ],
      },
    ],
  },
];

interface SeedGame {
  slug: string;
  name: string;
  description: string;
  category: GameCategory;
  isAvailable: boolean;
}

// Los slugs coinciden con los componentes del frontend (apps/web/src/features/games).
export const games: SeedGame[] = [
  {
    slug: 'tres-en-raya',
    name: 'Tres en raya',
    description: 'Gana a Lumi alineando tres fichas.',
    category: 'REASONING',
    isAvailable: true,
  },
  {
    slug: 'rompecabezas',
    name: 'Rompecabezas',
    description: 'Arma la imagen pieza por pieza.',
    category: 'REASONING',
    isAvailable: false,
  },
  {
    slug: 'completa',
    name: 'Completa',
    description: 'Descubre qué sigue en la serie.',
    category: 'REASONING',
    isAvailable: false,
  },
  {
    slug: 'cubo',
    name: 'Cubo',
    description: 'Gira el cubo para encontrar la cara.',
    category: 'REASONING',
    isAvailable: false,
  },
  {
    slug: 'cartas',
    name: 'Cartas de memoria',
    description: 'Encuentra las parejas iguales.',
    category: 'MEMORY',
    isAvailable: true,
  },
  {
    slug: 'faltante',
    name: '¿Qué falta?',
    description: 'Recuerda qué objeto desapareció.',
    category: 'MEMORY',
    isAvailable: false,
  },
  {
    slug: 'donde-esta',
    name: '¿Dónde está?',
    description: 'Recuerda dónde se escondió el objeto.',
    category: 'MEMORY',
    isAvailable: false,
  },
  {
    slug: 'colores',
    name: 'Colores',
    description: 'Repite la secuencia de colores.',
    category: 'MEMORY',
    isAvailable: false,
  },
  {
    slug: 'pez-diferente',
    name: 'El pez diferente',
    description: 'Encuentra el pez distinto lo más rápido posible.',
    category: 'ATTENTION',
    isAvailable: true,
  },
  {
    slug: 'laberinto',
    name: 'Laberinto',
    description: 'Lleva al osito hasta la salida.',
    category: 'ATTENTION',
    isAvailable: false,
  },
  {
    slug: 'colorea',
    name: 'Colorea',
    description: 'Pinta siguiendo las instrucciones.',
    category: 'ATTENTION',
    isAvailable: false,
  },
  {
    slug: 'osito',
    name: 'Osito Blash',
    description: 'Atrapa las frutas que caen.',
    category: 'ATTENTION',
    isAvailable: false,
  },
];

interface SeedShopItem {
  slug: string;
  name: string;
  emoji: string;
  kind: ItemKind;
  slot: ItemSlot;
  cost: number;
}

// Objetos de la tienda del pozo. Se dibujan con emojis sobre el avatar o en un
// lugar fijo de la casa según su slot (ver apps/web/src/features/well/items.ts).
export const shopItems: SeedShopItem[] = [
  { slug: 'gorra', name: 'Gorra', emoji: '🧢', kind: 'AVATAR', slot: 'HEAD', cost: 8 },
  { slug: 'mono', name: 'Moño', emoji: '🎀', kind: 'AVATAR', slot: 'HEAD', cost: 8 },
  {
    slug: 'sombrero-mago',
    name: 'Sombrero de mago',
    emoji: '🎩',
    kind: 'AVATAR',
    slot: 'HEAD',
    cost: 15,
  },
  { slug: 'corona', name: 'Corona', emoji: '👑', kind: 'AVATAR', slot: 'HEAD', cost: 25 },
  { slug: 'gafas', name: 'Gafas', emoji: '👓', kind: 'AVATAR', slot: 'FACE', cost: 8 },
  { slug: 'gafas-sol', name: 'Gafas de sol', emoji: '🕶️', kind: 'AVATAR', slot: 'FACE', cost: 12 },
  { slug: 'mochila', name: 'Mochila', emoji: '🎒', kind: 'AVATAR', slot: 'BACK', cost: 10 },
  { slug: 'globo', name: 'Globo', emoji: '🎈', kind: 'AVATAR', slot: 'BACK', cost: 6 },
  {
    slug: 'osito',
    name: 'Osito de peluche',
    emoji: '🧸',
    kind: 'HOME',
    slot: 'HOME_FLOOR',
    cost: 10,
  },
  { slug: 'perrito', name: 'Perrito', emoji: '🐶', kind: 'HOME', slot: 'HOME_FLOOR', cost: 30 },
  { slug: 'planta', name: 'Planta', emoji: '🪴', kind: 'HOME', slot: 'HOME_FLOOR', cost: 8 },
  { slug: 'cuadro', name: 'Cuadro', emoji: '🖼️', kind: 'HOME', slot: 'HOME_WALL', cost: 10 },
  { slug: 'arcoiris', name: 'Arcoíris', emoji: '🌈', kind: 'HOME', slot: 'HOME_WALL', cost: 15 },
  { slug: 'trofeo', name: 'Trofeo', emoji: '🏆', kind: 'HOME', slot: 'HOME_SHELF', cost: 20 },
  { slug: 'cohete', name: 'Cohete', emoji: '🚀', kind: 'HOME', slot: 'HOME_SHELF', cost: 15 },
  { slug: 'luna', name: 'Luna', emoji: '🌙', kind: 'HOME', slot: 'HOME_WINDOW', cost: 10 },
  { slug: 'mariposa', name: 'Mariposa', emoji: '🦋', kind: 'HOME', slot: 'HOME_WINDOW', cost: 12 },
];
