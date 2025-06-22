# Video Games API

This project is a RESTful API for managing video game data, providing comprehensive CRUD operations and specialized endpoints for retrieving specific game information.

## API Overview

The Video Games API provides the following features:

- **CRUD Operations**: Create, read, update, and delete video game entries
- **Advanced Filtering**: Filter games by platform, genre, rating, and price
- **Search Functionality**: Search games by title, developer, and other attributes
- **Specialized Endpoints**: Access specific game properties like screenshots, system requirements, and DLC content

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest with Supertest
- **Additional Libraries**:
  - cors: For Cross-Origin Resource Sharing
  - dotenv: For environment variable management
  - mongodb-memory-server: For in-memory MongoDB testing
  - sinon: For mocking and stubbing

## Project Structure

```
├── models/             # Database models
│   └── Game.js         # Game schema definition
├── routes/             # API routes
│   └── gameRoutes.js   # Game-related endpoints
├── tests/              # Test files
│   ├── api/            # API-specific tests
│   ├── integration/    # Integration tests
│   ├── models/         # Model tests
│   └── routes/         # Route tests
├── server.js           # Express server setup
├── seedData.js         # Database seeding script
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Kanishk1420/Game-library-service.git
   cd video-games-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb+srv://your-connection-string
   PORT=5000
   ```

4. Seed the database (optional):
   ```
   node seedData.js
   ```

5. Start the server:
   ```
   npm start
   ```

The API will be available at `http://localhost:5000`.

## Running Tests

This project uses Jest as its testing framework and includes various test types:
- Unit tests
- Integration tests
- API tests
- Mock tests

### Running all tests

```
npm test
```

### Running specific test files

```
npm test -- tests/api/security.test.js
```

### Running tests with coverage

```
npm test -- --coverage
```

## Viewing Test Coverage

To view the test coverage report:

1. Run the tests with coverage:
   ```
   npm test -- --coverage
   ```

2. The coverage report will be displayed in the terminal, showing:
   - Statement coverage
   - Branch coverage
   - Function coverage
   - Line coverage

3. For a detailed HTML report, check the `coverage/lcov-report/index.html` file:
   ```
   open coverage/lcov-report/index.html  # macOS
   start coverage/lcov-report/index.html  # Windows
   ```

![Test Coverage](./coverage/Screenshot%202025-06-22%20202409.png)

> Note: To take a screenshot of your coverage report, run the tests with coverage, then open the HTML report in your browser and take a screenshot. Save it in the project root as `coverage-screenshot.png`.

## API Endpoints

### Game Management

- `GET /api/games` - Get all games with pagination
- `GET /api/games/:id` - Get a specific game by ID
- `POST /api/games` - Create a new game
- `PUT /api/games/:id` - Update a game
- `PATCH /api/games/:id` - Partially update a game
- `DELETE /api/games/:id` - Delete a game

### Search and Filtering

- `GET /api/games/search` - Search games by title, developer, etc.
- `GET /api/games?platform=PC` - Filter games by platform
- `GET /api/games?genre=RPG` - Filter games by genre
- `GET /api/games?minRating=8` - Filter games by minimum rating
- `GET /api/games?maxPrice=60` - Filter games by maximum price

### Specialized Endpoints

- `GET /api/games/:id/screenshots` - Get game screenshots
- `GET /api/games/:id/requirements` - Get game system requirements
- `GET /api/games/:id/dlc` - Get game DLC information
- `GET /api/games/:id/coverImage` - Get game cover image
- `GET /api/games/with-dlc` - Get all games with DLC
- `GET /api/games/:id/:property` - Get a specific property of a game

## Test Coverage Information

The test suite aims for comprehensive coverage of all API endpoints and functionality:

- **Integration Tests**: Test full API functionality with real database connections
- **Security Tests**: Verify API handles malicious inputs and edge cases
- **Performance Tests**: Ensure API response times meet requirements
- **Mock Tests**: Verify route handlers with mocked database interactions
- **Model Tests**: Validate schema and model validation functionality

## License

This project is licensed under the MIT License.
