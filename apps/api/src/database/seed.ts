import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { parseQuestions } from '../learning/content';
import { avatars, games, shopItems, topics } from './seed-data';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main(): Promise<void> {
  for (const [index, avatar] of avatars.entries()) {
    await prisma.avatar.upsert({
      where: { slug: avatar.slug },
      update: { name: avatar.name, sortOrder: index },
      create: { ...avatar, sortOrder: index },
    });
  }

  for (const [topicIndex, { activities, ...topic }] of topics.entries()) {
    const saved = await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { ...topic, sortOrder: topicIndex },
      create: { ...topic, sortOrder: topicIndex },
    });

    for (const [activityIndex, activity] of activities.entries()) {
      // Valida el contenido antes de guardarlo (p. ej. que cada respuesta exista).
      parseQuestions(activity.questions);
      const data = { ...activity, topicId: saved.id, sortOrder: activityIndex };
      await prisma.activity.upsert({ where: { slug: activity.slug }, update: data, create: data });
    }
  }

  for (const [index, game] of games.entries()) {
    const data = { ...game, sortOrder: index };
    await prisma.game.upsert({ where: { slug: game.slug }, update: data, create: data });
  }

  for (const [index, item] of shopItems.entries()) {
    const data = { ...item, sortOrder: index };
    await prisma.shopItem.upsert({ where: { slug: item.slug }, update: data, create: data });
  }

  console.info(
    `Seed listo: ${avatars.length} avatares, ${topics.length} temas, ${games.length} juegos, ${shopItems.length} objetos.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
