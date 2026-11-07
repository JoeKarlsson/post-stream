FROM node:22-alpine

# Build tools for bcrypt's native module; pg_isready for the startup wait
RUN apk add --no-cache postgresql-client python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
