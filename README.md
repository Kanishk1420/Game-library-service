# Video Game API Documentation

Welcome to the Video Game API! This comprehensive API allows you to manage and explore a vast collection of video games. Whether you're building a gaming website, mobile app, or just need game data for your project, this API has got you covered.

## 🚀 Getting Started

**Base URL:** `http://localhost:5000/api/games`

All API responses are returned in JSON format with proper content-type headers. The API automatically formats dates as `YYYY-MM-DD` and converts prices to cents for easier handling.

---

## 📋 Table of Contents

1. [Game Management](#game-management)
2. [Search & Discovery](#search--discovery)
3. [Game Properties](#game-properties)
4. [Filtering & Sorting](#filtering--sorting)
5. [DLC Management](#dlc-management)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)

---

## 📊 API Endpoints at a Glance

Here's a quick reference table of all available endpoints:

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| GET | `/api/games` | Get all games | `page`, `limit`, `platform`, `genre` |
| GET | `/api/games/:id` | Get single game | `fields` |
| POST | `/api/games` | Create new game | - |
| PUT | `/api/games/:id` | Update entire game | - |
| PATCH | `/api/games/:id` | Partially update game | - |
| DELETE | `/api/games/:id` | Delete a game | - |
| GET | `/api/games/search` | Search for games | `title`, `genre`, `developer`, `minRating`, `maxPrice` |
| GET | `/api/games/platform/:platform` | Filter by platform | - |
| GET | `/api/games/:id/platforms` | Get game platforms | - |
| GET | `/api/games/:id/genre` | Get game genres | - |
| GET | `/api/games/:id/developer` | Get game developer | - |
| GET | `/api/games/:id/screenshots` | Get game screenshots | - |
| GET | `/api/games/:id/requirements` | Get system requirements | - |
| GET | `/api/games/:id/:property` | Get any property | - |
| GET | `/api/games/with-dlc` | Get games with DLC | - |
| GET | `/api/games/:id/dlc` | Get game's DLC | - |

Now onto the detailed documentation...

---

## 🎮 Game Management

### Get All Games

Retrieve a paginated list of all games in the database.

**Endpoint:** `GET /api/games`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of games per page (default: 10)
- `platform` (optional): Filter by platform (comma-separated for multiple)
- `genre` (optional): Filter by genre (comma-separated for multiple)

**Example Request:**
```
GET /api/games?page=1&limit=5&platform=PC,PlayStation&genre=RPG
```

**Sample Response:**
```json
{
  "games": [
    {
      "_id": "64a7b8c9d2e1f3a4b5c6d7e8",
      "title": "The Witcher 3: Wild Hunt",
      "platforms": ["PC", "PlayStation", "Xbox", "Nintendo"],
      "genre": ["RPG", "Open World", "Action"],
      "developer": "CD Projekt Red",
      "publisher": "CD Projekt",
      "releaseDate": "2015-05-19",
      "description": "An action role-playing game set in an open world fantasy universe.",
      "coverImage": "https://example.com/witcher3-cover.jpg",
      "price": {
        "amount": 3999,
        "currency": "USD"
      },
      "rating": 9.3
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

### Get Single Game

Retrieve detailed information about a specific game.

**Endpoint:** `GET /api/games/:id`

**Query Parameters:**
- `fields` (optional): Specify which fields to return (comma-separated)

**Example Request:**
```
GET /api/games/64a7b8c9d2e1f3a4b5c6d7e8?fields=title,rating,price
```

**Sample Response:**
```json
{
  "title": "The Witcher 3: Wild Hunt",
  "rating": 9.3,
  "price": {
    "amount": 3999,
    "currency": "USD"
  }
}
```

### Add New Game

Create a new game entry in the database.

**Endpoint:** `POST /api/games`

**Request Body:**
```json
{
  "title": "Awesome New Game",
  "platforms": ["PC", "PlayStation"],
  "genre": ["Action", "Adventure"],
  "developer": "Amazing Studios",
  "publisher": "Great Publisher",
  "releaseDate": "2024-06-15",
  "description": "An incredible gaming experience awaits!",
  "price": {
    "amount": 59.99,
    "currency": "USD"
  },
  "rating": 8.5
}
```

**Sample Response:**
```json
{
  "_id": "64a7b8c9d2e1f3a4b5c6d7e9",
  "title": "Awesome New Game",
  "platforms": ["PC", "PlayStation"],
  "genre": ["Action", "Adventure"],
  "developer": "Amazing Studios",
  "publisher": "Great Publisher",
  "releaseDate": "2024-06-15",
  "description": "An incredible gaming experience awaits!",
  "price": {
    "amount": 5999,
    "currency": "USD"
  },
  "rating": 8.5,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Game (Complete)

Replace all game information with new data.

**Endpoint:** `PUT /api/games/:id`

**Request Body:** (Same structure as POST request)

### Update Game (Partial)

Update specific fields of a game without affecting others.

**Endpoint:** `PATCH /api/games/:id`

**Request Body Example:**
```json
{
  "rating": 9.2,
  "price": {
    "amount": 29.99
  }
}
```

### Delete Game

Remove a game from the database permanently.

**Endpoint:** `DELETE /api/games/:id`

**Sample Response:**
```json
{
  "message": "Game deleted successfully"
}
```

---

## 🔍 Search & Discovery

### Search Games

Find games using various search criteria. Perfect for implementing search functionality in your app!

**Endpoint:** `GET /api/games/search`

**Query Parameters:**
- `title`: Search by game title (case-insensitive)
- `genre`: Filter by specific genre
- `developer`: Search by developer name (case-insensitive)
- `minRating`: Minimum rating filter (0-10)
- `maxPrice`: Maximum price filter (in dollars)

**Example Request:**
```
GET /api/games/search?title=witcher&minRating=9&maxPrice=50
```

**Sample Response:**
```json
[
  {
    "_id": "64a7b8c9d2e1f3a4b5c6d7e8",
    "title": "The Witcher 3: Wild Hunt",
    "rating": 9.3,
    "price": {
      "amount": 3999,
      "currency": "USD"
    }
  }
]
```

### Filter by Platform

Get all games available on a specific platform.

**Endpoint:** `GET /api/games/platform/:platform`

**Available Platforms:** PC, PlayStation, Xbox, Nintendo, Mobile, Other

**Example Request:**
```
GET /api/games/platform/Nintendo
```

---

## 📊 Game Properties

These endpoints let you access specific properties of a game. Great for when you need just one piece of information!

### Get Game Platforms

**Endpoint:** `GET /api/games/:id/platforms`

**Sample Response:**
```json
["PC", "PlayStation", "Xbox", "Nintendo"]
```

### Get Game Genres

**Endpoint:** `GET /api/games/:id/genre`

**Sample Response:**
```json
["RPG", "Open World", "Action"]
```

### Get Game Developer

**Endpoint:** `GET /api/games/:id/developer`

**Sample Response:**
```json
{
  "developer": "CD Projekt Red"
}
```

### Get Game Screenshots

**Endpoint:** `GET /api/games/:id/screenshots`

**Sample Response:**
```json
[
  "https://example.com/screenshot1.jpg",
  "https://example.com/screenshot2.jpg",
  "https://example.com/screenshot3.jpg"
]
```

### Get System Requirements

**Endpoint:** `GET /api/games/:id/requirements`

**Sample Response:**
```json
{
  "minimum": {
    "os": "Windows 7",
    "processor": "Intel Core i5-2500K",
    "memory": "6 GB RAM",
    "graphics": "NVIDIA GeForce GTX 660",
    "storage": "35 GB"
  },
  "recommended": {
    "os": "Windows 10",
    "processor": "Intel Core i7-3770",
    "memory": "8 GB RAM",
    "graphics": "NVIDIA GeForce GTX 770",
    "storage": "35 GB"
  }
}
```

### Get Any Game Property

Access any allowed property dynamically. Super flexible!

**Endpoint:** `GET /api/games/:id/:property`

**Allowed Properties:** title, platforms, genre, developer, publisher, releaseDate, description, coverImage, screenshots, systemRequirements, price, rating

**Example Request:**
```
GET /api/games/64a7b8c9d2e1f3a4b5c6d7e8/title
```

**Sample Response:**
```json
"The Witcher 3: Wild Hunt"
```

---

## 🎯 DLC Management

### Get Games with DLC

Find all games that have downloadable content available.

**Endpoint:** `GET /api/games/with-dlc`

**Sample Response:**
```json
[
  {
    "_id": "64a7b8c9d2e1f3a4b5c6d7e8",
    "title": "The Witcher 3: Wild Hunt",
    "dlc": [
      {
        "title": "Hearts of Stone",
        "description": "A 10-hour adventure...",
        "releaseDate": "2015-10-13"
      }
    ]
  }
]
```

### Get Game's DLC

Retrieve all DLC content for a specific game.

**Endpoint:** `GET /api/games/:id/dlc`

**Sample Response:**
```json
{
  "title": "The Witcher 3: Wild Hunt",
  "dlc": [
    {
      "title": "Hearts of Stone",
      "description": "A 10-hour adventure where you'll cross paths with the enigmatic Man of Glass",
      "releaseDate": "2015-10-13"
    },
    {
      "title": "Blood and Wine",
      "description": "A 20+ hour adventure in the all-new region of Toussaint",
      "releaseDate": "2016-05-31"
    }
  ]
}
```

---

## 📝 Response Format

### Automatic Transformations

The API automatically applies these transformations to make your life easier:

1. **Dates**: Converted to `YYYY-MM-DD` format
2. **Prices**: Converted to cents (e.g., $39.99 becomes 3999)
3. **Images**: Ensures cover images have proper file extensions
4. **Content-Type**: Always set to `application/json`

### Standard Response Structure

**Success Response (Single Item):**
```json
{
  "_id": "game_id",
  "title": "Game Title",
  // ... other game properties
}
```

**Success Response (Multiple Items):**
```json
{
  "games": [...],
  "totalPages": 5,
  "currentPage": 1
}
```

**Error Response:**
```json
{
  "message": "Error description"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (invalid data or ID format)
- `404` - Not Found (game doesn't exist)
- `500` - Internal Server Error

### Common Error Messages

**Game Not Found:**
```json
{
  "message": "Game not found"
}
```

**Invalid ID Format:**
```json
{
  "message": "Invalid ID format"
}
```

**Invalid Property:**
```json
{
  "message": "Invalid property requested"
}
```

---

## 🚀 Future Plans

I'm excited to share that we have big plans for this Video Game API!

### Going Public

We're working on making this API freely available to the public! Soon, you won't need to run it locally - you'll be able to access all this game data from our hosted servers with a simple API key.

### Expanding the Game Library

Our current collection of games is just the beginning! We're committed to:

- Adding 50+ new games every month
- Including more indie titles and classics
- Expanding coverage across more platforms and genres
- Adding more detailed information like player counts and awards

### Coming Features

Some exciting features in our development pipeline:

- **User Reviews API**: Access and submit community reviews
- **Game Comparison**: Compare multiple games side-by-side
- **Similar Games**: Recommendation engine to find games like ones you enjoy
- **Live Player Stats**: Connect to real-time player count data where available
- **Price Tracking**: Historical price data and sale alerts

We're building this API with the community in mind, so if you have suggestions or requests for games or features you'd like to see, please reach out! This is a passion project meant to help developers, students, and gaming enthusiasts build amazing projects.

## 💡 Tips for Developers

1. **Pagination**: Always use pagination for large datasets to improve performance
2. **Field Selection**: Use the `fields` parameter to only fetch data you need
3. **Search Optimization**: Combine multiple search parameters for more precise results
4. **Error Handling**: Always check the HTTP status code and handle errors gracefully
5. **Price Handling**: Remember that prices are returned in cents, so divide by 100 for display
6. **Cache Responses**: Once the API goes public, implement caching to reduce your API calls

## 🎮 Happy Gaming!

This API is designed to make building gaming applications a breeze. Whether you're creating the next big gaming platform or just need some test data, we've got you covered. 

Need help? Found a bug? Have a game you'd like to see added to our database? Feel free to reach out to our development team! We're gamers too and we love hearing about the cool projects you're building with our API.

---

*Last Updated: June 2025*
