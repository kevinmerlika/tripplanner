# Using an image OS to run this app 
FROM node:18-alpine AS builder

# Creatin app directory
WORKDIR /app

# Installing all dependencies that are actually in the project
COPY package*.json ./
RUN npm install

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# ----------------------------- #
# Production image (no devDeps)
FROM node:18-alpine

WORKDIR /app

# Only copy production deps
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy any other file that is required for example .env or sth else
# COPY .env ./

# Exposing api on this port 
EXPOSE 4000

# Startin the server 
CMD ["node", "dist/app.js"]
