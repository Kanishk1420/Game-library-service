const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const mongoose = require('mongoose');

// Response transformation middleware
router.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    // Set content type to application/json
    res.set('Content-Type', 'application/json');
    
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };
    
    const ensureImageExtension = (url) => {
      if (!url) return url;
      if (!url.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return url + ".jpg";
      }
      return url;
    };
    
    const processGame = (game) => {
      if (!game) return game;
      
      // Format releaseDate
      if (game.releaseDate) {
        game.releaseDate = formatDate(game.releaseDate);
      }
      
      // Convert price to integer (cents)
      if (game.price && game.price.amount) {
        // Keep as decimal
        game.price.amount = parseFloat(game.price.amount);
      }
      
      // Ensure coverImage has a valid extension
      if (game.coverImage) {
        game.coverImage = ensureImageExtension(game.coverImage);
      }
      
      return game;
    };
    
    // Process array of games
    if (Array.isArray(data)) {
      data = data.map(processGame);
    } 
    // Process single game
    else if (data && typeof data === 'object') {
      data = processGame(data);
    }
    
    return originalJson.call(this, data);
  };
  next();
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, platform, genre } = req.query;
    const query = {};
    
    if (platform) query.platforms = { $in: platform.split(',') };
    if (genre) query.genre = { $in: genre.split(',') };
    
    const games = await Game.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
      
    const count = await Game.countDocuments(query);
    
    res.json({
      games,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search games by title or description
router.get('/search', async (req, res) => {
  try {
    const { title, genre, developer, minRating, maxPrice } = req.query;
    let query = {};
    
    if (title) query.title = { $regex: title, $options: 'i' };
    if (genre) query.genre = { $in: [genre] };
    if (developer) query.developer = { $regex: developer, $options: 'i' };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    
    if (maxPrice) {
      query["price.amount"] = { $lte: parseFloat(maxPrice) };
    }
    
    const games = await Game.find(query);
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter games by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const games = await Game.find({ platforms: req.params.platform });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific game by ID
router.get('/:id', async (req, res) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(',').join(' ') : '';
    const game = await Game.findById(req.params.id).select(fields);
    
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new game
router.post('/', async (req, res) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Normalize price middleware
const normalizePrice = (priceData) => {
  if (priceData && priceData.amount) {
    // Ensure amount is stored as a proper decimal number
    priceData.amount = parseFloat(priceData.amount);
  }
  return priceData;
};

// Update a game
router.put('/:id', async (req, res) => {
  try {
    if (req.body.price) {
      req.body.price = normalizePrice(req.body.price);
    }
    
    console.log('Update request for ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!updatedGame) {
      console.log('Game not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Game not found' });
    }
    
    console.log('Game updated successfully:', updatedGame);
    res.json(updatedGame);
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(400).json({ message: err.message });
  }
});

// Partially update a game
router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    console.log('PATCH request received for ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedGame) {
      console.log('Game not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Game not found' });
    }
    
    console.log('Game updated successfully:', updatedGame);
    res.json(updatedGame);
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a game
router.delete('/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    
    if (!deletedGame) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get game platforms
router.get('/:id/platforms', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('platforms -_id');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game.platforms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get game genre
router.get('/:id/genre', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('genre -_id');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game.genre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get game developer
router.get('/:id/developer', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('developer -_id');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json({ developer: game.developer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get game screenshots
router.get('/:id/screenshots', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('screenshots -_id');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game.screenshots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get game system requirements
router.get('/:id/requirements', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('systemRequirements -_id');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game.systemRequirements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get games with DLC
router.get('/with-dlc', async (req, res) => {
  try {
    const gamesWithDLC = await Game.find({ 
      dlc: { $exists: true, $not: { $size: 0 } } 
    }).exec();
    
    res.json(gamesWithDLC);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get DLCs for a specific game
router.get('/:id/dlc', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).select('title dlc');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    if (!game.dlc || !Array.isArray(game.dlc)) {
      return res.status(404).json({ message: 'No DLC found for this game' });
    }
    
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a generic property access route
router.get('/:id/:property', async (req, res) => {
  try {
    const { id, property } = req.params;
    
    // List of allowed properties for security
    const allowedProperties = [
      'title', 'platforms', 'genre', 'developer', 'publisher', 
      'releaseDate', 'description', 'coverImage', 'screenshots',
      'systemRequirements', 'price', 'rating'
    ];
    
    if (!allowedProperties.includes(property)) {
      return res.status(400).json({ message: 'Invalid property requested' });
    }
    
    const projection = {};
    projection[property] = 1;
    projection._id = 0;
    
    const game = await Game.findById(id, projection);
    
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    // Return just the value of the requested property
    res.json(game[property]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;