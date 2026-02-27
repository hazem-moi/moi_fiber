FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/
RUN npm install --workspace=packages/shared --workspace=packages/api
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
RUN npm run build --workspace=packages/shared
WORKDIR /app/packages/api

# Install OpenSSL (this gives libssl.so.3 on bookworm)
RUN apt-get update -y && apt-get install -y openssl

# ✅ Use OpenSSL 3.0 engine
ENV PRISMA_BINARY_TARGET=debian-openssl-3.0.x
RUN npx prisma generate
RUN npx nest build

FROM node:20-bookworm-slim
WORKDIR /app

# ✅ Install OpenSSL in final image for runtime
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY packages/api/prisma ./prisma
COPY packages/api/start.sh ./start.sh

# ✅ Set the same env at runtime (ensures consistency)
ENV PRISMA_BINARY_TARGET=debian-openssl-3.0.x

RUN chmod +x ./start.sh
ENV NODE_PATH=/app/node_modules
CMD ["./start.sh"]