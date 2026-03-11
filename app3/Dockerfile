# Use a lightweight Node.js base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Final stage
FROM node:20-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
