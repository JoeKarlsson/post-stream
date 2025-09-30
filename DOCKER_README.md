# PostStream Docker Setup

This project is now configured to run with Docker, which resolves Node.js version conflicts and dependency issues.

## Quick Start

1. **Start the application:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open <http://localhost:3002> in your browser

## What's Included

- **PostgreSQL Database**: Running on port 5432
- **PostStream Application**: Running on port 3002 (mapped from container port 3000)
- **Automatic Setup**: Database migrations and seeders run automatically

## Configuration

### Auth0 Setup (Required for Authentication)

1. Create an Auth0 account at <https://auth0.com>
2. Create a new application in your Auth0 dashboard
3. Update the `.env.docker` file with your Auth0 credentials:

   ```
   AUTH0_CLIENT_ID=your_actual_client_id
   AUTH0_CLIENT_SECRET=your_actual_client_secret
   AUTH0_DOMAIN=your_actual_domain.auth0.com
   AUTH0_CALLBACK_URL=http://localhost:3000/
   AUTH0_TOKEN=your_actual_token
   ```

### Database Configuration

The database is automatically configured with:

- Database: `poststream_development`
- Username: `postgres`
- Password: `password`
- Host: `postgres` (Docker service name)

## Development Commands

- **Start services**: `docker-compose up`
- **Start in background**: `docker-compose up -d`
- **Stop services**: `docker-compose down`
- **Rebuild and start**: `docker-compose up --build`
- **View logs**: `docker-compose logs -f app`

## Troubleshooting

If you encounter issues:

1. **Clean rebuild**: `docker-compose down && docker-compose up --build`
2. **Reset database**: `docker-compose down -v && docker-compose up --build`
3. **Check logs**: `docker-compose logs app`

## Notes

- The application uses Node.js 6.2.0 as specified in the original package.json
- All dependencies are installed with `--legacy-peer-deps` to resolve version conflicts
- Database migrations and seeders run automatically on startup
- The application will wait for PostgreSQL to be ready before starting
