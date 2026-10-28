# ─────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev --frozen-lockfile

# ─────────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY server.js ./
COPY src/ ./src/

# Create uploads directory for multer file uploads
RUN mkdir -p Files && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the backend port (default 8000 from server.js)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8000/ || exit 1

# Start the server
CMD ["node", "server.js"]
