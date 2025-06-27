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

4. Seed the database (If you want to populate the database with initial game data):
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

### Keploy API Test Generation

This project also uses Keploy for automated API test generation and validation. View the test results here:

[Keploy API Test Report](https://app.keploy.io/api-testing/tr/bac4b4b9-8b4c-4a1d-8596-eca6a3ff4274?suiteId=4120e72e-5dae-4108-9661-69a0b3b0f806)

Keploy automatically generates test cases based on API traffic and ensures compatibility with the API specification.

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

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

![Swagger UI Screenshot](./coverage/Screenshot%202025-06-27%20135825.png)

## Contributing

We welcome and encourage contributions to this project! Here's how you can help:

### Game Data Contributions
- **Adding Games**: Feel free to create pull requests to update the `seedData.js` file with new game entries
- **Updating Game Information**: If you notice outdated or incorrect game information, PRs to correct the data are appreciated
- **Data Format**: Ensure new game entries follow the existing schema format

### Code Contributions
- Fork the repository
- Create your feature branch (`git checkout -b feature/amazing-feature`)
- Commit your changes (`git commit -m 'Add some amazing feature'`)
- Push to the branch (`git push origin feature/amazing-feature`)
- Open a Pull Request

### API Usage
- This API is free to use for personal, educational, and commercial projects
- Please include attribution to this repository when using the API in your projects
- Consider contributing back any improvements or bug fixes you develop

All contributions are subject to the MIT License as detailed below.

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 [Kanishk]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![CI Status](https://github.com/Kanishk1420/Game-library-service/actions/workflows/ci.yml/badge.svg)
