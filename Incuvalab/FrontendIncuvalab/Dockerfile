# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer cache optimization)
COPY package.json package-lock.json ./

# Install ALL dependencies (devDependencies needed for vite build)
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build production bundle (vite build → /app/dist)
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Serve
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
