const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../server');

// Mock the Game model
jest.mock('../../models/Game', () => {
  return {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn()
  };
});

const Game = require('../../models/Game');

describe('API Error Handling Tests', () => {
  // Test database error handling
  it('should handle database error on GET /api/games', async () => {
    Game.find.mockImplementationOnce(() => {
      throw new Error('Database connection error');
    });
    
    const response = await request(app).get('/api/games');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
  
  it('should handle database error on GET /api/games/:id', async () => {
    Game.findById.mockImplementationOnce(() => {
      throw new Error('Database error');
    });
    
    const response = await request(app).get('/api/games/valid-id-format');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
  
  it('should handle database error on search', async () => {
    Game.find.mockImplementationOnce(() => {
      throw new Error('Search error');
    });
    
    const response = await request(app).get('/api/games/search?title=test');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
  
  it('should handle database error on PATCH request', async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    
    Game.findByIdAndUpdate.mockImplementationOnce(() => {
      throw new Error('Database update error');
    });
    
    const response = await request(app)
      .patch(`/api/games/${validId}`)
      .send({ rating: 9.0 });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});