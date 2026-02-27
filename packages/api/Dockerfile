FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/
RUN npm install --workspace=packages/shared --workspace=packages/api
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
RUN npm run build --workspace=packages/shared
WORKDIR /app/packages/api
RUN npx prisma generate
RUN npx nest build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# REMOVE the next line (it breaks):
# COPY --from=builder /app/packages/api/node_modules ./packages/api/node_modules
COPY packages/api/prisma ./prisma
COPY packages/api/start.sh ./start.sh
RUN chmod +x ./start.sh
ENV NODE_PATH=/app/node_modules
CMD ["./start.sh"]