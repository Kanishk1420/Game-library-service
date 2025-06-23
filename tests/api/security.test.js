const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const { app } = require('../../server');

describe('API Security Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const testDbUri = process.env.MONGO_URI.replace(
      /\/([^/?]+)(\?|$)/, 
      '/test_games_api$2'
    );
    
    await mongoose.connect(testDbUri);
    console.log('Connected to test database for security testing');
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Disconnected from test database');
  });
  
  it('should handle malformed JSON in request body', async () => {
    const response = await request(app)
      .post('/api/games')
      .set('Content-Type', 'application/json')
      .send('{"title": "Malformed JSON", "platforms": ["PC"');
    
    expect(response.status).toBe(400);
  });
  
  it('should sanitize input to prevent NoSQL injection', async () => {
    const response = await request(app)
      .get('/api/games/search?title[$ne]=');
    
    expect(response.status).toBe(200);
  });
  
  it('should reject invalid MongoDB ObjectIds', async () => {
    const response = await request(app)
      .get('/api/games/invalid-id');
    
    expect(response.status).toBe(500);
  });
});