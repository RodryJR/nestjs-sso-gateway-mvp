import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
// Hecho por IA
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: `test_${Date.now()}@test.com`,
    password: 'password123',
    name: 'Test User',
  };

  it('POST /auth/register - should register a user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.access_token).toBeDefined();
        expect(body.user.email).toBe(testUser.email);
      });
  });

  it('POST /auth/login - should login with valid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200)
      .expect(({ body }) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('POST /auth/login - should fail with wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' })
      .expect(401);
  });
});