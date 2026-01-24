# ---------- Builder ----------
FROM node:20-bookworm AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:20-bookworm AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
RUN mkdir -p /app/uploads/profiles

EXPOSE 4000

CMD ["node", "dist/main"]
