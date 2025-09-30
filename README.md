# PostStream

PostStream is an undesigned social network. It is a text-based response to the majority of modern social media platforms. This is certainly not for everyone as you will be interacting with others exclusively through text posts. You will notice several features intentionally left out in order to promote meaningful engagement. We hope you enjoy something a little different.

## Text-Based Social Network

Tentative example post:

    [real name] [username] [time stamp]
    [post]

    Bill Atkinson billatkinson 2016.07.24 10:27:29
    I invented the double-click.

## Prerequisites

### Option 1: Docker (Recommended)

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Option 2: Local Development

- [Node.js](https://nodejs.org/en/download/) (>=18.0.0)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup Your Project

Download and unpack [PostStream](https://github.com/JoeKarlsson/post-stream). Or alternatively checkout from source:

    git clone git@github.com:JoeKarlsson/post-stream.git
    cd post-stream

### Quick Start with Docker

1. **Start the application:**

   `docker-compose up --build`

2. **Access the application:**
   - Open [http://localhost:3002](http://localhost:3002) in your browser

The Docker setup automatically handles:

- PostgreSQL database setup
- Database migrations
- Database seeding
- All dependencies

### Local Development Setup

1. **Install dependencies:**

    npm install

1. **Setup PostgreSQL:**
   - Create a new database called `poststream_development`
   - Update `server/config/config.json` with your database credentials:

   {
     "development": {
       "username": "your_username",
       "password": "your_password",
       "database": "poststream_development",
       "host": "127.0.0.1",
       "dialect": "postgres",
       "port": 5432
     }
   }

1. **Run database migrations and seeders:**

   npx sequelize db:migrate
   npx sequelize db:seed:all

1. **Setup Auth0 credentials:**
   - Create an account at [Auth0](https://auth0.com/docs/overview)
   - Create a new application in your Auth0 dashboard
   - Create a `.env` file with your Auth0 credentials:

   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret
   AUTH0_DOMAIN=your_domain.auth0.com
   AUTH0_CALLBACK_URL=<http://localhost:3000/>
   AUTH0_TOKEN=your_token

1. **Build the application (first time only):**

   npm run build

1. **Start the development server:**

   npm run dev

   This will start:
   - Vite dev server on [http://localhost:3000](http://localhost:3000) (frontend)
   - Express API server on [http://localhost:3001](http://localhost:3001) (backend)

1. **Access the application:**
   - Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Build Tools & Technology Stack

PostStream now uses modern build tools for improved performance:

- **Vite**: Lightning-fast build tool with instant HMR (Hot Module Replacement)
- **React 18.3**: Latest React with modern features
- **Redux 5**: State management with improved TypeScript support
- **React Router DOM 6**: Modern routing solution
- **SCSS Modules**: Scoped styling with CSS modules
- **ESLint 8**: Modern linting with React hooks support

### Available Scripts

- `npm run dev` - Start development (both Vite and Express concurrently)
- `npm run dev:client` - Start Vite dev server only
- `npm run dev:server` - Start Express server only
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run server tests

## Update Your Project

In order to get an update from this repo, open your directory and type this command:

    git pull

If you're using Docker, rebuild the containers after pulling updates:

    docker-compose down
    docker-compose up --build

For major updates, you may need to:

    rm -rf node_modules package-lock.json
    npm install
    npm run build

### Important concepts

- No public metrics
  - No visible follower/following numbers
  - No visible like/dislike numbers
- No global public feed
  - No "moments" or news-related feeds
  - No trending topics to browse
- Character limit
  - Brevity
  - Accessibilty
  - Stream shows 256 characters with "read more" expandable to 2048 character limit
- No video/images/gifs
  - Unicode support 🆗
- Contextual responses
  - agree
  - agree for $reason
  - disagree
  - disagree for $reason
  - tell me more about $thought / $opinion
  - thank you for sharing
  - brilliant
- No ads or sponsored posts

## Stretch Goals

- Possible fuzzy metrics (Your engagement is {very high} {high} {average})
- SMS-support
- Filtering of topics
  - Mute options for keywords
  - Signup categories - subscribe to posts from only certain categories
  - Autofilter based on keywords, hashtags
- Keybase Verification
- Highlight text [medium.com]
- Permalinks - jump to comment or highlight
- Customize appearance
  - Theme support (Github, Solarized, Tomorrow, etc.)

## Inspiration

- [Little Voices](http://www.littlevoicesapp.com)
- [Rainbow Stream](http://www.rainbowstream.org)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Docker Development

This project includes Docker support for easier development and deployment. The Docker setup includes:

- **PostgreSQL Database**: Pre-configured with the correct schema
- **Automatic Setup**: Database migrations and seeders run on startup
- **Hot Reloading**: Code changes are reflected immediately
- **Isolated Environment**: No need to install dependencies locally

### Docker Commands

- **Start services**: `docker-compose up`
- **Start in background**: `docker-compose up -d`
- **Stop services**: `docker-compose down`
- **Rebuild and start**: `docker-compose up --build`
- **View logs**: `docker-compose logs -f app`
- **Reset database**: `docker-compose down -v && docker-compose up --build`

### Docker Configuration

The application runs on port 3002 (mapped from container port 3000) to avoid conflicts with other services. The database runs on the standard PostgreSQL port 5432.

For detailed Docker setup instructions, see [DOCKER_README.md](DOCKER_README.md).

## Credits

- Ray Farias
- Jacoby Young
- Joe Karlsson

--------------------

## API Documentation

### Posts

#### Get All Posts

**Request:**

    GET /post

**Response:**

    [
      {
        "id": 1,
        "body": "JohnDoe131 post 1",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1
      },
      {
        "id": 2,
        "body": "JohnDoe131 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1
      }
    ]

#### Get Single Post

**Request:**

    GET /post/:id

**Response:**

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

#### Create New Post

**Request:**

    POST /post/new
    Content-Type: application/json

    {
      "body": "Your post content here"
    }

**Response:**

    {
      "id": 1,
      "body": "Your post content here",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

#### Edit Post

**Request:**

    PUT /post/:id/edit
    Content-Type: application/json

    {
      "body": "Updated post content"
    }

**Response:**

    {
      "id": 1,
      "body": "Updated post content",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

#### Delete Post

**Request:**

    DELETE /post/:id

**Response:**

    {
      "success": true
    }

### Comments

#### Get Post Comments

**Request:**

    GET /post/:id/comments

**Response:**

    [
      {
        "id": 2,
        "body": "JohnDoe131 comment 1 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1,
        "PostId": 2
      },
      {
        "id": 5,
        "body": "JaneDoe343 comment 2 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 2,
        "PostId": 2
      }
    ]

#### Create New Comment

**Request:**

    POST /:PostId/comments/:CommentId/newPost
    Content-Type: application/json

    {
      "body": "Your comment content here"
    }

**Response:**

    {
      "id": 1,
      "body": "Your comment content here",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

#### Edit Comment

**Request:**

    PUT /:PostId/comments/:CommentId/edit
    Content-Type: application/json

    {
      "body": "Updated comment content"
    }

**Response:**

    {
      "id": 1,
      "body": "Updated comment content",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }
