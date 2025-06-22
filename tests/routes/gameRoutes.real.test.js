const express = require('express');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Game = require('../../models/Game');
const gameRoutes = require('../../routes/gameRoutes');

describe('Game Routes with Real Database', () => {
  let app;
  let mongoServer;
  let testGames;

  // Set up the Express app and an in-memory MongoDB server
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    app = express();
    app.use(express.json());
    app.use('/api/games', gameRoutes);

    // Create test data
    testGames = [
      {
        title: 'Test Game 1',
        platforms: ['PC', 'PlayStation'],
        genre: ['RPG', 'Action'],
        developer: 'Test Developer',
        publisher: 'Test Publisher',
        releaseDate: new Date('2020-01-01'),
        description: 'Test game description 1',
        price: { amount: 59.99, currency: 'USD' },
        rating: 9.5
      },
      {
        title: 'Test Game 2',
        platforms: ['Xbox'],
        genre: ['Strategy', 'Simulation'],
        developer: 'Another Developer',
        publisher: 'Another Publisher',
        releaseDate: new Date('2021-02-15'),
        description: 'Test game description 2',
        price: { amount: 49.99, currency: 'USD' },
        rating: 8.7
      },
      {
        title: 'Mobile Game',
        platforms: ['Mobile'],
        genre: ['Casual'],
        developer: 'Mobile Developer',
        publisher: 'Mobile Publisher',
        releaseDate: new Date('2022-03-10'),
        description: 'A mobile game for testing',
        price: { amount: 0, currency: 'USD' },
        rating: 7.5
      }
    ];
  });

  beforeEach(async () => {
    await Game.deleteMany({});
    await Game.insertMany(testGames);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/games', () => {
    it('should get all games with pagination', async () => {
      const response = await request(app).get('/api/games?limit=2&page=1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(response.body.games).toHaveLength(2);
      expect(response.body).toHaveProperty('totalPages', 2);
      expect(response.body).toHaveProperty('currentPage', 1);
    });

    it('should filter games by platform', async () => {
      const response = await request(app).get('/api/games?platform=Mobile');
      
      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(1);
      expect(response.body.games[0].title).toBe('Mobile Game');
    });

    it('should filter games by genre', async () => {
      const response = await request(app).get('/api/games?genre=RPG');
      
      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(1);
      expect(response.body.games[0].title).toBe('Test Game 1');
    });
  });

  describe('GET /api/games/:id', () => {
    it('should get a specific game by ID', async () => {
      const allGames = await Game.find();
      const testGameId = allGames[0]._id.toString();
      
      const response = await request(app).get(`/api/games/${testGameId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', allGames[0].title);
    });

    it('should return only requested fields', async () => {
      const allGames = await Game.find();
      const testGameId = allGames[0]._id.toString();
      
      const response = await request(app).get(`/api/games/${testGameId}?fields=title,rating`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('rating');
      expect(response.body).not.toHaveProperty('description');
      expect(response.body).not.toHaveProperty('platforms');
    });

    it('should return 404 for non-existent game', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/games/${nonExistentId}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/games', () => {
    it('should create a new game', async () => {
      const newGame = {
        title: 'New Test Game',
        platforms: ['Nintendo'],
        genre: ['Adventure', 'Platformer'],
        developer: 'New Developer',
        publisher: 'New Publisher',
        releaseDate: '2024-05-15',
        description: 'A newly created test game',
        price: { amount: 39.99, currency: 'USD' },
        rating: 8.9
      };
      
      const response = await request(app)
        .post('/api/games')
        .send(newGame);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', 'New Test Game');
      
      // Verify it was actually saved to the database
      const savedGame = await Game.findById(response.body._id);
      expect(savedGame).toBeTruthy();
      expect(savedGame.title).toBe('New Test Game');
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
    });
  });

  describe('PATCH /api/games/:id', () => {
    it('should update a game partially', async () => {
      const allGames = await Game.find();
      const testGameId = allGames[0]._id.toString();
      
      const updateData = {
        rating: 9.9,
        price: { amount: 29.99 }
      };
      
      const response = await request(app)
        .patch(`/api/games/${testGameId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('rating', 9.9);
      expect(response.body.price).toHaveProperty('amount', 29.99);
      
      // Original data should be preserved
      expect(response.body).toHaveProperty('title', allGames[0].title);
      expect(response.body).toHaveProperty('platforms');
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should delete a game', async () => {
      const allGames = await Game.find();
      const testGameId = allGames[0]._id.toString();
      
      const response = await request(app).delete(`/api/games/${testGameId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Game deleted successfully');
      
      // Verify it was actually deleted from the database
      const deletedGame = await Game.findById(testGameId);
      expect(deletedGame).toBeNull();
    });
  });

  describe('GET /api/games/search', () => {
    it('should search games by title', async () => {
      const response = await request(app).get('/api/games/search?title=Mobile');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Mobile Game');
    });

    it('should search games by developer', async () => {
      const response = await request(app).get('/api/games/search?developer=Another');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Game 2');
    });

    it('should filter games by minimum rating', async () => {
      const response = await request(app).get('/api/games/search?minRating=9');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Game 1');
    });

    it('should filter games by maximum price', async () => {
      const response = await request(app).get('/api/games/search?maxPrice=40');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Mobile Game');
    });
  });

  describe('GET /api/games/platform/:platform', () => {
    it('should get games by platform', async () => {
      const response = await request(app).get('/api/games/platform/PC');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Game 1');
    });
  });

  describe('Specific endpoints for game properties', () => {
    let testGameId;
    
    beforeEach(async () => {
      const allGames = await Game.find();
      testGameId = allGames[0]._id.toString();
    });

    it('should get game platforms', async () => {
      const response = await request(app).get(`/api/games/${testGameId}/platforms`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain('PC');
      expect(response.body).toContain('PlayStation');
    });

    it('should get game genre', async () => {
      const response = await request(app).get(`/api/games/${testGameId}/genre`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain('RPG');
      expect(response.body).toContain('Action');
    });

    it('should get game developer', async () => {
      const response = await request(app).get(`/api/games/${testGameId}/developer`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('developer', 'Test Developer');
    });
  });
});