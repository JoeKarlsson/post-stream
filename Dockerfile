# Use Node.js 20 LTS (required by some packages)
FROM node:20-alpine

# Install PostgreSQL client tools and build dependencies for native modules
RUN apk add --no-cache postgresql-client python3 make g++ py3-pip

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
