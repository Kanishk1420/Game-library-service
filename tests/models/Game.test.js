const mongoose = require('mongoose');
const Game = require('../../models/Game');

describe('Game Model Tests', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test-game-api';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Game.deleteMany({});
  });

  it('should create a valid game model', async () => {
    const validGame = {
      title: 'Test Game',
      platforms: ['PC', 'PlayStation'],
      genre: ['Action', 'Adventure'],
      developer: 'Test Developer',
      publisher: 'Test Publisher',
      releaseDate: new Date('2023-01-01'),
      description: 'A game for testing',
      price: {
        amount: 59.99,
        currency: 'USD'
      }
    };

    const game = new Game(validGame);
    const savedGame = await game.save();

    expect(savedGame._id).toBeDefined();
    expect(savedGame.title).toBe(validGame.title);
    expect(savedGame.platforms).toEqual(expect.arrayContaining(validGame.platforms));
    expect(savedGame.genre).toEqual(expect.arrayContaining(validGame.genre));
    expect(savedGame.developer).toBe(validGame.developer);
    expect(savedGame.price.amount).toBe(validGame.price.amount);
  });

  it('should fail validation when required fields are missing', async () => {
    const invalidGame = {
      title: 'Test Game',
      platforms: [],
      genre: ['Action']
    };

    const game = new Game(invalidGame);
    
    await expect(game.save()).rejects.toThrow();
  });

  it('should validate platform enum values', async () => {
    const gameWithInvalidPlatform = {
      title: 'Test Game',
      platforms: ['InvalidPlatform'],
      genre: ['Action'],
      developer: 'Test Developer',
      publisher: 'Test Publisher',
      releaseDate: new Date('2023-01-01'),
      description: 'A game for testing',
      price: {
        amount: 59.99,
        currency: 'USD'
      }
    };

    const game = new Game(gameWithInvalidPlatform);
    
    await expect(game.save()).rejects.toThrow();
  });

  it('should validate price amount is a number', async () => {
    const gameWithInvalidPrice = {
      title: 'Test Game',
      platforms: ['PC'],
      genre: ['Action'],
      developer: 'Test Developer',
      publisher: 'Test Publisher',
      releaseDate: new Date('2023-01-01'),
      description: 'A game for testing',
      price: {
        amount: 'not-a-number',
        currency: 'USD'
      }
    };

    const game = new Game(gameWithInvalidPrice);
    
    await expect(game.save()).rejects.toThrow();
  });

  it('should validate rating is between 0 and 10', async () => {
    const gameWithInvalidRating = {
      title: 'Test Game',
      platforms: ['PC'],
      genre: ['Action'],
      developer: 'Test Developer',
      publisher: 'Test Publisher',
      releaseDate: new Date('2023-01-01'),
      description: 'A game for testing',
      price: {
        amount: 59.99,
        currency: 'USD'
      },
      rating: 11
    };

    const game = new Game(gameWithInvalidRating);
    
    await expect(game.save()).rejects.toThrow();
  });
});