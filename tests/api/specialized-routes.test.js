const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const { app } = require('../../server');
const Game = require('../../models/Game');

describe('Specialized API Routes Tests', () => {
  let testGameId;
  
  // Test game with all optional fields filled
  const completeTestGame = {
    title: "API Test Complete Game",
    platforms: ["PC", "PlayStation"],
    genre: ["Test", "API"],
    developer: "Test Developer",
    publisher: "Test Publisher",
    releaseDate: new Date().toISOString(),
    description: "A game for API testing with all fields",
    coverImage: "https://example.com/cover.jpg",
    screenshots: [
      "https://example.com/screenshot1.jpg",
      "https://example.com/screenshot2.jpg"
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel i5",
        memory: "8GB RAM",
        graphics: "NVIDIA GTX 1060",
        storage: "100GB SSD"
      },
      recommended: {
        os: "Windows 11",
        processor: "Intel i7",
        memory: "16GB RAM",
        graphics: "NVIDIA RTX 3070",
        storage: "100GB SSD"
      }
    },
    price: {
      amount: 59.99,
      currency: "USD"
    },
    rating: 9.5,
    dlc: [
      {
        title: "Test DLC 1",
        description: "This is test DLC content",
        releaseDate: new Date().toISOString()
      }
    ]
  };
  
  // Setup connection and create test data
  beforeAll(async () => {
    // Ensure any previous connections are closed
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Use a dedicated test database in your Atlas cluster
    const testDbUri = process.env.MONGO_URI.replace(
      /\/([^/?]+)(\?|$)/, 
      '/test_api_routes$2'
    );
    
    await mongoose.connect(testDbUri);
    console.log('Connected to test database for specialized API routes testing');
    
    // Create a complete test game for the specialized tests
    const game = new Game(completeTestGame);
    const savedGame = await game.save();
    testGameId = savedGame._id;
  });
  
  // Clean up after tests
  afterAll(async () => {
    // Clean up the test data
    if (testGameId) {
      await Game.findByIdAndDelete(testGameId);
    }
    
    // Close the connection completely
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500)); // Give time for connections to close
    console.log('Disconnected from test database');
  });
  
  // Test specialized routes
  
  // 1. Test screenshots endpoint
  describe('GET /api/games/:id/screenshots', () => {
    it('should retrieve game screenshots', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/screenshots`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(completeTestGame.screenshots);
    });
    
    it('should return 404 when game has no screenshots', async () => {
      // Create a game without screenshots
      const gameWithoutScreenshots = {
        title: "No Screenshots Game",
        platforms: ["PC"],
        genre: ["Test"],
        developer: "Test",
        publisher: "Test",
        releaseDate: new Date().toISOString(),
        description: "A test game without screenshots",
        price: { amount: 9.99, currency: "USD" },
        rating: 5
      };
      
      const savedGame = await new Game(gameWithoutScreenshots).save();
      
      const response = await request(app)
        .get(`/api/games/${savedGame._id}/screenshots`);
      
      // Clean up
      await Game.findByIdAndDelete(savedGame._id);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No screenshots found for this game');
    });
  });
  
  // 2. Test system requirements endpoint
  describe('GET /api/games/:id/requirements', () => {
    it('should retrieve game system requirements', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/requirements`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('minimum');
      expect(response.body).toHaveProperty('recommended');
      expect(response.body.minimum).toHaveProperty('os', completeTestGame.systemRequirements.minimum.os);
    });
    
    it('should return 404 when game has no system requirements', async () => {
      // Create a game with explicitly empty system requirements
      const gameWithoutReqs = {
        title: "No Requirements Game",
        platforms: ["PC"],
        genre: ["Test"],
        developer: "Test",
        publisher: "Test",
        releaseDate: new Date().toISOString(),
        description: "A test game without system requirements",
        price: { amount: 9.99, currency: "USD" },
        rating: 5,
        // Add empty system requirements object
        systemRequirements: {}
      };
      
      const savedGame = await new Game(gameWithoutReqs).save();
      
      const response = await request(app)
        .get(`/api/games/${savedGame._id}/requirements`);
      
      // Clean up
      await Game.findByIdAndDelete(savedGame._id);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No system requirements found for this game');
    });
  });
  
  // 3. Test DLC endpoints
  describe('DLC Endpoints', () => {
    it('should get games with DLC', async () => {
      // This test requires that the Game model has a dlc field
      // Make sure your model supports this before running this test
      
      const response = await request(app)
        .get('/api/games/with-dlc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // If we have games with DLC, verify they contain dlc property
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('dlc');
      }
    });
    
    it('should get specific game\'s DLCs', async () => {
      // This test assumes your game model has dlc field
      // Add DLC to the test game if it doesn't already have it
      if (!testGameId) {
        // Create a game with DLC if we don't have one
        const gameWithDLC = {
          ...completeTestGame,
          dlc: [{ title: 'Test DLC', description: 'DLC for testing' }]
        };
        const savedGame = await new Game(gameWithDLC).save();
        testGameId = savedGame._id;
      }
      
      const response = await request(app)
        .get(`/api/games/${testGameId}/dlc`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('dlc');
      expect(Array.isArray(response.body.dlc)).toBe(true);
    });
    
    it('should return 404 when DLC is not found for a game', async () => {
      // Create a game without DLC
      const gameWithoutDLC = {
        title: "No DLC Game",
        platforms: ["PC"],
        genre: ["Test"],
        developer: "Test",
        publisher: "Test",
        releaseDate: new Date().toISOString(),
        description: "A test game without DLC",
        price: { amount: 9.99, currency: "USD" }
      };
      
      const savedGame = await new Game(gameWithoutDLC).save();
      
      const response = await request(app)
        .get(`/api/games/${savedGame._id}/dlc`);
      
      // Clean up
      await Game.findByIdAndDelete(savedGame._id);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No DLC found for this game');
    });
  });
  
  // 4. Test cover image endpoint
  describe('GET /api/games/:id/coverImage', () => {
    it('should retrieve game cover image', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/coverImage`);
      
      expect(response.status).toBe(200);
      
      // Check if response is an object with coverImage property
      if (typeof response.body === 'object' && !Array.isArray(response.body)) {
        expect(response.body).toHaveProperty('coverImage', completeTestGame.coverImage);
      } 
      // Or if response is just the string URL directly
      else {
        expect(response.body).toBe(completeTestGame.coverImage);
      }
    });
  });
  
  // 5. Test edge cases for various endpoints
  describe('Edge Cases', () => {
    it('should handle pagination with invalid page numbers', async () => {
      const response = await request(app)
        .get('/api/games?page=-1&limit=10');
      
      // Should default to page 1
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('currentPage');
      expect(parseInt(response.body.currentPage)).toBeGreaterThanOrEqual(1);
    });
    
    it('should handle searching with special characters', async () => {
      const response = await request(app)
        .get('/api/games/search?title=Test%20%26%20Special%20*%20Characters');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
    
    it('should handle multiple filters simultaneously', async () => {
      const response = await request(app)
        .get('/api/games?platform=PC&genre=Test&minRating=8&maxPrice=60');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBe(true);
    });
  });
});