# ==========================================
# Production Multi-Stage Dockerfile for DaeReview (Next.js 16)
# Optimized for Coolify, Docker Compose, and Standalone Deployment
# ==========================================

# 1. Base Image - Node 22 LTS Alpine
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./

# Force NODE_ENV to development during deps installation
# This guarantees that all required build dependencies (Tailwind, PostCSS, TypeScript) are installed
ENV NODE_ENV=development
RUN npm ci --include=dev

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build time (Public Next.js variables)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=https://daereview.daeroom.my.id
ARG NEXT_PUBLIC_GSC_VERIFICATION=_5BNDxoJkGkVL-YfDLstufxHtU9pfpI_YYVncEmX6H4

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_GSC_VERIFICATION=${NEXT_PUBLIC_GSC_VERIFICATION}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 4. Production Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone server
COPY --from=builder /app/public ./public

# Ensure .next directory has proper permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Persistent custom data directory support (optional volume mount)
RUN mkdir -p /app/src/data && chown -R nextjs:nodejs /app/src/data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
