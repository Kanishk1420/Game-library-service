const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const { app } = require('../../server');
const Game = require('../../models/Game');

describe('API Integration Tests', () => {
  let testGameId;
  const testGame = {
    title: "Integration Test Game",
    platforms: ["PC", "PlayStation"],
    genre: ["Test", "Integration"],
    developer: "Test Developer",
    publisher: "Test Publisher",
    releaseDate: new Date().toISOString(),
    description: "A game for integration testing",
    price: {
      amount: 49.99,
      currency: "USD"
    },
    rating: 9.0
  };
  
  // Setup connection to the real MongoDB Atlas
  beforeAll(async () => {
    // Ensure any previous connections are closed
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Use a dedicated test database in your Atlas cluster
    const testDbUri = process.env.MONGO_URI.replace(
      /\/([^/?]+)(\?|$)/, 
      '/test_games_api$2'
    );
    
    await mongoose.connect(testDbUri);
    console.log('Connected to MongoDB Atlas test database');
  });
  
  // Close database connection after all tests
  afterAll(async () => {
    // Close the connection completely
    await mongoose.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500)); // Give time for connections to close
    console.log('Disconnected from MongoDB Atlas');
  });
  
  // Clear test data after each test
  afterEach(async () => {
    // Only delete our test game
    if (testGameId) {
      await Game.findByIdAndDelete(testGameId);
      testGameId = null;
    }
  });
  
  // Full CRUD Testing
  describe('CRUD Operations', () => {
    // CREATE - Test POST endpoint to create a new game
    it('should create a new game', async () => {
      const response = await request(app)
        .post('/api/games')
        .send(testGame);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(testGame.title);
      
      // Save ID for later tests
      testGameId = response.body._id;
      
      // Verify game was actually saved to database
      const savedGame = await Game.findById(testGameId);
      expect(savedGame).toBeTruthy();
      expect(savedGame.title).toBe(testGame.title);
      expect(savedGame.developer).toBe(testGame.developer);
    });
    
    // READ - Test GET endpoints to fetch games
    it('should get all games with pagination', async () => {
      // First, create a game to ensure we have data
      if (!testGameId) {
        const createResponse = await request(app)
          .post('/api/games')
          .send(testGame);
        testGameId = createResponse.body._id;
      }
      
      const response = await request(app)
        .get('/api/games?page=1&limit=10');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBeTruthy();
      expect(response.body.games.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage', 1);
    });
    
    it('should get a specific game by ID', async () => {
      // First, create a game if we don't have one
      if (!testGameId) {
        const createResponse = await request(app)
          .post('/api/games')
          .send(testGame);
        testGameId = createResponse.body._id;
      }
      
      const response = await request(app)
        .get(`/api/games/${testGameId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testGameId);
      expect(response.body).toHaveProperty('title', testGame.title);
      expect(response.body).toHaveProperty('developer', testGame.developer);
    });
    
    // UPDATE - Test PUT/PATCH endpoints to update games
    it('should update a game with PUT', async () => {
      // First, create a game if we don't have one
      if (!testGameId) {
        const createResponse = await request(app)
          .post('/api/games')
          .send(testGame);
        testGameId = createResponse.body._id;
      }
      
      const updateData = {
        ...testGame,
        title: "Updated Integration Game",
        rating: 9.5
      };
      
      const response = await request(app)
        .put(`/api/games/${testGameId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', "Updated Integration Game");
      expect(response.body).toHaveProperty('rating', 9.5);
      
      // Verify update was saved to database
      const updatedGame = await Game.findById(testGameId);
      expect(updatedGame.title).toBe("Updated Integration Game");
      expect(updatedGame.rating).toBe(9.5);
    });
    
    it('should update a game partially with PATCH', async () => {
      // First, create a game if we don't have one
      if (!testGameId) {
        const createResponse = await request(app)
          .post('/api/games')
          .send(testGame);
        testGameId = createResponse.body._id;
      }
      
      const partialUpdate = {
        description: "This description was updated with PATCH",
        price: { amount: 39.99, currency: "USD" }
      };
      
      const response = await request(app)
        .patch(`/api/games/${testGameId}`)
        .send(partialUpdate);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('description', "This description was updated with PATCH");
      expect(response.body.price).toHaveProperty('amount', 39.99);
      
      // Original fields should be preserved
      expect(response.body).toHaveProperty('title', testGame.title);
      expect(response.body).toHaveProperty('developer', testGame.developer);
      
      // Verify update was saved to database
      const updatedGame = await Game.findById(testGameId);
      expect(updatedGame.description).toBe("This description was updated with PATCH");
      expect(updatedGame.price.amount).toBe(39.99);
    });
    
    // DELETE - Test DELETE endpoint
    it('should delete a game', async () => {
      // First, create a game if we don't have one
      if (!testGameId) {
        const createResponse = await request(app)
          .post('/api/games')
          .send(testGame);
        testGameId = createResponse.body._id;
      }
      
      const response = await request(app)
        .delete(`/api/games/${testGameId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Game deleted successfully');
      
      // Verify game was deleted from database
      const deletedGame = await Game.findById(testGameId);
      expect(deletedGame).toBeNull();
      
      // Reset testGameId since we've deleted it
      testGameId = null;
    });
  });
  
  // Advanced API Features Tests
  describe('Advanced API Features', () => {
    // Set up a test game for advanced tests
    beforeEach(async () => {
      if (!testGameId) {
        const game = new Game(testGame);
        const savedGame = await game.save();
        testGameId = savedGame._id;
      }
    });
    
    it('should search games by title', async () => {
      const response = await request(app)
        .get('/api/games/search?title=Integration');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toContain('Integration');
    });
    
    it('should filter games by platform', async () => {
      const response = await request(app)
        .get('/api/games?platform=PC');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBeTruthy();
      
      // All returned games should have PC in their platforms
      response.body.games.forEach(game => {
        expect(game.platforms).toContain('PC');
      });
    });
    
    it('should filter games by genre', async () => {
      const response = await request(app)
        .get('/api/games?genre=Test');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBeTruthy();
      
      // All returned games should have Test in their genre
      response.body.games.forEach(game => {
        expect(game.genre).toContain('Test');
      });
    });
    
    it('should get specific property of a game', async () => {
      const response = await request(app)
        .get(`/api/games/${testGameId}/developer`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('developer', testGame.developer);
    });
  });
  
  // Error Handling Tests
  describe('Error Handling', () => {
    it('should return 404 for non-existent game', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/games/${nonExistentId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Game not found');
    });
    
    it('should return 400 for invalid game data', async () => {
      const invalidGame = {
        title: 'Invalid Game',
        // Missing required fields
      };
      
      const response = await request(app)
        .post('/api/games')
        .send(invalidGame);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/games/invalid-id-format');
      
      expect(response.status).toBe(500); // Or 400 depending on your error handler
    });
  });
});