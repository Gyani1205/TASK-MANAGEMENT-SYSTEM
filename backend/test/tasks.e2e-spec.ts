/**
 * End-to-end task lifecycle test: workspace → project → task → drag-and-drop
 * reorder → activity log. Requires a real PostgreSQL database (see
 * auth.e2e-spec.ts for setup instructions).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let workspaceId: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = moduleFixture.get(PrismaService);

    const guest = await request(app.getHttpServer()).post('/api/v1/auth/guest');
    accessToken = guest.body.accessToken;
    userId = guest.body.user.id;

    const workspace = await request(app.getHttpServer())
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'E2E Workspace' });
    workspaceId = workspace.body.id;

    const project = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'E2E Project', key: 'E2E', workspaceId });
    projectId = project.body.id;
  });

  afterAll(async () => {
    await prisma.workspace.deleteMany({ where: { id: workspaceId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  it('creates a task at position 0 in the TODO column', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Set up CI', projectId })
      .expect(201);

    expect(response.body.status).toBe('TODO');
    expect(response.body.position).toBe(0);
  });

  it('lists tasks scoped to the project with pagination metadata', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/tasks')
      .query({ projectId })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBeGreaterThan(0);
    expect(response.body.pagination).toHaveProperty('total');
  });

  it('reorders a task into a new column and records a STATUS_CHANGED activity entry', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Write docs', projectId });

    const taskId = created.body.id;

    await request(app.getHttpServer())
      .patch(`/api/v1/tasks/${taskId}/reorder`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'DOING', position: 0 })
      .expect(200);

    const activity = await request(app.getHttpServer())
      .get('/api/v1/activities')
      .query({ taskId })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(activity.body.some((entry: any) => entry.type === 'STATUS_CHANGED')).toBe(true);
  });

  it('rejects task creation without authentication', async () => {
    await request(app.getHttpServer()).post('/api/v1/tasks').send({ title: 'No auth', projectId }).expect(401);
  });
});
