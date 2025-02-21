# Stage 1: Build the Next.js application
FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files from the web-apps folder
COPY web-apps/package.json web-apps/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code from web-apps
COPY web-apps/ .

# Copy .env file into the build stage
COPY .env .env

# Build the Next.js app (with environment variables)
RUN pnpm run build

# Stage 2: Serve the Next.js application
FROM node:23-alpine AS runner

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["pnpm", "start"]
