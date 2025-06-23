const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const { app } = require('../../server');

describe('API Performance Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to test database
    const testDbUri = process.env.MONGO_URI.replace(
      /\/([^/?]+)(\?|$)/, 
      '/test_games_api$2'
    );
    
    await mongoose.connect(testDbUri);
    console.log('Connected to test database for performance testing');
  });
  
  afterAll(async () => {
    // Close the connection
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Disconnected from test database');
  });
  
  it('should respond to GET /api/games within a reasonable time', async () => {
    const start = Date.now();
    
    const response = await request(app).get('/api/games');
    
    const duration = Date.now() - start;
    console.log(`GET /api/games took ${duration}ms`);
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(500); // More realistic threshold for MongoDB Atlas
  });
  
  it('should respond to search queries within 200ms', async () => {
    const start = Date.now();
    
    const response = await request(app).get('/api/games/search?title=test');
    
    const duration = Date.now() - start;
    console.log(`GET /api/games/search took ${duration}ms`);
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(200);
  });
});