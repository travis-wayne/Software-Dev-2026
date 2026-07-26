# =========================================================================
# Lesson 44: Production Multi-Stage Alpine Dockerfile for CI/CD Pipelines
# Demonstrates build argument injection (Git SHA & Timestamp) & layer caching
# =========================================================================

# --- Stage 1: Build & Dependency Resolution ---
FROM node:20-alpine AS builder

WORKDIR /app

# Enable Corepack for lightning-fast pnpm package execution
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifest files first to maximize UnionFS layer cache hits!
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies cleanly
RUN pnpm install --frozen-lockfile --prod

# --- Stage 2: Minimal Production Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

# Accept CI/CD Build Arguments injected by GitHub Actions!
ARG GIT_SHA="untracked-local"
ARG BUILD_DATE="unassigned"
ARG REGISTRY_TAG="latest"

# Persist build arguments as container environment variables for /api/telemetry
ENV GIT_SHA=${GIT_SHA}
ENV BUILD_DATE=${BUILD_DATE}
ENV REGISTRY_TAG=${REGISTRY_TAG}
ENV NODE_ENV=production
ENV PORT=3007

# Create a non-root unprivileged user for Kubernetes security compliance
RUN addgroup --system --gid 1001 nodeapp && \
    adduser --system --uid 1001 --ingroup nodeapp nodeuser

# Copy only compiled production dependencies and application code from stage 1
COPY --from=builder --chown=nodeuser:nodeapp /app/node_modules ./node_modules
COPY --chown=nodeuser:nodeapp package.json .
COPY --chown=nodeuser:nodeapp src/ ./src/

# Switch to unprivileged user
USER nodeuser

EXPOSE 3007

# Start microservice
CMD ["node", "src/server.js"]
