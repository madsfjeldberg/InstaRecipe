# Base image
FROM node:23-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Prisma CLI globally
RUN npx prisma generate

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Command to run the application
CMD ["npm", "start"]