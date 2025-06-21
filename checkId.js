const mongoose = require('mongoose');
const Game = require('./models/Game');
require('dotenv').config();

async function findGameId(title) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const game = await Game.findOne({ title: title });
    
    if (!game) {
      console.log(`No game found with title: ${title}`);
    } else {
      console.log(`Game: ${game.title}`);
      console.log(`ID: ${game._id}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

// Pass the game title you want to find
findGameId("The Legend of Zelda: Breath of the Wild");