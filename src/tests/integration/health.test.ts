import request from 'supertest';
import app from '../../app';

describe('Health Check Integration Test', () => {
  it('should return 200 OK and health status information', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Service is healthy and running.',
      })
    );
  });
});
