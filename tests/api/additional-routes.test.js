const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const { app } = require('../../server');
const Game = require('../../models/Game');

describe('Additional API Routes Tests', () => {
  let testGameId;
  
  // Setup
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const testDbUri = process.env.MONGO_URI.replace(/\/([^/?]+)(\?|$)/, '/test_additional_api$2');
    await mongoose.connect(testDbUri);
    
    // Create a test game
    const testGame = {
      title: "Additional API Test Game",
      platforms: ["PC"],
      genre: ["Test"],
      developer: "Test Dev",
      publisher: "Test Pub",
      releaseDate: new Date().toISOString(),
      description: "Game for additional API tests",
      price: { amount: 29.99, currency: "USD" },
      rating: 8.0
    };
    
    const game = new Game(testGame);
    const savedGame = await game.save();
    testGameId = savedGame._id;
  });
  
  // Clean up
  afterAll(async () => {
    if (testGameId) {
      await Game.findByIdAndDelete(testGameId);
    }
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  // Test the remaining uncovered endpoints
  describe('Platform specific endpoints', () => {
    it('should get games by platform', async () => {
      const response = await request(app)
        .get('/api/games/platform/PC');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        expect(response.body[0].platforms).toContain('PC');
      }
    });
  });
  
  describe('Generic Property Access Route', () => {
    it('should get a game\'s title via generic property route', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/title`);
      
      expect(response.status).toBe(200);
      // The API returns the direct value, not an object
      expect(response.body).toBe("Additional API Test Game");
    });
    
    it('should get a game\'s rating via generic property route', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/rating`);
      
      expect(response.status).toBe(200);
      // The API returns the direct value, not an object
      expect(response.body).toBe(8.0);
    });
    
    it('should return 400 for invalid property', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/invalidProperty`);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('Edge case error handling', () => {
    it('should handle invalid sort parameter', async () => {
      const response = await request(app)
        .get('/api/games?sort=invalidField');
      
      expect(response.status).toBe(200); // Should default to a valid sort
    });
    
    it('should handle extremely large limit parameter', async () => {
      const response = await request(app)
        .get('/api/games?limit=1000');
      
      expect(response.status).toBe(200);
      // Should cap at a reasonable number
      expect(response.body.games.length).toBeLessThan(100);
    });
  });
});