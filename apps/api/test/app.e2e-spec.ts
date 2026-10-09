import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Recorre el flujo principal de la app contra una base de datos real (con seed):
 * registro → perfil → actividad → tienda del pozo → PIN → preguntas a Lumi.
 */
describe('Lumini API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const email = `e2e-${Date.now()}@lumini.test`;
  const otherEmail = `otro-${email}`;

  let accessToken: string;
  let parentToken: string;
  let childId: string;

  const auth = () => ({ Authorization: `Bearer ${accessToken}` });
  const parent = () => ({ ...auth(), 'x-parent-token': parentToken });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [email, otherEmail] } } });
    await app.close();
  });

  it('registra una cuenta', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password: 'secreto123', name: 'E2E' })
      .expect(201);
    accessToken = res.body.accessToken;
    expect(res.body.user.email).toBe(email);
  });

  it('rechaza peticiones sin token', async () => {
    await request(app.getHttpServer()).get('/api/children').expect(401);
  });

  it('crea un perfil de niño', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/children')
      .set(auth())
      .send({ name: 'Sofi', gender: 'GIRL' })
      .expect(201);
    childId = res.body.id;
    expect(res.body.stars).toBe(0);
  });

  it('califica una actividad en el servidor y otorga estrellas', async () => {
    const activity = await prisma.activity.findUniqueOrThrow({
      where: { slug: 'conteo-practica' },
    });
    const questions = activity.questions as { answer: number }[];

    const res = await request(app.getHttpServer())
      .post(`/api/children/${childId}/activities/${activity.id}/attempts`)
      .set(auth())
      .send({ answers: questions.map((q) => q.answer) })
      .expect(201);

    expect(res.body.correct).toBe(questions.length);
    expect(res.body.starsEarned).toBe(questions.length);
  });

  it('compra un objeto de la tienda con estrellas y lo equipa', async () => {
    const item = await prisma.shopItem.findUniqueOrThrow({ where: { slug: 'gorra' } });
    // Preparación: saldo suficiente para comprar.
    await prisma.child.update({ where: { id: childId }, data: { stars: { increment: 20 } } });
    const before = await prisma.child.findUniqueOrThrow({ where: { id: childId } });

    const res = await request(app.getHttpServer())
      .post(`/api/children/${childId}/items/${item.id}/purchase`)
      .set(auth())
      .expect(201);
    expect(res.body.equipped).toBe(true);

    const after = await prisma.child.findUniqueOrThrow({ where: { id: childId } });
    expect(after.stars).toBe(before.stars - item.cost);

    await request(app.getHttpServer())
      .post(`/api/children/${childId}/items/${item.id}/purchase`)
      .set(auth())
      .expect(409);
  });

  it('Lumi está apagado hasta que los padres lo activan con el PIN', async () => {
    await request(app.getHttpServer())
      .post(`/api/children/${childId}/lumi/questions`)
      .set(auth())
      .send({ question: '¿Qué es la luna?' })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/api/children/${childId}/settings`)
      .set(auth())
      .send({ aiEnabled: true })
      .expect(403);

    const pin = await request(app.getHttpServer())
      .put('/api/parent/pin')
      .set(auth())
      .send({ pin: '1234' })
      .expect(200);
    parentToken = pin.body.parentToken;

    await request(app.getHttpServer())
      .patch(`/api/children/${childId}/settings`)
      .set(parent())
      .send({ aiEnabled: true })
      .expect(200);
  });

  it('el filtro local bloquea datos personales sin cobrar estrellas', async () => {
    const before = await prisma.child.findUniqueOrThrow({ where: { id: childId } });

    const res = await request(app.getHttpServer())
      .post(`/api/children/${childId}/lumi/questions`)
      .set(auth())
      .send({ question: 'mi correo es sofi@gmail.com' })
      .expect(201);
    expect(res.body).toMatchObject({ status: 'BLOCKED', starsSpent: 0 });

    const after = await prisma.child.findUniqueOrThrow({ where: { id: childId } });
    expect(after.stars).toBe(before.stars);
  });

  it('no deja acceder a perfiles de otra cuenta', async () => {
    const other = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: otherEmail, password: 'secreto123' })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/api/children/${childId}`)
      .set({ Authorization: `Bearer ${other.body.accessToken}` })
      .expect(404);
  });
});
