# =========================================================================
# Lesson 43: Production-Optimized Multi-Stage Dockerfile for Node.js API
# Demonstrates: Alpine base image, Layer Caching, Non-Root user, pnpm support
# =========================================================================

# === STAGE 1: Dependency Installation & Layer Cache Optimization ===
FROM node:18-alpine AS base

# Set working directory inside container filesystem
WORKDIR /usr/src/app

# Enable Corepack for native pnpm support in Alpine Linux
RUN corepack enable

# Copy ONLY dependency manifests first!
# Why? This isolates dependencies into a dedicated cached layer.
# Editing source code in src/ will NOT invalidate this step!
COPY package.json pnpm-lock.yaml ./

# Install project dependencies cleanly without modifying lockfile
RUN pnpm install --frozen-lockfile

# === STAGE 2: Production Runtime Stage ===
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Enable Corepack in runner stage
RUN corepack enable

# Copy installed node_modules from base stage
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json

# Copy application source code
COPY . .

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DOCKER_CONTAINER=true

# Document network port listening
EXPOSE 3000

# Security Best Practice: Switch from 'root' to unprivileged 'node' user
USER node

# Healthcheck instruction for automatic Docker liveness monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Define primary startup command
CMD ["node", "src/server.js"]
