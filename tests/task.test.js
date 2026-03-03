const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService.clearTasks();
});

describe('Health Check', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Task API', () => {

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Learn Jenkins' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Learn Jenkins');
    expect(res.body.completed).toBe(false);
  });

  it('should fail if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('should return all tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Task 1' });
    await request(app).post('/tasks').send({ title: 'Task 2' });

    const res = await request(app).get('/tasks');

    expect(res.body.length).toBe(2);
  });
});
