FROM node:20-alpine AS builder

# create app dir
WORKDIR /app

# Copy root package files (workspace)
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./

# Copy only the app and libs we need
COPY apps/order-service ./apps/order-service
COPY libs ./libs

# Install dependencies (uses lockfile)
RUN npm install

# Build the order-service (workspace-aware)
# Adjust the script name if your package.json uses a different build command
RUN npm run build:order-service
# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json (optional, but useful)
COPY package.json ./

# Copy node_modules from the builder (contains runtime deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy build output for order-service
COPY --from=builder /app/dist/apps/order-service ./dist

# Expose the port your app listens on
EXPOSE 3001

# Start the app (assumes dist/main.js is the entry)
CMD ["node", "dist/main.js"]
