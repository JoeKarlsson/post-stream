# Use Node.js 10 which is compatible with bcrypt 0.8.7
FROM node:10-alpine

# Install PostgreSQL client tools and build dependencies for native modules
RUN apk add --no-cache postgresql-client python3 make g++ py3-pip

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies, skipping problematic native modules
RUN npm install --legacy-peer-deps --ignore-scripts

# Try to rebuild node-sass for ARM64
RUN npm rebuild node-sass --force || echo "node-sass rebuild failed, continuing..."

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
