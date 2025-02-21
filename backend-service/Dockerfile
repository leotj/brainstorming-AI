# Stage 1: Build the application
FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Create the production environment
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally (for running the app)
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start:prod"]
