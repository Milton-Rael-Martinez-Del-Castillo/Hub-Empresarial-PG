# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer cache optimization)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build production bundle (tsc + vite build → /app/dist)
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Serve
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional – uncomment if you have nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# nginx runs in foreground by default in the official image
CMD ["nginx", "-g", "daemon off;"]
