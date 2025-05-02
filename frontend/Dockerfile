# Build stage
FROM node:23-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first
COPY package.json ./

# Clean install dependencies
RUN pnpm install --no-frozen-lockfile

# Create .dockerignore if it doesn't exist to exclude node_modules
RUN echo "node_modules" > .dockerignore

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build && test -d build

# Production stage
FROM node:23-alpine

WORKDIR /app

# Copy built assets and necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Install production dependencies
RUN npm install --production --legacy-peer-deps

# Expose the port the app runs on
EXPOSE 9001

# Set the port environment variable
ENV PORT=9001

# Start the application
CMD ["node", "build"]