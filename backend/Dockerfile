############################
# Builder stage
############################
FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build


############################
# Production stage
############################
FROM node:20-bullseye-slim AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Upload directory (Render persistent disk)
RUN mkdir -p /data/uploads/profiles

ENV NODE_ENV=production
ENV PORT=4000
ENV UPLOAD_DIR=/data/uploads

EXPOSE 4000

# ✅ APPLY PRISMA MIGRATIONS BEFORE START
CMD npx prisma migrate deploy && node dist/main.js
