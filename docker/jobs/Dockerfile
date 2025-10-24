# ---------- Stage 1: builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (workspace)
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json .env .env.defaults.local .env.defaults.production ./

# Copy only the app and libs we need
COPY apps/jobs ./apps/jobs
COPY libs ./libs
COPY proto ./proto

# Install dependencies
RUN npm install

# Build the jobs
RUN npm run build:jobs

# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json
COPY package.json .env ./

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy build output for jobs
COPY --from=builder /app/dist/apps/jobs ./dist

# Copy proto files
COPY --from=builder /app/proto ./proto

EXPOSE 3003

CMD ["node", "dist/main.js"]